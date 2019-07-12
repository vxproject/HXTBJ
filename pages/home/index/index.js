// pages/home/index/index.js
const oauth = require('../../../utils/oauth.js')
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const cart = require('../../../utils/cart.js')
const push = require('../../../utils/push.js')
const utils = require('../../../utils/util.js')
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    hidden: 0, // 0是默认  1是未登陆   2是已经登陆
    //谢培元
    toView: "k0",
    id: -1,
    code: "-1",
    goods_id: '-1',
    is_member: -1,
    is_time1: false,
    ms_item: {},
    setInter: null,//定时器
    now_time: 0,
    store: {
      scrollTop: false,
      //   动画开关
      flag_an: true,
      //分类开关1是分类展开，2是分类隐藏
      //滚动列表导航选中id
      srcoll_check_id: 0,
      f_seleted: 0,
      flag_class: 2,
      windowHeight: 1000,
      img_path: baseurl.imgPath,
      current: 0,
      categoryList: [],
      page: 1,
      h_height: 0,
      ms_seleted: 0,
      fView: "f0",
      user_id: 0
      //分类项目列表
    },
    is_bijia: false,
    is_tc: false,
    item: null,
    bj_data: [],
    loading: false,
    isRequest: false,
    s_type: 0,
    is_time: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.data.isRequest = true
    setTimeout(a => {
      that.data.isRequest = false
    }, 1000)
    if (options.scene || options.id) {
      var user_id, goods_id = "-1"
      let s_type = 0
      if (options.scene) {
        var scene = decodeURIComponent(options.scene)
        scene = scene.split(',')
        user_id = scene[0]
        if (scene[1]) goods_id = scene[1]
        if (scene[2]) s_type = scene[2]
        console.log(scene)
      } else {
        user_id = options.id
        goods_id = options.goodsid
        if (options.type) s_type = options.type
      }

      that.data.s_type = s_type
      let gurl = ''

      if (s_type == 0) {
        if (goods_id != -1 && goods_id != -2) gurl = "&goods_id=" + goods_id
      }
      let url = baseurl.share_info + "?type=1&id=" + user_id + "" + gurl
      console.log(url)
      request.getRequest(that, url, res => {
        if (res.status == 200) {
          let store = that.data.store
          store.store_name = res.data.store_name
          store.user_id = user_id
          //是否是会员
          if (s_type == 0) that.data.is_member = res.data.is_member

          that.setData({
            code: res.data.code,
            store_name: res.data.store_name,
            store: store,
            goods_id: goods_id,
            user_id: user_id,
          })
        }
      }, c => {
        that.initUI()
      })
    } else {
      that.initUI()
    }
  },
  initUI: function (e) {
    wx.setNavigationBarTitle({
      title: '登陆',
    })
    let that = this

    let login = oauth.islogin()
    if (login) {
      console.info('已经登录')
      //已经登陆
      this.changeLoginState(2);
    } else {
      // 获得openid
      oauth.getOpenid(that, res => {
        // 隐藏tabbar
        that.changeNoLogin(that, res)
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //this.data.is_time = false
    if (this.data.setInter) {
      clearInterval(this.data.setInter)
      this.data.setInter = ''
    }
  },
  no_datatap() {
    this.requestData(-1)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let store = this.data.store
    let that = this
    if (wx.getStorageSync('token') && store.userinfo) {
      cart.updateRedDot(that)
      request.getUserinfo(that, res => {
        this.setData({
          failflag: false
        })
        if (res.is_vip != store.userinfo.is_vip) {
          store.userinfo = res
          that.setData({
            store: store
          })
          that.data.is_tc = false //vip  弹窗
          that.window(that)
        }
      })
      if (this.data.setInter == '') {
        that.miaosha_lsz(that, 1)
      } else {
        if (that.data.store.list_data) that.miaosha_lsz(that, 1)
      }
    }
    if (that.data.isRequest == false) {
      if (app.sx == true) {
        app.sx = false
        that.initUI()
      } else {
        if (!store.list_data) {
          if (store.categoryList[store.srcoll_check_id]) {
            let id = store.categoryList[store.srcoll_check_id].id
            if (store.categoryList[store.srcoll_check_id].is_hot == 1) id = -1
            that.requestData(id)

          }
        }
      }
    }


  },
  /**
   * APP启动次数统计
   */
  appview(token) {
    let that = this;
    request.postRequest(that, baseurl.appview, { type: 'wechat', token: token }, res => {
    })
  },

  // 改变登陆状态
  changeLoginState(hidden) {
    this.setData({
      hidden: hidden
    })
    if (hidden == 2) {
      let that = this
      wx.setNavigationBarTitle({
        title: '商城',
      })
      wx.showTabBar({})
      request.getRequest(that, baseurl.user_info, success => {
        if (success.status == 200) {
          that.appview(success.data.token);
          app.userinfo = success.data
          that.setData({
            hidden: 3,
            failflag: false
          })
          let store = that.data.store
          store.userinfo = success.data
          that.saveStore(store)
          that.requestData(-1)
          if (that.data.goods_id != '-1' && that.data.goods_id != '-2') {
            //是否是会员商品
            if (that.data.s_type == 1) {

              wx.navigateTo({
                url: '../../kanjia/kj_info/kj_info?user_id=' + that.data.user_id + "&goods_id=" + that.data.goods_id,
              })
            } else {
              if (that.data.is_member == 0) wx.navigateTo({
                url: '../../other/goods_detail/goods_detail?goods_id=' + that.data.goods_id,
              })
              else {
                if (app.userinfo.is_vip == 0) {
                  wx.navigateTo({
                    url: '../../other/desc_detail/desc_detail?goods_id=' + that.data.goods_id,
                  })
                }
              }
            }

          } else if (that.data.goods_id == '-2')
            wx.navigateTo({
              url: '../../person/collection_list/collection_list?goods_id=' + that.data.user_id,
            })
          cart.updateRedDot(that)
        }
      })
    }
  },
  // 未登陆状态处理
  changeNoLogin(that, res) {
    let hidden = 1
    //需要授权
    if (res.flag == -1) {
      wx.hideTabBar({
        animation: false //拿openid换取unionid个人信息
      })
      that.setData({
        flag: 0
      })
    } else if (res.flag == 0)
      that.setData({
        flag: 1
      }) //需要绑定手机号
    else hidden = 2
    //已经登陆
    this.changeLoginState(hidden)
  },
  // 获取个人信息
  getuserinfo: function (e) {
    let that = this
    oauth.get_wxinfo(that, e, res => {
      // that.setData({
      //   flag: 1
      // })
      that.changeNoLogin(that, res)
    })
  },
  //提交
  tijiao: function () {
    this.changeLoginState(2)
  },

  //  显示和隐藏分类框
  show_class_hide: function (e) {
    var that = this;
    let store = that.data.store
    let flag_class = 2
    if (store.flag_class == 2) {
      flag_class = 1
    } else {
      let index = e.currentTarget.dataset.id
      if (index != -1 && index != store.srcoll_check_id) {
        store.srcoll_check_id = index
        store.toView = "k" + index
        store.f_seleted = 0
        store.fView = "f0"
        let id = store.categoryList[index].id
        if (store.categoryList[index].is_hot == 1) id = -1
        this.requestData(id)
      }
    }
    store.flag_class = flag_class
    that.saveStore(store)

  },
  //幻灯图样式
  goodsSwipter: function (e) {
    let current = e.detail.current
    let store = this.data.store
    store.current = current
    this.saveStore(store)
  },

  // 顶部导航
  topNav: function (e) {
    let index = e.detail.index
    // let index = e.currentTarget.dataset.index
    let store = this.data.store

    if (index == store.srcoll_check_id) return
    store.srcoll_check_id = index
    this.navButtonClick(index, store)
  },
  // 下拉刷新的方法
  navButtonClick: function (index, store) {
    // if (store.srcoll_check_id == 0){
    //   store.toView = "k" + (index-2)
    // }else{
    //   store.toView =''
    // }
    // store.toView = "k" + (index-2)

    store.f_seleted = 0
    store.fView = "f0"

    let id = store.categoryList[index].id
    if (store.categoryList[index].is_hot == 1) id = -1
    this.requestData(id, 1)
    // this.saveStore(store)
  },

  /**
   * 限时  更多
   */
  lookmore(e) {
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/home/miaosha/miaosha?cid=' + cid,
    })
  },
  // 页面数据
  requestData: function (id) {
    let that = this
    //请求页面数据
    let d = that.data
    let url = id == -1 ? baseurl.index : baseurl.category + "?id=" + id
    request.getRequest(that, url, res => {
      this.setData({
        failflag: false
      })
      let store = that.data.store
      if (id == -1) {
        store.categoryList = res.data.categoryList
        store.lsz_flag = true;   //因为回调先后， 固填一下一个字段
        if (!that.data.is_tc) {
          that.window(that);
        }
      }
      //测试
      store.list_data = res.data
      that.miaosha_lsz(that, 0);
      that.saveStore(store)
    })
  },
  /**
   * 获取秒杀信息
   */
  miaosha_lsz(that, flag) {

    request.getRequest(null, baseurl.flash_xu, res => {
      that.data.store.list_data.spikeList = res.data
      that.setData({
        store: that.data.store
      })
      if (res.data) that.countDown1(res.data)
      else {
        if (that.data.setInter) {
          clearInterval(that.data.setInter)
          this.data.setInter = ''
        }
      }

    })
  },
  // 新版的倒计时
  countDown1: function (e) {
    console.log(e)
    let time = 0, that = this
    if (e.is_start == 0) {
      this.data.now_time = e.start_time - e.now
    } else {
      this.data.now_time = e.end_time - e.now
    }
    //倒计时开始
    if (that.data.setInter) {
      return
    }
    that.data.is_time = true
    that.data.setInter = setInterval(res => {
      let time_obj = {}
      if (that.data.now_time > 0) {
        let time = that.data.now_time
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        time_obj = {
          hou: that.timeFormat(day) > 0 ? that.timeFormat(day) * 24 + that.timeFormat(hou) * 1 : that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        }
        that.data.now_time--;
        that.data.store.time = time_obj
        that.setData({
          store: that.data.store
        })
      } else {
        time_obj = {
          hou: '00',
          min: '00',
          sec: '00'
        }
        that.data.store.time = time_obj
        that.setData({
          store: that.data.store
        })
        setTimeout(() => {
          that.miaosha_lsz(that, 1)
        }, 1000)
      }
    }, 1000)
  },
  countDown: function (flag) {
    let that = this
    if (!that.data.store.list_data) {
      that.data.is_time = false
      return
    }
    if (!that.data.store.list_data.spikeList) {
      that.data.is_time = false
      return
    }
    if (that.data.is_time == false) return
    let store = that.msTime(that.data.store.list_data.spikeList, flag)
    that.setData({
      store: store
    })
    setTimeout(res => {
      that.countDown(flag)
    }, 1000)
  },

  msTime: function (ms_item, flag) {
    let that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let time = 0
    if (ms_item.is_start == 0) {
      time = ms_item.start_time - timestamp
    } else {
      time = ms_item.end_time - timestamp
    }
    let obj = {
      hou: '00',
      min: '00',
      sec: '00'
    }
    if (time > 0) {
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        hou: that.timeFormat(day) > 0 ? that.timeFormat(day) * 24 + that.timeFormat(hou) * 1 : that.timeFormat(hou),
        min: that.timeFormat(min),
        sec: that.timeFormat(sec)
      }
      that.data.store.time = obj
      return that.data.store
    } else {
      that.data.store.time = obj
      if (flag == 0) that.miaosha_lsz(that, 1)
      return that.data.store
    }
  },

  shoupan: function (e) {
    return;
  },
  shuaxin: function (e) {
    wx.startPullDownRefresh()
  },
  timeFormat: function (param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  /**
   * 弹窗
   */
  window(_that) {

    push.push_alert(_that, res => {
      if (res.data) { //如果有数据
        let item = res.data;
        item.imgsrc = baseurl.imgPath
        //   item.btn_color = "#ffb90f";
        // item.btn = "查看详情";
        item.testFlag = true
        _that.setData({
          item: item,
        })
        _that.data.is_tc = true
      }
    })
  },

  fldata: function (id, page = 1) {
    let that = this
    let store = that.data.store
    request.getRequest(that, baseurl.good_list + "?id=" + id + "&page=" + page, res => {
      if (res.status == 200) {
        if (page == 1) {
          store.list_data.list = res.data
        } else {
          //数据拼接
          request.tixing(res.data.data)
          res.data.data = store.list_data.list.data.concat(res.data.data)
          store.list_data.list = res.data
        }
        that.saveStore(store)
      }
    })

  },
  // 改变位置
  changefl: function (e) {
    let index = e.currentTarget.dataset.index
    let store = this.data.store
    if (index == store.f_seleted) return
    store.f_seleted = index
    store.fView = "f10"
    this.fldata(store.list_data.child[index].id)
    this.saveStore(store)
  },
  // 更新数据
  saveStore: function (store) {
    this.setData({
      store: store
    })
  },
  // 偏移量
  onPageScroll: function (e) {
    let that = this;
    let store = that.data.store;
    if (e.scrollTop > 140 && store.scrollTop == false) {
      store.scrollTop = true;
      that.setData({
        store: store
      })
    } else if (e.scrollTop <= 140 && store.scrollTop == true) {
      store.scrollTop = false;
      that.setData({
        store: store
      })
    }
  },
  // 秒杀选项
  miaosha: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let store = that.data.store
    if (index == store.ms_seleted) return
    this.miaoshaData(store.list_data.list[index], 1)
    store.ms_seleted = index
    that.saveStore(store)
  },
  //热卖商品
  fldata2: function (page = 1) {
    let that = this
    let store = that.data.store
    request.getRequest(that, baseurl.index + "?page=" + page, res => {
      if (res.status == 200) {
        //数据拼接
        request.tixing(res.data.hot.data)
        if (res.data.hot.data.length <= 0) return
        res.data.hot.data = store.list_data.hot.data.concat(res.data.hot.data)
        store.list_data.hot = res.data.hot
        that.saveStore(store)
      }
    })

  },
  // 添加购物车
  addgwc: function (e) {
    let goodsid = e.currentTarget.dataset.id
    cart.addgwc(this, goodsid, 1)
  },
  goodsDetail: function (e) {
    let goodsid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + goodsid,
    })
  },
  // 消息列表
  messagelist: function (e) {
    wx.navigateTo({
      url: '../index_info/index_info',
    })
  },
  miaoshaData: function (e, page) {
    let that = this
    request.getRequest(that, baseurl.flash_sale + "?page=" + page + "&time=" + e, res => {
      if (res.status == 200) {
        let store = that.data.store
        if (page == 1) store.list_data.flashSale = res.data
        else {
          if (res.data.data.length == 0) {
            request.tixing(res.data.data)
          } else {
            res.data.data = store.list_data.flashSale.concat(res.data.data)
            store.list_data.flashSale = res.data
          }
        }
        that.saveStore(store)
      }
    })
  },
  search: function () {
    wx.navigateTo({
      url: '../index_search/index_search',
    })
  },
  // 跳转网页
  navClick: function (e) {

    let item = e.currentTarget.dataset.item,
      that = this
    if (item.param) {
      item.value = item.param;
      item.desc = item.title;
    }
    if (item.category) {
      item.value = item.category;
      item.desc = "特价专区"
    }
    let url = item.value,
      str = '',
      canshu = {}
    if (url.length <= 0) return
    if (url.indexOf('?') != '-1') {
      str = url.split("?");
      url = str[0]
      if (str[1].indexOf("&amp;") != '-1') str = str[1].replace('&amp;', '*')
      else if (str[1].indexOf("&") != '-1') str = str[1].replace(/\&/g, '*')
      if (str.indexOf("=") != '-1') str = str.replace(/\=/g, '$')
    } else str = 'ys'
    url = baseurl.baseURL + "" + url
    wx.navigateTo({
      url: '../../other/webview/webview?title=' + item.desc + '&str=' + str + '&url=' + url,
    })
    that.cancel(); //隐藏弹窗
  },
  kanjia: function (e) {
    wx.navigateTo({
      url: '../../kanjia/index/index',
    })
  },

  //
  cyClick: function (e) {
    wx.navigateTo({
      url: '../member_list/member_list',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let store = this.data.store
    let index = store.srcoll_check_id
    let id = store.categoryList[index].id
    if (index != 0 && store.f_seleted != 0) {
      id = store.list_data.child[store.f_seleted].id
      this.fldata(id, 1)
    } else {
      this.navButtonClick(index, store)
    }
    setTimeout(res => {
      wx.stopPullDownRefresh()
    }, 1000)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    let store = that.data.store
    if (store.categoryList[store.srcoll_check_id].is_hot == 0) {
      let list = store.list_data.list
      if (list.last_page <= list.current_page) {
        request.tixing([])
        return
      }
      if (store.list_data.child.length > store.f_seleted) this.fldata(store.list_data.child[store.f_seleted].id, list.current_page + 1)
    } else {
      let hot = store.list_data.hot
      if (hot.last_page <= hot.current_page) {
        request.tixing([])
        return
      }
      this.fldata2(hot.current_page * 1 + 1)
    }
  },


  /**
   * 阻止滑动
   */
  catchtouchmove() {
    return;
  },
  /**
   * 模板 弹窗隐藏 事件
   */
  cancel() {
    let item = this.data.item
    if (!item) return
    item.testFlag = false
    this.setData({
      item: item
    })
  },

  /**
   * 模板 弹窗 按钮
   */
  catchbtn(e) {
    let that = this;
    let type = e.currentTarget.dataset.item.type; //弹框类型 
    let param = e.currentTarget.dataset.item.param; //参数
    if (type == 2) {
      wx.navigateTo({
        url: '../../other/goods_detail/goods_detail?goods_id=' + param,
      })
    }
    if (type == 3 || type == 4 || type == 5) {
      wx.navigateTo({
        url: '/pages/person/quan/quan',
      })
    }
    that.cancel(); //隐藏弹窗
  },

  // 比价点击数据
  bijiaClick: function (e) {
    let that = this
    let d = that.data
    if (d.bj_data.length > 0) {
      that.setData({
        is_bijia: true,
      })
      return
    }

    let item = e.currentTarget.dataset.item
    let goods_id = item.goods_id
    push.parity(that, goods_id, res => {
      let bj_data = {}
      if (!res.data) {
        utils.showmodel('暂未找到此商品比价信息')
        return
      }
      bj_data.pingtai = res.data
      // 自己产品参数
      let cs = {
        shop_price: item.shop_price,
        goods_name: item.goods_name,
        goods_image: baseurl.imgPath + "" + item.original_img
      }
      bj_data.imgPath = baseurl.imgPath
      bj_data.cs = cs
      that.setData({
        is_bijia: true,
        bj_data: bj_data
      })
    })


  },

  clear: function (e) {
    this.setData({
      is_bijia: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    if (e.from == "button") {
      let title = e.target.dataset.title
      let id = e.target.dataset.id
      return request.share(title, id, 0);
    } else
      return request.share()
  }
})