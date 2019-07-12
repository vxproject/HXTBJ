// pages/kanjia/kj_info/kj_info.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const utils = require('../../../utils/util.js')
const kanjia = require('../../../utils/kanjia.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //区分自己进来的还是别人进来的
    type: 1,
    scrollview: false,
    chop_goods_id: -1,
    list_data: null,
    hidden: 0,
    img_path: baseurl.imgPath,
    isTime: false,
    is_kj: 0,
    jindu_data: {},
    moreTxt: '查看更多',
    kjbHeight: 260,
    stateData: [{ title: '分享到3个群,可以多砍一刀', image: ["cloud://hxt-cdff72.6878-hxt-cdff72/kanjia/hhaoyou.png"], click: ['hanhaoyou'] }, { title: '恭喜你砍价成功啦，即将为你发货', image: ["cloud://hxt-cdff72.6878-hxt-cdff72/kanjia/xuanyao.png","cloud://hxt-cdff72.6878-hxt-cdff72/kanjia/chakan.png"], click: ['hanhaoyou' ,"orderDetail"]}, { title: '未在24小时内完成，砍价已过期', image: ["cloud://hxt-cdff72.6878-hxt-cdff72/kanjia/namore.png"], click: ['hanhaoyou'] }],
    kj_states:['恭喜你砍价成功啦，即将为你发货',"未在24小时内完成，砍价已过期"],
    moreimage:'../../../images/kanjia/xia.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.user_id)
    console.log(app.userinfo)
    let that = this
    if (options.chop_goods_id){
      that.data.chop_goods_id = options.chop_goods_id
      that.data.is_kj = options.is_kj
      that.initUI(that.data.chop_goods_id)
    } else if (options.goods_id){
      that.data.chop_goods_id = options.goods_id
      if (options.user_id == app.userinfo.user_id) {
        that.initUI(that.data.chop_goods_id)
      }
      else that.stateUI(that.data.chop_goods_id)
      
    } 
    // that.data.chop_goods_id = 71
    //   that.stateUI(71)
  },
  //初始化列表
  initUI: function(chop_goods_id) {
    let that = this
    request.getRequest(that, baseurl.chop_detail + "?chop_goods_id=" + chop_goods_id, res => {
      that.setData({
        hidden: 1,
        type:1,
        list_data: res.data
      })
      if (that.data.is_kj == 0) that.kanjia()
      if (that.data.isTime == false) {
        that.data.isTime = true
        that.countDown()
      }
    })
  },
  //别人进来砍价
  stateUI: function (chop_goods_id){
    let that = this
    request.getRequest(that, baseurl.chop_share + "?chop_goods_id=" + chop_goods_id, res => {
      console.log(res)
      that.setData({
        hidden: 1,
        list_data: res.data,
        type:2
      })

      if (that.data.isTime == false) {
        that.data.isTime = true
        that.countDown()
      }
    })
  },
  //自己砍价
  kanjia: function(e) {
    let that = this
    kanjia.kanjia(that, that.data.chop_goods_id, res => {
      if(res.data.chop_user){
        let jindu_data = {
          money: res.data.chop_user.money,
          jindu: res.data.chop_user.money / res.data.chop_goods_info.goods_shop * 100,
          chop_goods_id: that.data.chop_goods_id,
          title: that.data.list_data.info.goodsInfo.goods_name
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.initUI(1)
        that.setData({
          jindu_data: jindu_data,
          is_kj: 2
        })
      }else{
        if (res.data.chop_goods_info.status == 1 || res.data.chop_goods_info.status == 2) {
          let title = res.data.chop_goods_info.status == 1 ? "砍价已完成" : "砍价已失败"
          utils.showmodel(title, res => {
            that.data.is_kj = 1
            if (that.data.type == 1) that.initUI(that.data.chop_goods_id)
            else that.stateUI(that.data.chop_goods_id)
          })
        }
      }
 
    
    })
  },
  // 关闭砍价弹窗
  closeTC: function(e) {
    this.setData({
      is_kj: 1
    })
    if (this.data.type == 1) this.initUI(this.data.chop_goods_id)
    else this.stateUI(this.data.chop_goods_id)
  },
  //倒计时
  countDown: function() {
    let that = this
    if (that.data.isTime == false) {
      return
    }
    that.data.isTime = true
    let list_data = that.data.list_data
    if (!list_data) {
      that.data.isTime = false
      return
    }
    if (list_data.info.status != 0) {
      that.data.isTime = false
      return
    }
    setTimeout(res => {
      that.countDown()
    }, 1000)
    list_data = kanjia.detailTime(list_data, that, that.data.type, that.data.chop_goods_id)
    that.setData({
      list_data: list_data
    })
  },
  kanjiaDetail:function(e){
    console.log()
    let that = this
    let iskj = e.currentTarget.dataset.iskj
    //如果是0的话需要砍价
    //如果是1的话是免费拿
    if(iskj == 1 || that.data.list_data.info.status !=0 
    ) wx.redirectTo({
      url: '../index/index',
    })
    else{
      //点击砍价  刷新界面
      kanjia.kanjia(that,that.data.chop_goods_id,res=>{
        if (res.data.chop_user) {
          let mianfeina_data = {
            price: res.data.chop_user.money,
            head_img: that.data.list_data.userInfo.head_pic
          }
          that.setData({
            mianfeina_data: mianfeina_data,
            is_kj: 3
          })
        } else {
          if (res.data.chop_goods_info.status == 1 || res.data.chop_goods_info.status == 2) {
            let title = res.data.chop_goods_info.status == 1 ? "砍价已完成" : "砍价已失败"
            utils.showmodel(title, res => {
              that.data.is_kj = 1
              if (that.data.type == 1) that.initUI(that.data.chop_goods_id)
              else that.stateUI(that.data.chop_goods_id)
            })
          }
        }



              
      }) 
    }
  },
  ceshi:function(e){
    return;
  },
  mianfei_pay:function(e){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  //加载更多
  loadmore: function(e) {
    this.setData({
      moreTxt: this.data.moreTxt == "查看更多" ? "收起" : "查看更多",
      kjbHeight: this.data.moreTxt == "查看更多" ? 640 : 260,
      scrollview: this.data.moreTxt == "查看更多" ? true : false,
      moreimage: this.data.moreTxt == "查看更多" ? '../../../images/kanjia/shang.png' : '../../../images/kanjia/xia.png',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    if (that.data.isTime == false) {
      that.data.isTime = true
      that.countDown()
    }
  },
  hanhaoyou:function(e){
    // wx.redirectTo({
    //   url: '../index/index',
    // })
    wx.navigateBack({
      delta:1
    })
  },
  orderDetail:function(e){

    wx.navigateTo({
      url: '../../other/webview/webview?url=' + baseurl.wuliuh5 + "&title=物流" + "&rec_id=" + this.data.list_data.info.rec_id,
    })
  
 
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.data.isTime = false
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.isTime = false
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    console.log(e)
    let that = this
    let goods_name = that.data.list_data.info.goodsInfo.goods_name
    let title = this.data.list_data.share_info.title
    let index = Math.floor(Math.random() * title.length)
    let sz = ["我的免费拿已经发货了，心动不如行动！GO~",
      "谢谢大家给力“砍”，"+goods_name+"商品已经在路上了",
      "我的砍价成功了，喜欢的朋友可以一起0元拿！",
      "谢谢好友助力，我的0元水果即将发货！",
      "砍砍砍，0元购水果，走过路过不要错过~",
      "朋友一声吼，砍价0元拿，你也可以！",
      "我已免费领取水果，你也快选心仪水果领取吧！"]
    
    if (e.from == 'button'){
      if (title) title = title[index]
   
      else title = e.target.dataset.title
    
      if (that.data.type == 1 && that.data.list_data.info.status == 1) {
        title = sz[Math.floor(Math.random() * sz.length)]
      }
      let  id = e.target.dataset.id;
      return request.share(title, id,1);
    }else{
      //点击上方分享
      let that = this
      if (title) title = title[index]
      else title = that.data.list_data.info.goodsInfo.goods_name
       let id = that.data.list_data.info.chop_goods_id
      if (that.data.type == 1 && that.data.list_data.info.status == 1) {
        title = sz[Math.floor(Math.random() * sz.length)]
      }
      console.log(title)
      return request.share(title, id, 1);
    }
  }
})