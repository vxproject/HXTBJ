// pages/order_detail/order_detail.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const orderstate = require('../../../utils/orderstate.js')
const order = require('../../../utils/order.js')
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pid:2,
        hidden:0,
        list_data:null,
      topData: [{ title: '待付款', imgurl:'../../../images/order/goods_fukuan.png'},
        { title: '订单取消', imgurl: '../../../images/order/goods_fail.png' },
        { title: '待发货', imgurl: '../../../images/order/goods_beihuo.png' },
        { title: '待收货', imgurl: '../../../images/order/goods_shouhuo.png' },
        { title: '已收货', imgurl: '../../../images/order/goods_success.png' },
        { title: '已完成', imgurl: '../../../images/order/goods_success.png' },
        { title: '退货款', imgurl: '../../../images/order/goods_success.png' }],
      state: 0,  //0:代付款 1：订单取消 2：待发货 3：待发货 4、已收货  5、以评论
      img_path: baseurl.imgPath,
        isTime:false,
        options:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu()
      this.data.options = options
      if (options.order_id){
        this.orderData(options.order_id,"1")
      }else{
        this.orderData(options.rec_id,"2")
      }
      
    },
    orderData:function(id,flag){
      let that = this
      let url = flag == "1" ? baseurl.order_detail + "?order_id=" + id : baseurl.order_detail + "?rec_id=" + id
      request.getRequest(that,url,res=>{
        if(res.status == 200){
          let state = orderstate.orderstate(res.data)
          that.setData({
            hidden:1,
            list_data:res.data,
            state: state
          })
          if (state == 0) that.countDown()
        }
      })
    },
  countDown:function(){
    let list_data = this.data.list_data
    let that = this
    if(list_data){
      if (list_data.deleted == 0 && list_data.pay_status == 0) {
        setTimeout(res => {
          if (this.data.isTime == true) return
          console.log('走吗')
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          let time = list_data.pay_last_time - timestamp
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          if (time <= 0) {
            list_data.time = null
            that.cancelOrder(list_data.order_id)
          } else {
            list_data.time = "" + that.timeFormat(hou) + ":" + that.timeFormat(min) + ":" + that.timeFormat(sec)
          }
          that.setData({
            list_data: list_data
          })
          that.countDown()


        }, 1000)
      }
    }
    
  },
  timeFormat: function (param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  cancelOrder1: function (orderid,that) {
    // that.postRequest(orderid)
  },
  orderClick:function(e){
    console.log()
    let flag = e.currentTarget.dataset.flag
    let list_data = this.data.list_data
    let orderid = list_data.order_id
    let goods = list_data.goodsInfo[0]
    console.log(goods)
    if (flag == 1) this.cancelOrder(orderid) // 取消订单 
    else if (flag == 2) this.payOrder(list_data.order_sn) //立即付款
    else if (flag == 3) this.wuliu(goods.rec_id)   //物流
    else if (flag == 4) this.shouhuo(goods.rec_id)  //确认收货
    else if (flag == 5) this.payAgain(goods.goods_id,  goods.item_id,goods.goods_num) //再来一次
    else if (flag == 6) this.pingjia(goods.rec_id, goods.spec_img) //评价
  },
  cancelOrder: function (orderid) {
    console.log('取消')
    let that = this
    order.cancelOrder(that,orderid, res => {
      util.showmodel(res.message)
      if (res.status == 200) {
        that.onLoad(that.data.options)
      }
    })
  },
  payOrder: function (order_sn) {
    order.pay(this,order_sn, a => {
      // if (a == 1) {
        wx.redirectTo({
          url: '../../other/buy_result/buy_result?order_sn=' + order_sn,
        })
      // }
    })
  },
  wuliu: function (rec_id) {
    console.log('物流')
    console.log('../../other/webview/webview?url=' + baseurl.wuliuh5 + "&title=物流" + "&rec_id=" + rec_id)
    wx.navigateTo({
      url: '../../other/webview/webview?url=' + baseurl.wuliuh5 + "&title=物流" + "&rec_id=" + rec_id,
    })
  },
  shouhuo: function (rec_id) {
    let that = this
    util.showCancelModel("要确认收货吗?", res => {
      order.orderList(that,"1", rec_id, res => {
        if (res.status == 200) {
           that.onLoad(that.data.options)
        }
      })
    })

  },
  goodsDetail:function(e){
    console.log(e.currentTarget.dataset.id)
    let goods_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + goods_id,
    })
  },
  payAgain: function (goods_id, item_id,goods_num) {
    // wx.navigateTo({
    //   url: '../../other/goods_detail/goods_detail?goods_id=' + goods_id,
    // })
    wx.navigateTo({
      url: '../../other/buy_goods/buy_goods?goods_id=' + goods_id + "&goods_num=" + goods_num + "&item_id=" + item_id,
    })
  },
  pingjia: function (rec_id, image) {
    console.log(image)
    wx.navigateTo({
      url: '../../other/goods_eval/goods_eval?rec_id=' + rec_id + "&image=" + image,
    })
  },
  copyText:function(){
   
      wx.setClipboardData({
        data: this.data.list_data.order_sn,
        success: function (res) {
          wx.showToast({
            title: '复制成功',
          })
        }
      })
    
  },
  shouhou:function(e){
    let that = this
    if (that.data.state == 2) {
      that.tuikuan()
    } else
    if (that.data.list_data.goodsInfo[0].return_status == 0)
    wx.navigateTo({
      url: '../order_tuikuan/order_tuikuan?rec_id=' + this.data.list_data.goodsInfo[0].rec_id,
    })
    else{
            wx.navigateTo({
              url: '../order_tuikuan_info/order_tuikuan_info?rec_id=' + this.data.list_data.goodsInfo[0].rec_id,
      })
    }
  },
  tuikuan:function(e){
    let rec_id = this.data.list_data.goodsInfo[0].rec_id
    request.postRequest(this,baseurl.order_goods_cancel, { rec_id: rec_id},res=>{
        util.showmodel(res.message,res=>{
          // wx.navigateBack({
          //   delta:1
          // })
          wx.redirectTo({
            url: '../order_detail/order_detail?rec_id=' + rec_id,
          })
        })
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
      if (this.data.isTime = true){
        this.data.isTime = false
        this.countDown()
      }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      console.log("这里走了吗")
      this.data.isTime = true
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      console.log("这里走了吗")
      this.data.isTime = true
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})