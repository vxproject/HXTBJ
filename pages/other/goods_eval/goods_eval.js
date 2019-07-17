// pages/goods_eval/goods_eval.js
const baseurl = require('../../../utils/baseurl.js')
const request = require('../../../utils/request.js')
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file_imgs: [],
    value: '',
    xing_count: 4,
    img_path: baseurl.imgPath,
    state: false,
    imgurl: [],
    img_thumb: [],
    hidden: 0,
    num: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    this.setData({
      rec_id: options.rec_id,
      img_path: this.data.img_path + "" + options.image,
      hidden: 1
    })
  },
  bindTextAreaBlur(e) {
    this.data.value = e.detail.value
    this.setData({
      num:this.data.value.length
    })
  },
  // 添加图片
  addImage: function() {
    let that = this
    if (this.data.file_imgs.length >= 9) {
      return
    }
    wx.chooseImage({
      count: 9 - this.data.file_imgs.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let file_imgs = that.data.file_imgs.concat(res.tempFilePaths)
        that.setData({
          file_imgs: file_imgs
        })
      }
    })
  },
  // 改变评价分
  changeXing: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      xing_count: index
    })
  },
  // 发布按钮
  fabu: function() {
    let that = this
    if (that.data.value == '') {
      util.showmodel('请输入商品评价')
      return
    }
    wx.showToast({
      title: '加载中....',
      icon: 'loading',
      duration: 100000
    })

    this.uploadImage(0, res => {
      let d = that.data
      let params = {
        rec_id: d.rec_id,
        goods_rank: d.xing_count,
        content: d.value,
        img: d.imgurl.join(","),
        img_thumb: d.img_thumb.join(",")
      }
      wx.hideToast()
      request.postRequest(that, baseurl.add_comment, params, res => {
        if (res.status == 200) {
          util.showmodel(res.message, res => {
            wx.navigateBack({
              delta: 2,
            })
          })
        }

      })
    })
  },
  uploadImage: function(index, cd) {
    let that = this
    if (index >= this.data.file_imgs.length) {
      typeof cd == "function" && cd('ok')
      return
    }
    wx.uploadFile({
      url: baseurl.upload_image + "?type=2",
      filePath: that.data.file_imgs[index],
      name: 'file' + index,
      header: {
        "Content-Type": "multipart/form-data",
        "token": wx.getStorageSync('token')
      },
      success: function(res) {
        res.data = JSON.parse(res.data)
        if (res.data.status == 200) {
          that.data.imgurl.push(res.data.data.url)
          that.data.img_thumb.push(res.data.data.thumb)
          index = index + 1
          that.uploadImage(index, cd)
        }

      },
      fail: function(error) {
        that.data.imgurl = []
        that.data.img_thumb = []
        util.showmodel('网络错误,请稍后再试')
      }
    })
    // }
  },
  // 改变匿名状态
  changeState: function(e) {
    this.setData({
      state: !this.data.state
    })
  },
  deleteImage: function(e) {
    let index = e.currentTarget.dataset.index
    this.data.file_imgs.splice(index, 1)
    this.setData({
      file_imgs: this.data.file_imgs
    })
  },
  // 图片放大图
  preview: function(e) {
    wx.previewImage({
      current: this.data.file_imgs[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.file_imgs // 需要预览的图片http链接列表
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})