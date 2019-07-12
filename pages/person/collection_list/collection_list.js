// pages/person/collection_list/collection_list.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const cart = require('../../../utils/cart.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_data: {},
    img_path: baseurl.imgPath,
    is_vip: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      is_vip: app.userinfo.is_vip,
      goods_id: options.goods_id
    })
    this.getRequest(options.goods_id)
  },
  getRequest: function(id, page = 1) {
    let that = this
    request.getRequest(that,baseurl.share_goods_list + "?id=" + id + "&page=" + page, res => {

      if (page == 1)
        that.setData({
          list_data: res.data
        })
      else {
        let list_data = this.data.list_data.list_data
        res.data.collect_goods.data = list_data.collect_goods.data.concat(res.data.collect_goods.data)
        list_data.collect_goods = res.data.collect_goods
        that.setData({
          list_data: list_data
        })
      }
      wx.setNavigationBarTitle({
        title: res.data.store_info.store_name,
      })
    })
  },

  goodsDetail:function(e){
    let goodsid = e.currentTarget.dataset.id
    console.log(goodsid)
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + goodsid,
    })
  },
  addgwc:function(e){
    let goodsid = e.currentTarget.dataset.id
    cart.addgwc(this,goodsid, 1)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
    let that = this
    let collect_goods = this.data.list_data.collect_goods
    if (collect_goods.last_page <= collect_goods.current_page) {
      request.tixing([])
      return
    }
    this.getRequest(that.data.goods_id, collect_goods.current_page * 1 + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})