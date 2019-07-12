const baseurl = require('baseurl.js')
const util = require('util.js')
let app = getApp()
var timer = null
let getCodeRequest = function (that,type) {
  // let that = this
  let phone = that.data.phone
  let parmars = {
    mobile: phone,
    type: type,
  }
  wx.request({
    url: baseurl.mobile_code,
    data: parmars,  
    
    header: {
      token: wx.getStorageSync('token'),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: 'POST',
    success: function (res) {
      if (res.data.status == 200){
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
          let time = 59
          timer = setInterval(function () {
            console.log(timer)
            if (time <= 0) {
              that.setData({
                yanzhengma: "获取验证码",
              })
              clearInterval(timer)
              timer = null
              return
            }
            that.setData({
              yanzhengma: time--,
            })
          }, 1000)
        }
      }else{
        util.showmodel(res.data.message)
      }
     
    },
    fail: function (res) { },
    complete: function (res) { },
  })

}
let clear = function(e){
  if(timer){
    clearInterval(timer)
    timer = null
  }
  
}
module.exports={
  getCodeRequest, timer, clear
}