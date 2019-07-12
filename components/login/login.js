// components/login/login.js
const util = require('../../utils/util.js')
const baseurl = require('../../utils/baseurl.js')
const request = require('../../utils/request.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: 1,
      value: '名字',
      observer: function(e) {
        console.log('-----')
      }
    },
    flag: {
      type: Number,
      value: 0
    },
    ycode:{
      type:String,
      value:'-1'
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    icon: "../../images/image/icon.png",
    wechat: '../../images/image/login-wechat.png',
    icon1: '../../images/image/icon1.png',
    login_zh:"../../images/image/login-zh.png",
    yuandian:"../../images/image/yuandian.png",
    phone: '', //手机号
    code: '', //验证码
    istj: 0, //按钮状态
    yanzhengma: '获取验证码',
    yqcode: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindKeyInput(e) {
      console.log()
      let flag = e.currentTarget.dataset.flag
      if (flag == 'phone') {
        this.setData({
          phone: e.detail.value
        })
      } else if (flag == 'code') {
        this.setData({
          code: e.detail.value
        })
      } else {
        this.setData({
          yqcode: e.detail.value
        })
      }
      let phone = this.data.phone
      let code = this.data.code
      let istj = this.data.istj
      let yqcode = this.data.ycode != '-1' ? this.data.ycode:this.data.yqcode
      if (phone.length == 11 && code.length == 6 && yqcode != '') {
        // let isphone = util.inputRole(phone, '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')
        // if (isphone == true) this.setData({
        //   istj: 1
        // })
        // if (istj == 1) this.setData({
        //   istj: 0
        // })
        // else
        this.setData({
          istj: 1
        })
      } else if (istj == 1) this.setData({
        istj: 0
      })
    },
    // 获取用户身份
    bindGetUserInfo: function(e) {
      if (e.detail.rawData) {
        this.triggerEvent('getuserinfo', e.detail, {})
      }
    },
    //获取验证码
    bindgetcode: function(e) {
   
      let yanzhengma = this.data.yanzhengma
      if (yanzhengma != '获取验证码') return
      let phone = this.data.phone
      let isphone = util.inputRole(phone, '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')
      if (phone.length != 11) {
        util.showmodel('请输入正确的手机号码')
        return
      }
      this.getCodeRequest()
    },
    //tijiao 
    bindtijiao: function(e) {
      let that = this
 
      let istj = this.data.istj
      if (istj == 0) return
      let d = this.data
      let params = {
        mobile: d.phone,
        code: d.code,
        invite_code: d.ycode!='-1'?d.ycode:d.yqcode
      }
      wx.request({
        url: baseurl.bind_mobile,
        data: params,
        header: {
          token: app.token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          if (res.data.status != 200) {
            util.showmodel(res.data.message)
            return
          } else {
            util.save_token(app.token)
            app.userinfo = res.data.userInfo
            util.showmodel(res.data.message,res=>{
              that.triggerEvent('tijiao', {}, {})
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    },

    /**
     * 获取验证码
     */
    getCodeRequest: function() {
      let that = this
      let phone = that.data.phone
      let parmars = {
        mobile: phone,
        type: 1,
      }
      console.log(app.token)
      wx.request({
        url: baseurl.mobile_code,
        data: parmars,
        header: {
          token: app.token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          if (res.data.status == 200){
            wx.showToast({
              title: '已发送',
              icon: 'success',
              duration: 2000
            })
            //验证码获取成功
            that.setData({
              yanzhengma: '(60)',
            })
            if (that.data.yanzhengma == '(60)') {
              let time = 59
              let timer1 = setInterval(function () {
                if (time <= 0) {
                  that.setData({
                    yanzhengma: "重新发送",
                  })
                  clearInterval(timer1)
                  return
                }
                that.setData({
                  yanzhengma: `(${time--})`,
                })
              }, 1000)
            }
          }else{
            util.showmodel(res.data.message)
          }
        
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    },
    tiaokuan:function(e){
      wx.navigateTo({
        url: '../../other/webview/webview?url=' + baseurl.yinsih5 + "&title=" + '服务条款',
      })
    }
  }

  
})