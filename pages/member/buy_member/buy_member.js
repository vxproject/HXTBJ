// pages/buy_member/buy_member.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const getCode = require('../../../utils/getCode.js')
const util = require('../../../utils/util.js')
const order = require('../../../utils/order.js')
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      hidden:0,
      list_data:null,
      img_path: baseurl.imgPath,
      userinfo:null,
      name:'',
      phone:'',
      code:'',
      yanzhengma:'获取验证码',
      is_sx:false,
      is_pay:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this
      that.data.goods_id = options.goods_id
     
    },
    // 数据请求
    getRequest:function(id){
      let that = this
      request.getRequest(that,baseurl.member_package+"?goods_id="+id,res=>{
        that.setData({
          hidden:1,
          list_data:res.data,
          userinfo: app.userinfo
        })
      })
    },
    // 添加地址
   addaddress:function(){
     this.data.is_sx = false
     wx.navigateTo({
       url: '../../person/dizhi/dizhi?flag=1',
     })
   },
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
        name: e.detail.value
      })
    }
    let phone = this.data.phone
    let code = this.data.code
    let name = this.data.name
    if (phone.length == 11 && code.length == 6 && name != '') {
    
    } 
  },
  //获取验证码
  getCode: function (e) {

    let yanzhengma = this.data.yanzhengma
    if (yanzhengma != '获取验证码') return
    let phone = this.data.phone
    // let isphone = util.inputRole(phone, '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')
    if (phone.length != 11) {
      util.showmodel('请输入正确的手机号码')
      return
    }
    getCode.getCodeRequest(this,2)
  },
  pay:function(e){
    let d = this.data
    let phone = d.phone
    // let isphone = util.inputRole(phone, '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')
    if (phone.length != 11) {
      util.showmodel('请输入正确的手机号码')
      return
    }
    if(d.name == '' || d.code.length !=6){
      util.showmodel('请输入完整的信息')
      return
    }
    let l = d.list_data
    let address_id = l.address.address_id
    let params = {
      address_id: address_id,
      goods_id: l.goods_id,
      code: d.code,
      mobile: d.phone,
      realname: d.name,
      item_id: l.specGoodsPrice[0].item_id
    }
    this.addorder(params)
    
  },
  addorder: function (params){
    let that = this
    request.postRequest(that,baseurl.pay_package,params,res=>{
        if(res.status == 200){
          order.pay(that,res.data.order_sn,a=>{
            that.data.is_pay = true
                wx.redirectTo({
                  url: '../../other/buy_result/buy_result?order_sn=' + res.data.order_sn,
                })
          })
        }
    })
  },

  /**
 * 获取验证码
 */

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
      let that = this
      if(that.data.is_pay == true) return
      if (that.data.is_sx == false) {
        this.getRequest(this.data.goods_id)
        that.data.is_sx = true
      }
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