// pages/person/suggest/suggest.js
const request = require('../../../utils/request.js');
const baseurl = require('../../../utils/baseurl.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindinput(e) {
    let that = this;
    that.data.value = e.detail.value;
  },
  subbtn() {
    let that = this;
    let value = that.data.value;
    if (!value) {
      wx.showToast({
        icon: 'none',
        title: '请完善您宝贵的反馈',
      })
      return;
    }
    request.postRequest(that,baseurl.feedback, { content: value }, res => {
      if (res.status == 200) {
        wx.showModal({
          title: '温馨提示',
          content: '宝贵的反馈信息已被收录，感谢您此次做出的评价！祝您生活愉快！',
          confirmText: "确定",
          confirmColor: "#FF5000",
          showCancel: false,
          success: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
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