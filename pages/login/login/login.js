// pages/login/login/login.js
const oauth = require('../../../utils/oauth.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:0
  },
  // 获取个人信息
  getuserinfo: function (e) {
    let that = this
    oauth.get_wxinfo(e, res => {
      that.setData({
        flag: 1
      })
    })
  },
  tijiao: function () {
    wx.navigateBack({
      delta:5
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.sx = true
    wx.switchTab({
      url: '../../home/index/index',
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