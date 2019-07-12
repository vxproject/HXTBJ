// pages/person_shop/person_shop.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_data: null,
    img_path: baseurl.imgPath,
    userinfo: null,
    hidden: true,
    storeName: '',
    store: '',
    flag:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    let that = this
    if(options.flag){
      that.setData({
        flag:options.flag
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          h_width: res.screenWidth,
          h_height: res.screenHeight
        })

      },
    })
    // request.getRequest(baseurl.store_share, res => {
    //   if (res.status == 200) this.setData({
    //     list_data: res.data
    //   })
    // })
    request.getRequest(that,baseurl.user_store, res => {
      if (res.status == 200) {
        this.setData({
          store: res.data,
          userinfo: app.userinfo
        })
      }
    })
  },
  saveStore: function() {
    this.setData({
      hidden: false
    })
  },
  storeName: function(e) {
    this.setData({
      storeName: e.detail.value
    })
  },
  hideTip: function() {
    let that = this
    let name = that.data.storeName
    if (name == '') {
      util.showmodal('店铺名称不可为空')
      return
    }
    that.setData({
      hidden: true
    })

    request.postRequest(that,baseurl.save_store, {
      store_name: name
    }, res => {
      if (res.status == 200) {
        let store = that.data.store
        store.store_name = name
        that.setData({
          store: store
        })
      }
    })

  },
  hideModal: function() {
    this.setData({
      hidden: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  saveImage: function() {
    if (wx.downloadFile) {
        wx.downloadFile({
          url: this.data.img_path + "" + this.data.store.wx_small_img, // 仅为示例，并非真实的资源
          success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {

              let that = this
              const ctx = wx.createCanvasContext('firstCanvas')

              // ctx.drawImage('https://wx-shopping-0f31c9.tcb.qcloud.la/my_shop_logo.png?sign=97cbaa75627eee1ca74795f648939f52&t=1548741976', 0, 0, this.data.h_width, this.data.h_height)
              ctx.drawImage('../../../images/image/my_shop_logo.png', 0, 0, 640, 960)
              // ctx.drawImage(this.data.img_path + "" + this.data.store.wx_small_img, this.data.h_width / 2 - 40, this.data.h_height - 150, 80, 80)
              ctx.arc(320, 840, 80, 0, Math.PI * 2, false);
              ctx.clip();
              ctx.drawImage(res.tempFilePath, 640 / 2 - 80, 960 - 200, 160, 160)
              // ctx.setFontSize(20)
              // ctx.fillText('长按识别二维码', 20, 20)
              ctx.draw(true, function (res) {
                wx.showToast({
                  title: '图片生成中....',
                  icon: 'loading',
                  duration: 100000
                })
           
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: 640,
                  height: 960,
                  destWidth: 640,
                  destHeight: 960,
                  fileType: "jpg",
                  canvasId: 'firstCanvas',
                  success(res) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success: function () {
                        wx.saveImageToPhotosAlbum({
                          filePath: res.tempFilePath,
                          success(res) {
                            wx.hideToast()
                            util.showmodel('保存图片成功')
                          }
                        })
                      },
                      fail: function () {
                        wx.hideToast()
                        util.showmodel('请设置可以存储图片')
                      }
                    })
                    console.log(res.tempFilePath)
                  }
                })
              })


////


            }
          }
        })
      
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    

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