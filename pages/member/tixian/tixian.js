// pages/bank_tixian/bank_tixian.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
const getCode = require('../../../utils/getCode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 银行列表
    // card_list: ['中国工商银行', '中国农业银行', '中国招商银行', '中国建设银行']
    hidden:0,
    seleted:0,
    yanzhengma:'获取验证码',
    img_path: baseurl.imgPath,
    money:"",
    code:'',
    phone:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.bankStatus()
  },
  bankStatus:function(){
    let that = this
    request.getRequest(that,baseurl.bank_status,res=>{
      if(res.status == 200){
        let hidden = 1
        if (res.data.status == true){
          that.setData({
            list_data: res.data,
            hidden: 2
          })
        }else{
          request.getRequest(that,baseurl.bank,bank=>{
              if(bank.status == 200){
                let card_list = ["请选择银行"]
                let card_code = ["0"]
                bank.data.forEach(item=>{
                  card_list.push(item.bank_name)
                  card_code.push(item.bank_code)
                }) 
                that.setData({
                  hidden:1,
                  card_list: card_list,
                  card_code: card_code
                })
              }
          })
        } 
    
      }
    })
  },
  formSubmit:function(e){



    let params = e.detail.value
    let isnext = this.isNext(params)
    if(isnext == false ) return
    if (this.data.seleted == 0){
      util.showmodel('请选择开户银行')
      return
    }
    let that = this
    let bank_code = this.data.card_code[this.data.seleted]
    params.bank_code = bank_code
    request.postRequest(that,baseurl.add_bank,params,res=>{
      if(res.status == 200){
        util.showmodel(res.message,a=>{
           that.bankStatus()
           that.setData({
             yanzhengma:'获取验证码'
           })
          getCode.clear()
        })
      }
    })
    
  },
  isNext:function(e){
    if (e.bank == '' || e.mobile.length != 11 || e.code=='' || e.realname == ''){
      util.showmodel('请输入正确的个人资料') 
      return false
    }
     return true
  },
  bindPickerChange:function(e){
    this.setData({
      seleted: e.detail.value
    })
  },
  getPhone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getCode: function (e) {

    let yanzhengma = this.data.yanzhengma
    if (yanzhengma != '获取验证码') return
    let phone = this.data.phone
    //let isphone = util.inputRole(phone, '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')
    if (phone.length != 11) {
      util.showmodel('请输入正确的手机号码')
      return
    }
    getCode.getCodeRequest(this,4)
  },
  allTixian:function(e){
    let that = this,money = 0
    if (that.data.list_data.bankInfo.user_money >= 100){
      money = parseInt(that.data.list_data.bankInfo.user_money)
    }
    this.setData({
      money: money
    })
  },
  getyzm:function(e){
    let yanzhengma = this.data.yanzhengma
    if (yanzhengma != '获取验证码') return
    this.data.phone = this.data.list_data.bankInfo.teltphone
    // let isphone = util.inputRole(phone, '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')
    if (this.data.phone.length != 11) {
      util.showmodel('请输入正确的手机号码')
      return
    }
    getCode.getCodeRequest(this, 3)
  },
  changeMoney:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  tixian:function(){
    let that = this
    let money = this.data.money

    if (money == '' || money == 0){
      util.showmodel('请输入正确的提现金额')
      return
    }
    console.log(money*1)
    if (money * 1 > this.data.list_data.bankInfo.user_money){
      util.showmodel('余额不足，请重新输入！')
      return
    }
    if (money * 1 < 100) {
      util.showmodel('单笔提现金额不得小于100元')
      return
    }
    if(this.data.code == ''){
      util.showmodel('请输入正确的验证码')
      return
    }
    let params = {
      money: money,
      code:this.data.code,
      telephone:this.data.phone
    }
    request.postRequest(that,baseurl.cash,params,res=>{
        if(res.status == 200){
          util.showmodel(res.message,res=>{
            // that.bankStatus()
            wx.redirectTo({
              url: '../tixian_state/tixian_state?flag=1',
            })
          })
        }else{
          wx.redirectTo({
            url: '../tixian_state/tixian_state?flag=2',
          })
        }
    })
  },
  changeCode:function(e){
    this.setData({
      code: e.detail.value
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})