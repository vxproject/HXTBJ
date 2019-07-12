// pages/order_tuikuan/order_tuikuan.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pid:1,
        // 退款原因列表
        tuikuan_list:[
            "请选择",'口感不佳', '错拍/多拍/不想要', '包裹丢失', '商品变质', '克重不足', '成熟度过低', 
            '收货信息填写错误','商品错发/漏发', '收到商品与描述不符', '商品破损'
        ],
        sunhuai_list:[
            '请选择','少许', '三分之一', '一半', '三分之二', '全部'
        ],
        list_data:null,
      img_path: baseurl.imgPath,
        index:0,
        index1:0,
        imgs:[],
        file_imgs:[],
        imgurl:[],
        img_thumb:[],
        is_add:false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu()
      this.dataRequest(options.rec_id)
    },
    dataRequest:function(rec_id){
      let that = this
      request.getRequest(that,baseurl.order_return_pay + "?rec_id=" + rec_id,res=>{
         if(res.status == 200){
           that.setData({
             list_data:res.data
           })
         }
      })
    },
    tuikuan:function(e){
        this.setData({
          pid:0
        })
    },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange2:function(e){
    this.setData({
      index1:e.detail.value
    })
  },
  tijiao:function(e){
    let that = this
    if(this.data.file_imgs.length == 0){
      util.showmodel('请上传商品图片')
      return
    }
    if (this.data.index == 0 || this.data.index1 == 0){
      util.showmodel('请选择退款原因或损坏数量')
      return
    }
    this.uploadImage(0, res => {
      let d = that.data
      let params = {
        rec_id: d.list_data.rec_id,
        reason: d.tuikuan_list[d.index],
        describe: d.sunhuai_list[d.index1],
        img: d.imgurl.join(","),
        img_thumb: d.img_thumb.join(",")
      }
      console.log(params)
      request.postRequest(that,baseurl.order_return_submit, params, res => {
        if (res.status == 200) {
          util.showmodel(res.message, res => {
            wx.navigateBack({
              delta: 3,
            })
          })
        }
      })
    })
  },
  addImage:function(e){
    let that = this

    wx.chooseImage({
      count: 6 - this.data.file_imgs.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let file_imgs = that.data.file_imgs.concat(res.tempFilePaths)
        that.setData({
          file_imgs: file_imgs,
          is_add: file_imgs.length == 6?true:false
        })
      }
    })
  },
  deleteImage: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.file_imgs.splice(index, 1)
    this.setData({
      file_imgs: this.data.file_imgs,
      is_add: this.data.file_imgs.length == 6 ? true : false
    })
  },
  uploadImage: function (index, cd) {
    let that = this
    wx.showToast({
      title: '加载中....',
      icon: 'loading',
      duration: 100000
    })
    if (index >= this.data.file_imgs.length) {
      typeof cd == "function" && cd('ok')
      wx.hideToast()
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
      success: function (res) {

        res.data = JSON.parse(res.data)
        console.log(res.data)
        if (res.data.status == 200) {
          that.data.imgurl.push(res.data.data.url)
          that.data.img_thumb.push(res.data.data.thumb)
          console.log(that.data.imgurl)
          index = index + 1
          that.uploadImage(index, cd)
        }

      },
      fail: function (error) {
        that.data.imgurl = []
        that.data.img_thumb = []
        util.showModel('网络错误,请稍后再试')
      }
    })
    // }
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