// pages/home/member_list/member_list.js

const baseurl = require('../../../utils/baseurl.js')
const request = require('../../../utils/request.js')

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invite_code: '暂无',
    img_path: baseurl.imgPath,
    is_vip:0,
    hidden:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getList();
    this.setData({
      invite_code: app.userinfo.invite_code,
      is_vip: app.userinfo ? app.userinfo.is_vip:0
    })
    if (app.userinfo.is_vip == 1){
      wx.setNavigationBarTitle({
        title: '邀请好友入驻好享淘',
      })
    }
  },
  getList() {
    request.getRequest(this,baseurl.member_goods, res => {
      if (res.status == 200) {
        this.setData({
          list: res.data,
          hidden:1
        })
      }
    })
  },
  /**
   * 
   * 跳转详情
   */
  // 非会员商品详情
  detailClick: function (e) {
    if (this.data.is_vip == 0) 
    wx.navigateTo({
      url: '../../other/desc_detail/desc_detail?vipGoods=' + JSON.stringify(this.data.list) + "&index=" + e.currentTarget.dataset.index,
    })
  },
  /**
   * 复制
   */
  copy(e) {
    let data = e.currentTarget.dataset.cont;
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })

  },
  payClick:function(e){
    let that = this
    if(that.data.is_vip == 0){
      let goods_id = e.currentTarget.dataset.goodsid
      wx.navigateTo({
        url: '../../member/buy_member/buy_member?goods_id=' + goods_id,
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
  onShareAppMessage: function (e) {
    if(e.from == 'button'){
      let title = e.target.dataset.item.goods_name,
        good_id = e.target.dataset.item.goods_id,
        image =  e.target.dataset.item.original_img;
      let user_id = app.userinfo.user_id ? app.userinfo.user_id : '-1';
      return {
        title: title == '' ? '好享淘优选' : title,
        path: 'pages/home/index/index?id=' + user_id + "&goodsid=" + good_id + "&type=0" ,
        imageUrl: this.data.img_path + image,
      }
    }else{
      return request.share()
    }

  }
})