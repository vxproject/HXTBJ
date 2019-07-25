// pages/share/index/index.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_data: {},
    img_path: baseurl.imgPath,
    hidden: 0,
    flag: 0,
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    wx.setNavigationBarTitle({
      title: options.title,
    })
    that.data.id = options.id
    request.getRequest(this, baseurl.six_share + "?id=" + options.id, res => {
      that.setData({
        list_data: res.data,
        hidden: 1
      })
    })
  },

  saveImage: function () {
    let that = this
    if (wx.downloadFile) {
      var ctx = wx.createCanvasContext('firstCanvas')
      wx.downloadFile({
        url: this.data.img_path + "" + this.data.list_data.bg_img,
        success(res) {
          console.log(res.tempFilePath)
          ctx.drawImage(res.tempFilePath, 0, 0, 750, 1184)

          if (res.statusCode === 200) {
            wx.downloadFile({
              url: that.data.img_path + "" + that.data.list_data.wx_img,
              success(a) {
                console.log(a.tempFilePath)
                if (a.statusCode == 200) {
                  ctx.drawImage(a.tempFilePath, 570, 1016, 150, 150)
                  ctx.draw(true, function (res) {
                    console.log('图生成中')
                    wx.showToast({
                      title: '图片生成中....',
                      icon: 'loading',
                      duration: 100000
                    })
                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      width: 750,
                      height: 1184,
                      destWidth: 750,
                      destHeight: 1184,
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
                                // util.showmodel('保存图片成功')
                                that.lingqu()
                              }
                            })
                          },
                          fail: function (e) {
                            console.log(e)
                            wx.hideToast()
                            util.showmodel('请设置可以存储图片')
                          }
                        })
                        console.log(res.tempFilePath)
                      }
                    })
                  })
                }
              }
            })

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

  lingqu: function (e) {

    request.postRequest(this, baseurl.add_free_coupon, { id: this.data.id }, res => {
      if (res.data.img) {


        let lingqu = {
          img: this.data.img_path + res.data.img,
          type: 1
        }
        // if (res.data){
        //   //弹钱框
        //    lingqu = {
        //     type:2,
        //     money:res.data.money,
        //   }
        // }else{
        //   //弹没钱框
        //    lingqu = {
        //     type: 1,
        //   }
        // }
        this.setData({
          lingqu: lingqu,
          flag: 1
        })
      }
    }, a => {
    })
  },
  closeTC: function (e) {
    this.setData({
      flag: 2
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
  share: function (res) {
    let that = this
    if (that.data.list_data.is_share_reward == 1) {
      setTimeout(res => {
        that.lingqu()
      }, 1000)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return request.share()
  }
})