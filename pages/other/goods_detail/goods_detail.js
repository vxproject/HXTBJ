// pages/goods_detail/goods_detail.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const cart = require('../../../utils/cart.js')
const push = require('../../../utils/push.js')
const utils = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miaoshaFlag: true,  // false:距开始  true :距结束
    overFlag: true,// true:未抢完  false :已抢完
    haveFlag: true, // 假价格   true:有  false:没有 
    is_miaosha: false, //秒杀商品  true ：秒杀商品  false:普通商品
    youFlag: true, //是否售罄
    topState: false,//顶部隐藏
    // dw_top:759,  //商品详情
    is_dw: false,//商品详情是否定位

    arr: ['图文详情', '客服说明'],
    setInter: null,//定时器
    now_time: 0,
    isRequest: false,

    is_scrollview: false,
    goods_id: 0,
    pj_seleted: 0,
    is_scroll_top: 0,
    scrollTop: 0,
    windowHeight: 562,
    //底部弹出框数据
    showModalStatus: false,
    animationData: {},
    list_data: null,
    hidden: 0,
    img_path: baseurl.imgPath,
    topData: ["简介", "详情", "评价"],
    seleted: 0,
    otherSeleted: 0,
    gg_seleted: 0,
    num: 1,
    l_quan: false,
    gg_flag: 0,
    comment_list: [],
    img_path2: baseurl.baseURL,
    kf_img: '/public/api/extri/shuoming.jpg',
    // 比价弹窗隐藏
    is_bijia: false,
    //比价数据源
    bj_data: [],
    time: {}, is_time: false
  },
  //获取屏幕高度
  gain_height: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          is_vip: app.userinfo.is_vip
        })
      }
    })
  },
  //底部弹框点击
  showModal: function (e) {
    let flag = e.currentTarget.dataset.flag
    var that = this;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      gg_flag: flag
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gain_height();
    this.data.goods_id = options.goods_id
    this.getRequest(options.goods_id)
    let that = this
    //获取商品详情的位置
  },
  getRequest: function (id) {
    let that = this
    if (that.data.isRequest == true) return
    that.data.isRequest = true
    request.getRequest(that, baseurl.goods_info + "?goods_id=" + id, res => {
      if (res.status == 200) {
        this.setData({
          shop_price: res.data.shop_price.split('.'),
          list_data: res.data,
          hidden: 1,
          is_loading: true
        })
        if (res.data.flashSale[0]) {
          that.countDown1(res.data.flashSale[0])
          //未抢完
          let overFlag = true, youFlag = true
          console.log(res.data)
          if (res.data.flashSale[0].status == 2) {
            overFlag = false
            youFlag = false
          }
          that.setData({
            overFlag: overFlag,
            youFlag: youFlag
          })
        } else {
          that.setData({
            overFlag: true,
            youFlag: true
          })
          if (that.data.setInter) {
            clearInterval(that.data.setInter)
            this.data.setInter = ''
          }
        }
        if (that.data.is_loading == true)
          setTimeout(() => {
            that.setData({
              is_loading: false
            })
            wx.createSelectorQuery().select('.line-ls-model').boundingClientRect().exec(
              res => {
                that.setData({
                  dw_top: res[0].top - 70
                })
              }
            )
          }, 500)

      }
    }, res => {
      that.data.isRequest = false
    })
  },
  // 新版的倒计时
  countDown1: function (e) {

    let time = 0, that = this
    let end_time = e.end_time
    let start_time = e.start_time
    let timestamp = e.now
    let miaoshaFlag = false
    if (timestamp > end_time) {
      //已经结束
      that.data.now_time = -1
    } else if (timestamp < start_time) {
      //未开始
      that.data.now_time = start_time - timestamp
    } else {
      //进行中
      that.data.now_time = end_time - timestamp
      miaoshaFlag = true
    }
    that.setData({
      miaoshaFlag: miaoshaFlag
    })
    //倒计时开始
    if (that.data.setInter) {
      return
    }
    that.data.setInter = setInterval(res => {
      let time_obj = {}, is_miaosha = false, flag = 0
      if (that.data.now_time > 0) {
        miaoshaFlag = true
        is_miaosha = true
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
        that.setData({
          time: time_obj,
          is_miaosha: is_miaosha,
          flag: flag
        })

      } else {
        time_obj = {
          hou: '00',
          min: '00',
          sec: '00'
        }
        is_miaosha = false
        setTimeout(() => {

          that.getRequest(that.data.goods_id)
        }, 1000)
        that.setData({
          time: time_obj,
          is_miaosha: is_miaosha,
          flag: flag
        })
      }
    }, 1000)
  },

  timeFormat: function (param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  changeSeleted: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let seleted = this.data.seleted
    if (index == seleted) return
    this.setData({
      seleted: index,
      otherSeleted: 0
    })

    if (index == 2) {
      that.setData({
        topState: true,
        is_dw: false
      })
      this.commentRequest(0, 1)
      setTimeout(res => {
        this.commentRequest(1, 1, true)
      }, 1000)
    } else {
      if (this.data.comment_list[0]) {
        this.data.comment_list = []
      }
      if (index == 1) {
        that.setData({
          topState: true,
        })
      } else if (index == 0) {
        that.setData({
          is_dw: false,
        })
      }
    }
  },

  onPageScroll: function (e) {
    let scrollTop = e.scrollTop
    let that = this
    if (that.data.seleted != 0) {
      that.setData({
        topState: true,
        is_dw: that.data.seleted == 1 ? true : false
      })
      return
    }
    if (scrollTop > 10 && that.data.topState == false) {
      that.setData({
        topState: true
      })
    }
    if (scrollTop <= 10 && that.data.topState) {
      that.setData({
        topState: false
      })
    }
    if (scrollTop >= that.data.dw_top && that.data.is_dw == false) {
      that.setData({
        is_dw: true
      })
    }
    if (scrollTop < that.data.dw_top && that.data.is_dw) {
      that.setData({
        is_dw: false
      })
    }
    // if (that.data.seleted != 0) {
    //   that.setData({
    //     topState: true,
    //     is_dw: that.data.seleted == 1 ? true : false
    //   })
    //   return
    // }
    // if (scrollTop > 10 && that.data.topState == false) {
    //   that.setData({
    //     topState: true
    //   })
    // } else if (scrollTop <= 10 && that.data.topState == true) {
    //   that.setData({
    //     topState: false
    //   })
    // }
    // if (scrollTop >= that.data.dw_top && that.data.is_dw == false) {
    //   that.setData({ is_dw: true})
    // }
    // else if (scrollTop < that.data.dw_top && that.data.is_dw == true) {
    //   that.setData({ is_dw: false })
    // }
  },
  commentRequest: function (flag, page, loading = false) {
    let that = this
    let goods_id = this.data.list_data.goods_id
    request.getRequest(that, baseurl.comment + "?page=" + page + "&goods_id=" + goods_id + "&is_img=" + flag, res => {
      if (res.status == 200) {
        let comment_list = that.data.comment_list
        if (page == 1) {
          comment_list[flag] = res.data
        } else {
          request.tixing(res.data.data)
          res.data.data = comment_list[flag].data.concat(res.data.data)
          comment_list[flag] = res.data
        }
        that.setData({
          comment_list: comment_list
        })
      }

    }, c => {

    }, loading)
  },
  changeOseleted1: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let pj_seleted = this.data.pj_seleted
    if (index == pj_seleted) return
    this.setData({
      pj_seleted: index
    })
  },

  changeOseleted: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let otherSeleted = this.data.otherSeleted
    if (index == otherSeleted) return
    this.setData({
      otherSeleted: index
    })
    // console.log(this.data.seleted)
    // console.log(this.data.otherSeleted[index])
    if (this.data.seleted == 2 && !this.data.comment_list[index]) {
      this.commentRequest(index, 1, true)
    }
  },
  changeggSeleted: function (e) {
    let index = e.currentTarget.dataset.index
    let gg_seleted = this.data.gg_seleted
    if (index == gg_seleted) return
    this.setData({
      gg_seleted: index
    })

  },
  changeNum: function (e) {
    let flag = e.currentTarget.dataset.flag
    let num = this.data.num
    let that = this
    if (flag == "0" && num == 1) return
    num = flag == 0 ? num - 1 : num + 1
    if (that.data.list_data.flashSale[0]) {
      if (that.data.list_data.flashSale[0].buy_limit < num) {
        wx.showToast({
          icon: 'none',
          title: '抱歉，每人限购' + that.data.list_data.flashSale[0].buy_limit + "件",
        })
        return
      }
    }
    this.setData({
      num: num
    })
  },
  changequan: function (e) {
    this.setData({
      l_quan: true
    })
  },
  // 去购物车
  navgwc: function () {
    wx.switchTab({
      url: '../../cart/index/index',
    })
  },
  // 加入购物车
  toCar: function () {
    let that = this
    let goods_id = that.data.list_data.goods_id
    let num = that.data.num
    let index = that.data.gg_seleted
    let itemid = that.data.list_data.specGoodsPrice[index].item_id

    if (that.data.list_data.flashSale[0]) {
      if (that.data.list_data.flashSale[0].buy_limit < num) {
        wx.showToast({
          icon: 'none',
          title: '抱歉，每人限购' + that.data.list_data.flashSale[0].buy_limit + "件",
        })
        return

      }
    }
    cart.addgwc(that, goods_id, num, res => {
      if (res.status == 200) {
        that.hideModal()
        that.getRequest(goods_id)
      }
    }, itemid)



  },
  // 立即购买
  goumai: function () {
    let that = this
    let goods_id = that.data.list_data.goods_id
    let num = that.data.num
    let index = that.data.gg_seleted
    let itemid = that.data.list_data.specGoodsPrice[index].item_id

    if (that.data.list_data.flashSale[0]) {
      if (that.data.list_data.flashSale[0].buy_limit < num) {
        wx.showToast({
          icon: 'none',
          title: '抱歉，每人限购' + that.data.list_data.flashSale[0].buy_limit + "件",
        })
        return
      }
    }

    wx.navigateTo({
      url: '../buy_goods/buy_goods?goods_id=' + goods_id + "&goods_num=" + num + "&item_id=" + itemid,
    })





  },
  //跳转评价
  tzpingjia: function () {
    this.setData({
      seleted: 2,
      otherSeleted: 0
    })
    this.commentRequest(0, 1)
    setTimeout(res => {
      this.commentRequest(1, 1, true)
    }, 1000)
  },
  // 评价上拉加载
  scrolltolower: function (e) {
    let d = this.data
    this.commentRequest(d.otherSeleted, d.comment_list[d.otherSeleted].current_page * 1 + 1)
  },
  // 这个是预览图片
  prveImage: function (e) {
    console.log()
    let that = this
    let image = that.data.img_path + "" + e.currentTarget.dataset.image
    let images = e.currentTarget.dataset.imgs
    images = images.split(',')
    images.forEach((item, index) => {
      images[index] = that.data.img_path + "" + item
    })
    wx.previewImage({
      current: image,
      urls: images,
    })
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
    let l = d.list_data
    let goods_id = l.goods_id
    push.parity(that, goods_id, res => {
      let bj_data = {}
      if (!res.data) {
        utils.showmodel('暂未找到此商品比价信息')
        return
      }
      bj_data.pingtai = res.data
      // 自己产品参数
      let cs = {
        shop_price: l.specGoodsPrice[d.gg_seleted].price,
        goods_name: l.goods_name,
        goods_image: baseurl.imgPath + "" + l.goodsImages[0].image_url
      }
      bj_data.imgPath = baseurl.imgPath
      bj_data.cs = cs
      that.setData({
        is_bijia: true,
        bj_data: bj_data
      })
    }, l.specGoodsPrice[d.gg_seleted].item_id)


  },

  clear: function (e) {
    this.setData({
      is_bijia: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.setInter) {
      clearInterval(this.data.setInter)
      this.data.setInter = ''
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let seleted = this.data.seleted
    if (seleted == 2) {
      let otherSeleted = this.data.otherSeleted
      let comment_list = this.data.comment_list
      this.commentRequest(otherSeleted, comment_list[otherSeleted].current_page * 1 + 1)
    }
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    let that = this
    return request.share(that.data.list_data.goods_name, that.data.list_data.goods_id)
  }
})