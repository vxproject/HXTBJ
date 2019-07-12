// pages/buy_success/buy_success.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const order = require('../../../utils/order.js')
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      hidden:1,
      list_data:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu()
      let that = this
      request.getRequest(that,baseurl.pay_order_status + "?order_sn=" + options.order_sn,res=>{
         if(res.status == 200){
           that.setData({
             hidden:2,
             list_data:res.data
           })
           request.getRequest(that,baseurl.user_info, success => {
             if (success.status == 200) {
               app.userinfo = success.data
             }
           })
         }
      })
    },
  orderDetail:function(e){
    wx.redirectTo({
        url: '../../person/order_detail/order_detail?order_id='+this.data.list_data.order_id,
      })
  },
  goBack:function(e){
      wx.navigateBack({
        delta: 4
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