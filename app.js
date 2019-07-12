//app.js
App({
  onLaunch: function (e) {
    wx.hideShareMenu();
    wx.hideTabBar({
      animation: false //拿openid换取unionid个人信息
    })
    let updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，重启应用？',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  onShow: function (e) {

  },
  // globalData: {
  //   userInfo: null
  // }
  openid: '',
  token: '',
  userinfo: {},
  ceshi: 0
})