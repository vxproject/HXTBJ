// pages/person/manage/manage.js
const app = getApp();
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: app.userinfo
    })
    console.info(' 个人 信息---------', this.data.userinfo)
  },
  bindinput(e) {
    this.data.ercode = e.detail.value
  },
  /**
   * 获取验证码
   */
  getCode() {
    let that = this;
    let mobile = that.data.userinfo.mobile;
    let type = 8;
    if (!that.data.yanzhengma) {
      request.postRequest(that,baseurl.mobile_code, { mobile: mobile, type: type }, res => {
        if (res.status == 200) {
        wx.showToast({
          title: '已发送',
          icon: 'success',
          duration: 2000
        })
        //验证码获取成功
        that.setData({
          yanzhengma: 60,
        })
        if (that.data.yanzhengma == 60) {
          that.time = 59
          let timer1 = setInterval(function () {
            if (that.time <= 0) {
              clearInterval(timer1)
              that.setData({
                yanzhengma: '',
              })
              return
            }
            that.setData({
              yanzhengma: that.time--,
            })
          }, 1000)
        }
        }

      })
    }
  },
  /**
   * 验证
   */
  makeSuer() {
    let  that = this ;
    let ercode = this.data.ercode ? this.data.ercode :null;
    if (!ercode || ercode.length < 6) {
      wx.showToast({
        icon: "none",
        title: '请完善验证码',
      })
      return;
    }
    request.postRequest(that,baseurl.change_mobile, { code: ercode }, res => {
      if(res.status == 200){
      wx.navigateTo({
        url: '/pages/person/managenew/managenew',
      })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      hidden: true
    })
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
    if (this.time) {
      this.time = 0;
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.time) {
      this.time = 0;
    }
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
    return request.share()
  }
})