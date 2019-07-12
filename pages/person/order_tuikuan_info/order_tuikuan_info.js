// pages/order_tuikuan_info/order_tuikuan_info.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
      list_data:null,
      hidden:1,
      img_path: baseurl.imgPath
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu()
      // console.log(options)
      //   let data = JSON.parse(options.shuju)
      //   this.setData({
      //     list_data:data
      //   })
      let that = this
      request.getRequest(that,baseurl.order_detail + "?rec_id=" + options.rec_id,res=>{
        if(res.status == 200){
          that.setData({
            list_data:res.data,
            hidden:2
          })
        }
      })
    },
  imageInfo:function(e){
    let that = this
    let image = that.data.img_path + "" + e.currentTarget.dataset.image
    let images = e.currentTarget.dataset.imgs
    images = images.split(',')
    images.forEach((item, index) => {
      images[index] = that.data.img_path + "" + item
    })
    wx.previewImage({
      current: image,
      urls: images,
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