// pages/person/xiugai/xiugai.js
const app = getApp();
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  catchtap(e) {
    let index = e.currentTarget.dataset.index;
    if (index == '1') {
      wx.navigateTo({
        url: '/pages/person/manage/manage',
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请在APP上修改！',
      })
    }


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
    let that = this;
    request.getRequest(that,baseurl.user_info, success => {
      if (success.status == 200) {
        if(that.data.changeflag){
          wx.showToast({
            icon:'none',
            title: '绑定手机号已经修改',
            duration: 1500,
          })
        }
        app.userinfo = success.data
        that.setData({
          userinfo: success.data,
          hidden: true,
        })
      }
    })
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
    return request.share()
  }
})