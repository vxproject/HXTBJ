// pages/other/ling_quan/ling_quan.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:1,
    is_ok:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.cid){
      this.getRequest(options.cid)
    }
  },
  getRequest:function(id){
    let that = this
    request.postRequest(that,baseurl.add_coupon,{id:id},res=>{
      that.setData({
        is_ok:1
      })
      wx.setNavigationBarTitle({
        title: '领取成功',
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; 
      let a = prevPage.data.url
      prevPage.setData({
        url:'https://www.hxtapp.com/v1/template'
      })
     
      prevPage.setData({
        url:a+""
      })
    },c=>{
      that.setData({
        hidden: 2
      })
    })

  },
  goBack:function(){
    wx.navigateBack({
      delta:1
    })
  },
  ckClick:function(e){
    wx.navigateTo({
      url: '../../person/quan/quan',
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