const app = getApp();
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.item)
  },
  getData(id) {
    let that = this;
    let url = baseurl.order_detail + "?rec_id=" + id
    request.getRequest(that, url, res => {
      if (res.status == 200) {
        that.setData({
          hidden: 1,
          list_data: res.data,
        })
      }
    })
  },
  /**
   * 复制
   * 收货成功页复制功能2.1.4版没写，下一版恢复
   */
  copyText(){
    wx.setClipboardData({
      data: this.data.list_data.order_sn,
      success: res=> {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
/**
 * 返回首页
 */
  goback(){
    wx.switchTab({
      url: '/pages/home/index/index',
    })
  },
  pinglun(e) {
    let item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../other/goods_eval/goods_eval?rec_id=' + item.rec_id + "&image=" + item.spec_img,
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