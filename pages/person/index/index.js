// pages/person/index/index.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const datasource = require('../../../utils/datasource.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_data: datasource.person_data,
    vipicon: ['../../../images/image/viph.png', "../../../images/image/vipl.png"],
    hidden: 0,
    userinfo: {},
    isShuaxin: false

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  userinfo: function (e) {
    wx.navigateTo({
      url: '../../other/user_info/user_info',
    })
  },
  ddBtnClick: function (e) {
    let path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.postRequest()
    var userinfo = that.data.userinfo
    if (wx.getStorageSync('token') ) {
      request.getUserinfo(that, res => {
        if (res.is_vip != userinfo.is_vip) {
          userinfo = res
          that.setData({
            userinfo: userinfo
          })
        }
      })
    }

  },
  goNav:function(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
  /**
* 重新加载
*/
  no_datatap() {
    let that = this
    that.postRequest()
    var userinfo = that.data.userinfo
    if (wx.getStorageSync('token') ) {
      request.getUserinfo(that, res => {
        if (res.is_vip != userinfo.is_vip) {
          userinfo = res
          that.setData({
            userinfo: userinfo
          })
        }
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  xiaoxi: function (e) {
    wx.navigateTo({
      url: '../../home/index_info/index_info',
    })
  },
  shezhi: function (e) {
    wx.navigateTo({
      url: '../shezhi/shezhi',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return request.share()
  },
  // 页面数据来源
  postRequest: function () {
    let that = this
    request.getRequest(that, baseurl.order_type_number, res => {
      that.setData({
        failflag: false,
      })
      if (res.status == 200) {
        console.log(res.data)
        // typeNumbers: res.data,
        let person_data = that.changeTypeNumber(res.data)
        that.setData({
          userinfo: app.userinfo,
          hidden: 1,
          person_data: person_data
        })
        this.data.isShuaxin = true

      }
    }, c => {

    }, this.data.isShuaxin)
  },
  changeTypeNumber: function (e) {
    let dingdan_list = this.data.person_data.dingdan_list
    let array = [e.waitPay, e.waitSend, e.waitReceive, e.waitCommont, e.cancel]
    dingdan_list.forEach((item, index) => {
      item.num = array[index]
    })
    this.data.person_data.dingdan_list = dingdan_list
    return this.data.person_data
  }
})