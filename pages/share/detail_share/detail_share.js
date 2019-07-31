// pages/share/detail_share/detail_share.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let list_data = {
      id:options.id,
      img: baseurl.imgPath + options.img,
      market_price: options.market_price,
      name:options.name,
      shop_price: options.shop_price,
      nickname: app.userinfo.nickname,
      touxiang: app.userinfo.head_pic
    }
    that.setData({
      list_data: list_data
    })
    setTimeout(()=>{
      that.setData({
        loading: false
      })
    },2000)
   
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