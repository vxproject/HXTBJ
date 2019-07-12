// pages/desc_detail/desc_detail.js
const baseurl = require('../../../utils/baseurl.js')
const request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,  //默认true  (记得修改)  
    img_path: baseurl.imgPath

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.goods_id){
      this.data.goods_id = options.goods_id
      this.getRequest(options.goods_id)
    }else{
    
      this.setData({
        vipGoods: JSON.parse(options.vipGoods),
        index: options.index,
        flag: false
      })
      this.data.goods_id = this.data.vipGoods[this.data.index].goods_id
      wx.setNavigationBarTitle({
        title: this.data.vipGoods[this.data.index].goods_name,
      })
    }
    

  },
  getRequest(id){
    let that = this
    request.getRequest(that,baseurl.member_goods, res => {
      if (res.status == 200) {
        let index = 0
        console.log(res.data)
        for (let i = 0; i < res.data.length;i++){
   
          var goods_id = res.data[i].goods_id
          console.log(goods_id)
          if (goods_id == id) {
            index = i
            console.log(res.data[i].goods_name)
            wx.setNavigationBarTitle({
              title: res.data[i].goods_name,
            })
            break;
          }
        }
        that.setData({
          vipGoods: res.data,
          index:index,
          flag: false
        })
      }
    })
  },
  // 非会员商品详情
  detailClick: function (e) {
    wx.redirectTo({
      url: '../../other/desc_detail/desc_detail?vipGoods=' + JSON.stringify(this.data.vipGoods) + "&index=" + e.currentTarget.dataset.index,
    })
  },
  buyGoods: function (e) {
    console.log()
    let goods_id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '../../member/buy_member/buy_member?goods_id=' + goods_id,
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
    return request.share('',this.data.goods_id)
  }
})