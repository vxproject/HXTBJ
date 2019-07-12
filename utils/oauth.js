

function islogin(){
  const token = wx.getStorageSync('token')
  if (token) return true
  else return false
}
const baseurl = require('baseurl.js')
const request = require('request.js')
const utils = require('util.js')
let app = getApp()
function getOpenid(that,cd){
  wx.login({
    success(res) {
      if (res.code) {
        // 发起网络请求
        wx_login(res.code,cd,that)
      } else {
        utils.showmodel('系统错误，请稍后再试')
      }
    }
  })
}
// 获取微信个人信息
function get_wxinfo(that,e,cd){
  e = e.detail
  let params = {
    openid:app.openid,
    rawData: e.rawData,
    signature: e.signature,
    encryptedData: e.encryptedData,
    iv: e.iv
  }

    request.postRequest(that,baseurl.wx_info, params, res => {
      if (res.status == 200) {
        let flag = -1
        //已经解析过unionid
        if (res.data.regiser_mobile == 0) {
          flag = 0
          app.token = res.data.token
        }
        else if (res.data.regiser_mobile == 1) {
          app.token = res.data.token
          utils.save_token(res.data.token)
          flag = 1
          app.userinfo = res.data.userInfo
        }   //已经绑定过手机号
        else save_openid(res.data.openid) //没有解析过unionid
        typeof cd == "function" && cd({ flag: flag, data: res.data });
      } else {
        utils.showmodel('网络错误，请稍后再试')
      }
    })
  
  
  
}


module.exports={
  islogin, getOpenid, get_wxinfo
}
//获取微信openid
function wx_login(code,cd,that){
   request.getRequest(that,baseurl.login+"?code="+code,res=>{
     
       if(res.status == 200){
         let flag = -1
         //已经解析过unionid
         if (res.data.regiser_mobile == 0 && res.data.token){
           flag = 0
           app.token = res.data.token
         } 
         else if (res.data.regiser_mobile == 1 && res.data.token){
           app.token = res.data.token
           utils.save_token(res.data.token)
           flag = 1
           app.userinfo = res.data.userInfo
         }   //已经绑定过手机号
         else save_openid(res.data.openid) //没有解析过unionid
         typeof cd == "function" && cd({flag:flag,data:res.data});
       }else{
         utils.showmodel('网络错误，请稍后再试')
       }
   })
}
// 获取用户个人信息

function save_openid(openid){
  app.openid = openid
}