// pages/buy_goods/buy_goods.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const cart = require('../../../utils/cart.js')
const order = require('../../../utils/order.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: 0,
    list_data: null,
    img_path: baseurl.imgPath,
    flag: 0,
    item_id: '',
    liuyan: '',
    isgwc: -1,
    isfirst: false,
    money: 0,
    coupon_id: 0,
    is_sx: true,
    is_pay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let that = this
    if (options.flag) {
      this.jiesuan()
      that.data.isgwc = options.flag
    } else {
      this.getRequest(options.goods_id, options.goods_num, options.item_id)
      that.data.goods_id = options.goods_id
      that.data.goods_num = options.goods_num
      that.data.item_id = options.item_id
    }
  },
  // 结算数据
  getRequest: function (goods_id, goods_num, item_id) {
    let that = this
    let url = baseurl.deal_cart + "?type=1&goods_id=" + goods_id + "&goods_num=" + goods_num + "&item_id=" + item_id
    request.getRequest(that, url, res => {
      if (res.status == 200) {
        let money = 0
        if (res.data.coupon.length > 0) {
          if (res.data.coupon.length == 1) {
            money = res.data.coupon[0].money;
            that.data.coupon_id = res.data.coupon[0].id
          }
          if (res.data.coupon.length > 1) {
            let newcop = res.data.coupon.sort((a, b) => {
              return b.money - a.money
            })
            money = newcop[0].money;
            that.data.coupon_id = newcop[0].id
          }
        }
        that.setData({
          list_data: res.data,
          hidden: 1,
          item_id: item_id,
          money: money
        })
      }
    }, a => { }, false, b => {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  jiesuan: function () {
    let that = this
    cart.jiesuan(that, res => {
      let money = 0
      if (res.coupon.length > 0) {
        if (res.coupon.length == 1) {
          money = res.coupon[0].money;
          that.data.coupon_id = res.coupon[0].id;
        }
        if (res.coupon.length > 1) {
          let newcop = res.coupon.sort((a, b) => {
            return b.money - a.money
          })
          money = newcop[0].money;
          that.data.coupon_id = newcop[0].id;
        }
      }
      that.setData({
        list_data: res,
        hidden: 1,
        flag: 1,
        money: money
      })
    })
  },
  liuyan: function (e) {
    this.setData({
      liuyan: e.detail.value
    })
  },
  pay: function (e) {
    let params = {}
    let that = this
    let flag = that.data.flag
    let list_data = that.data.list_data
    params.address_id = list_data.address.address_id
    params.user_note = that.data.liuyan
    params.coupon_id = that.data.coupon_id
    // 购物车结算
    if (flag == 1) {
      params.type = 2
    } else {
      //立即结算
      params.type = 1
      params.goods_id = list_data.goodsInfo[0].goods_id
      params.goods_num = list_data.goodsInfo[0].goods_num
      params.item_id = this.data.item_id
    }
    let url = flag == 1 ? baseurl.cart_order : baseurl.add_order
    request.postRequest(that, url, params, res => {
      if (res.status == 200) {
        order.pay(that, res.data.order_sn, a => {
          that.data.is_pay = true
          wx.redirectTo({
            url: '../../other/buy_result/buy_result?order_sn=' + res.data.order_sn,
          })
        })
      }
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
    let that = this
    if (that.data.is_pay == true) return
    if (that.data.isfirst == true) {
      let d = that.data
      if (d.isgwc == -1) {
        if (d.is_sx == false) {
          that.getRequest(d.goods_id, d.goods_num, d.item_id)
          d.is_sx = true
        }
      } else {
        if (d.is_sx == false) that.jiesuan()
      }
    } else that.data.isfirst = true
  },
  // 是否使用优惠券
  quanClick: function (e) {
    let that = this
    let goodsInfo = that.data.list_data.goodsInfo
    let goods_list = []
    let coupon_list = that.data.list_data.coupon //所属的优惠券
    for (let i = 0; i < goodsInfo.length; i++) {
      goods_list.push(goodsInfo[i].goods_id)
    }

    let price = that.data.list_data.totlePrice + that.data.list_data.shipping

    wx.navigateTo({
      url: '../usable_quan/usable_quan?coupon=' + JSON.stringify(coupon_list) + "&price=" + price,
    })
  },
  dizhiClick: function (e) {
    this.data.is_sx = false
    wx.navigateTo({
      url: '../../person/dizhi/dizhi?flag=1',
    })
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