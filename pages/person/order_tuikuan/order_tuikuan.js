// pages/order_tuikuan/order_tuikuan.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
const order = require('../../../utils/order.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 1,

    cancleorder: false,  //取消订单状态
    arr_cancel: [
      { txt: '我不想买了', flag: false },
      { txt: '信息填写错误', flag: false },
      { txt: '商品拍重了', flag: false },
      { txt: '其他原因', flag: false },
    ],
    tuikuanCell: {
      cancleorder_flag: false,  //取消订单状态
      arr_cancel: [],
      // 退款原因列表
      tuikuan_list: [
        '我不想买了', '信息填写错误', '商品拍重了', '其他原因',
      ],
      sunhuai_list: [
        '三分之一', '一半', '三分之二', '全部'
      ],
      obj1: {
        title: '退款原因',
        txt: '请选择退款原因'
      },
      obj2: {
        title: '商品损坏数量',
        txt: '请选择商品损坏数量'
      },
      // 选中记录
      seleted1: -1,
      seleted2: -1,
      seleted: -1,
      //预计退款金额
      price: null
    },
    list_data: null,
    img_path: baseurl.imgPath,
    index: 0,
    index1: 0,
    imgs: [],
    file_imgs: [],
    imgurl: [],
    img_thumb: [],
    is_add: false,
    len: 0,
    goodsInfo: {},
    flag: false,
    value: '选填...',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.dataRequest(options.rec_id)
    this.setData({
      goodsInfo: JSON.parse(options.goodsInfo),
      state: JSON.parse(options.state),
    })
  },
  shouhou() {
    wx.navigateTo({
      url: '../../other/webview/webview?url=' + baseurl.shouhouh5 + "&title=售后说明"
    })
  },
  /**
   * 仅退款
   */
  jintuikuan(e) {
    this.setData({
      cancleorder: !this.data.cancleorder,
      // orderid: orderid,//订单id
    })
  },
  changesetuikuan() {
    this.setData({
      cancleorder: !this.data.cancleorder
    })
  },
  /**
  * 选择一个原因
  */
  chooseOne_ls(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let arr_cancel = that.data.arr_cancel;
    let flag = arr_cancel[index].flag;
    arr_cancel.forEach(item => {
      item.flag = false
    })
    arr_cancel[index].flag = !flag;
    that.setData({
      arr_cancel: arr_cancel,
    })
  },
  make_tuikuan(e) {
    let index = e.currentTarget.dataset.index;
    let recid = e.currentTarget.dataset.recid;
    if (index == 1) {
      this.setData({
        cancleorder: false
      })
    } else {
      let data = {
        rec_id: recid,
        type: 0,
      }
      if (!order.chools_one(this.data.arr_cancel, this)) {
        util.showmodel('请选择退款原因')
        return;
      }
      if (order.chools_one(this.data.arr_cancel, this)) {
        data.reason = this.data.arr_cancel[this.data.index_ls].txt;
      }
      request.postRequest(this, baseurl.order_return_submit, data, res => {
        if (res.status == 200) {
          this.setData({
            cancleorder: false
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })

    }
  },
  bindblur() {
    this.setData({
      flag: false
    })
  },
  bindfocus() {
    this.setData({
      flag: true
    })
  },
  catchtap() {
    this.setData({
      flag: true
    })
  },
  dataRequest: function (rec_id) {
    let that = this
    request.getRequest(that, baseurl.order_return_pay + "?rec_id=" + rec_id, res => {
      if (res.status == 200) {
        that.setData({
          list_data: res.data
        })
      }
    })
  },
  tuikuan: function (e) {
    this.setData({
      pid: 0
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      index1: e.detail.value
    })
  },
  tijiao: function (e) {
    let that = this
    if (this.data.tuikuanCell.seleted1 == -1) {
      util.showmodel('请选择退款原因')
      return
    }
    if (this.data.tuikuanCell.seleted2 == -1) {
      util.showmodel('请选择商品损坏数量')
      return
    }
    if (this.data.file_imgs.length == 0) {
      util.showmodel('请上传商品图片')
      return
    }
    this.uploadImage(0, res => {
      let d = that.data
      let params = {
        rec_id: d.list_data.rec_id,
        reason: d.tuikuanCell.tuikuan_list[d.tuikuanCell.seleted1],
        describe: d.value,
        imgs: d.imgurl.join(","),
        img_thumb: d.img_thumb.join(","),
        type: 1
      }

      console.log(params)
      request.postRequest(that, baseurl.order_return_submit, params, res => {
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
  addImage: function (e) {
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
          is_add: file_imgs.length == 6 ? true : false
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
      url: baseurl.upload_image + "?type=1",
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
  input: function (e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    let that = this;
    this.setData({
      len: len,
      value: value
    });

  },
  btnClick: function (e) {
    console.log(e.currentTarget.dataset.flag)
    //原因
    if (flag == 1) {

    } else {
      //商品孙环数量
    }
  },

  changese_flag(e) {
    // let that = this

    // if (!this.data.cancleorder_flag == true){

    //   if(flag == 1){
    //     this.setData({
    //       arr_cancel: that.data.tuikuan_list,
    //       seleted:1
    //     })
    //   }else{
    //     this.setData({
    //       arr_cancel: that.data.sunhuai_list,
    //       seleted: 2
    //     })
    //   }
    // }
    let tuikuanCell = this.data.tuikuanCell
    var flag = e.currentTarget.dataset.flag
    tuikuanCell.cancleorder_flag = !tuikuanCell.cancleorder_flag
    tuikuanCell.flag = flag
    this.setData({
      tuikuanCell: tuikuanCell
    })
  },
  /**
    * 选择一个原因
    */
  chooseOne_yy(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    var seleted = that.data.seleted == 1 ? that.data.seleted1 : that.data.seleted2
    if (seleted == index) return
    if (that.data.seleted == 1) that.setData({
      seleted1: index
    })
    else that.setData({
      seleted2: index
    })
  },
  makesure: function (e) {
    let flag = e.detail.flag
    this.data.tuikuanCell.cancleorder_flag = !this.data.tuikuanCell.cancleorder_flag
    let seleted = e.detail.seleted
    console.log(seleted)
    if (seleted != -1) {
      if (flag == 1) this.data.tuikuanCell.seleted1 = seleted
      else {
        this.data.tuikuanCell.seleted2 = seleted
        let price_sale = [1.5, 2, 3, 5];

        let price = this.data.goodsInfo[0].order_amount / price_sale[seleted]
        price = price.toFixed(2)
        this.setData({
          price: price
        })
      }
      this.setData({
        tuikuanCell: this.data.tuikuanCell
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
  onShareAppMessage: function () {

  }
})