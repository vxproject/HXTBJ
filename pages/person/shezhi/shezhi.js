// pages/person/shezhi/shezhi.js
const app = getApp();
const request = require('../../../utils/request.js');
const datasource = require('../../../utils/datasource.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    person_data: datasource.person_data,
    //{ title: '隐私' },
    list: [
       { title: '版本', txt: 'v2.1.5' }, { title: '问题反馈' }, { title: '法律免责' }, { title: '账号管理' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 选择
   */
  catchtap(e) {
    let index = e.currentTarget.dataset.index;
    let person_data = this.data.person_data;
    switch (index) {
      case 1:
        wx.navigateTo({
          url: '/pages/person/suggest/suggest',
        })
        break;
      case 2:
        wx.navigateTo({
          url: person_data.setlist[1].path,
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/person/xiugai/xiugai',
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      head_pic: app.userinfo.head_pic,
      nickname: app.userinfo.nickname,
      hidden: true
    })
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
    return request.share()
  }
})