const utils = require('util.js')
const baseurl = require('baseurl.js')
/**
 * 
 * post请求
 */
function postRequest(that,url, parameters, success = function() {}, complete = function() {}, flag = false) {
  if (flag == false && that) {
    //showLoading()
    that.setData({
      loading: true
    })
  }
  if (parameters == '') {
    parameters = {}
  }
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "token": wx.getStorageSync('token'),
  }
  if(app.userinfo){
    headers.is_vip = app.userinfo.is_vip
  }
  wx.request({
    url: url,
    data: parameters,
    method: "POST", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: headers, // 设置请求的 header7002
    success: function(res) {
      console.log(res)
      var jsonString = res.data
      if (typeof(jsonString) == 'string') {
        jsonString = jsonString.substring(jsonString.indexOf("{"), jsonString.lastIndexOf("}") + 1)
        res.data = JSON.parse(jsonString)
      }
      if (res.data.status == 200) success(res.data)
      else if (res.data.status == 70002 || res.data.status == 301) {
        wx.hideTabBar({
          animation: false //拿openid换取unionid个人信息
        })
        // try {
        //   wx.removeStorageSync('token')
        // } catch (e) {}
        wx.removeStorage({
          key: 'token',
          success(a) {
            let string = res.data.status == 301 ? res.data.message : "账号异常，请重新登录"
            utils.showmodel(string, res => {
              wx.navigateTo({
                url: '../../login/login/login?isRequest=true',
                success: function (e) {

                }
              })
            })
          }
        })
      
      } else utils.showmodel(res.data.message)
    },
    fail: function(e) {
      utils.showmodel('网络错误，请稍后再试')
    },
    complete: function(e) {
     // hideToast()
      if (that) {
        setTimeout(()=>{
          that.setData({
            loading: false
          })
        },1000)
      
      }
      complete(e)
    }
  })
}
/**
 * 
 * post请求
 */
function getRequest(that,url,success = function() {}, complete = function() {}, flag = false, click = function() {}) {

  if (flag == false && that) {
    that.setData({
      loading:true
    })
   // showLoading()
  }
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "token": wx.getStorageSync('token'),
  }
  if (app.userinfo) {
    headers.is_vip = app.userinfo.is_vip
  }
  wx.request({
    url: url,
    method: "GET", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: headers, // 设置请求的 header
    success: function(res) {
      console.log(res)
      var jsonString = res.data
      if (typeof(jsonString) == 'string') {
        jsonString = jsonString.substring(jsonString.indexOf("{"), jsonString.lastIndexOf("}") + 1)
        res.data = JSON.parse(jsonString)
      }
      if (res.data.status == 200) success(res.data)
    
      
      else if (res.data.status == 70002 || res.data.status == 301) {
        wx.hideTabBar({
          animation: false //拿openid换取unionid个人信息
        })
        // try {
        //   wx.removeStorageSync('token')
        // } catch (e) {}
        wx.removeStorage({
          key: 'token',
          success(a) {
            let string = res.data.status == 301 ? res.data.message : "账号异常，请重新登录"
            utils.showmodel(string, res => {
              wx.navigateTo({
                url: '../../login/login/login?isRequest=true',
                success: function (e) {
                }
              })
            })
          }
        })
     
      } else utils.showmodel(res.data.message, res => {
        click()
      })
    },
    fail: function(e) {
      if(that) that.setData({
        failflag:true
      })
      // fail(e)
      utils.showmodel('网络错误，请稍后再试')
    },
    complete: function(e) {
      //hideToast()
      if(that){
        setTimeout(() => {
          that.setData({
            loading: false
          })
        }, 500)
      }
    
      complete(e)
    }
  })
}
/**
 加载提示
 */
function showLoading() {
  wx.showToast({
    title: '加载中....',
    icon: 'loading',
    duration: 100000
  })
}
/*
关闭加载
*/
function hideToast() {
  wx.hideToast()
}

function tixing(data) {
  if (data.length == 0) {
    setTimeout(a => {
      wx.showToast({
        icon: 'none',
        title: '没有更多了',
      })
    }, 100)

  }
}
var app = getApp()

function share(title = '', id = '-1',type = 0,) {
  var user_id = app.userinfo.user_id ? app.userinfo.user_id : '-1'
  return {
    title: title == '' ? '好享淘优选' : title,
    path: 'pages/home/index/index?id=' + user_id + "&goodsid=" + id + "&type="+type
  }
}

function getUserinfo(that,cd) {
  getRequest(that,baseurl.user_info, res => {
    if (res.status == 200) {
      app.userinfo = res.data
      typeof cd == "function" && cd(res.data)
    }
  }, c => {

  }, true)
}

module.exports = {
  postRequest,
  getRequest,
  tixing,
  share,
  getUserinfo
}