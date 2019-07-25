// pages/cart/index/index.js
const cart = require('../../../utils/cart.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart_number: 0,
    //控制小点的变色
    check_flag: true,
    dd: 2,
    list_data: null,
    hidden: 0,
    img_path: baseurl.imgPath,
    allState: false,
    isTime: false,
    // 判断重新登录
    isRequest: false,

    is_vip: 0,
    guanliFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 倒计时
  countDown: function () {
  
    let that = this
    if (that.data.isTime == true) return
    setTimeout(res => {
      if (that.data.list_data) {
        let list_data = cart.msTime(that.data.list_data)
     
        if (list_data == -1) {
    
          setTimeout(()=>{
            that.postRequest(true)
          },1000)
          
        } else
          that.setData({
            list_data: list_data
          })
      }
      that.countDown()
    }, 1000);
  },
  postRequest: function (loding = true) {
    let that = this

    cart.cartList(that, res => {
      that.setData({
        failflag: false,
      })
      if (res.data) {
        //cart.tabBarRedDot(res.data.cart_number)

        res.data.list = cart.datasource(res.data.list)
        let state = cart.seletedState(res.data.list[0])
     
        if (that.data.isTime == true) {
          that.data.isTime = false
          that.countDown()
        } else {
          that.countDown()
        }
        let list_data = res.data;
        list_data.youhuiprice = parseInt(res.data.disPrice).toFixed(2);
        that.setData({
          list_data: list_data,
          hidden: 1,
          allState: state
        })
      } else {
        this.setData({
          hidden: 1,
          list_data: null
        })
      }
      cart.updateRedDot()
    }, loding)
  },
  // 逛逛
  gohome: function () {
    wx.switchTab({
      url: '../../home/index/index',
    })
  },
  // 改变单个状态
  changeState: function (e) {
    let index = e.detail.index
    let type = e.detail.type
    let list = this.data.list_data.list[type]
    let item = list[index]
    if (!item) return
    this.seletedRequest(item.id, item.selected)
  },
  // 改变全部状态
  allSeleted: function () {
    let that = this
    let allState = that.data.allState
    this.seletedRequest("", allState)
  },
  changeNum: function (e) {
    this.postRequest(false)
  },
  seletedRequest: function (id, state) {
    let that = this
    cart.seletedCart(that, id, state ? 0 : 1, res => {
      if (res.status == 200) {
        that.postRequest(false)
      }
    })
  },
  deleteGoods: function (e) {
    let type = e.detail.type
    let index = e.detail.index
    let list_data = this.data.list_data
    list_data.list[type].splice(index, 1)
    this.setData({
      list_data: list_data
    })
    this.postRequest(false)
    this.gwc_num();
    // util.showmodel('删除成功')
  },
  // 详情
  detailClick: function (e) {
    let index = e.detail.index
    let type = e.detail.type

    let list_data = this.data.list_data
    let goods_id = list_data.list[type][index].goods_id
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + goods_id,
    })
  },
  // 结算 与 删除

  jiesuan: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let list_data = that.data.list_data;
    let jies = false
    for (let i = 0; i < list_data.list[0].length; i++) {
      let item = list_data.list[0][i]
      if (item.selected == 1) {
        jies = true
        break;
      }
    }
    if (id == 1) { //结算 购物车（已选）
      if (jies == false) {
        util.showmodel('请选择要购买的产品')
        return
      }
      wx.navigateTo({
        url: '../../other/buy_goods/buy_goods?flag=1',
      })
    } else { //删除 购物车 （已选）
      if (jies == false) {
        util.showmodel('请选择要删除的产品')
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: '您确定要删除吗？',
        confirmText: "再想想",
        confirmColor: "#FF5000",
        cancelText: "确定",
        success: res => {
          if (res.cancel) {
            cart.deletate('', res => {
              that.postRequest(false);
              that.gwc_num();
            })
          }
        }
      })
    }
  },



  /**
   * 管理
   */
  guanli() {
    this.setData({
      guanliFlag: !this.data.guanliFlag
    })
  },

  /**
   *  移入收藏
   */
  makeshoucang() {
    let that = this;
    let list = that.data.list_data.list[1].length ? that.data.list_data.list[1] : [];
    let id_string = '';
    list.forEach(item => {
      id_string = id_string +item.goods_id + ',';
    })
    if (id_string){
      request.postRequest(that, baseurl.collect, { goods_id: id_string.substring(0, id_string.length-1)},res=>{
         
      })   

    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  no_datatap(){
    let that = this
    this.postRequest(that.data.list_data ? true : false)
    if (this.data.isTime == true) {
      this.data.isTime = false
      this.countDown()
    }
    that.gwc_num();
    that.setData({
      guanliFlag: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.postRequest(false)
    let that = this
    // that.countDown()
    this.postRequest(that.data.list_data ? true : false)

    if (this.data.isTime == true) {
      this.data.isTime = false
      this.countDown()
    }
    this.setData({
      is_vip: app.userinfo.is_vip
    })
    that.gwc_num();
    that.setData({
      guanliFlag: false
    })
  },

  gwc_num() {
    let that = this
    request.getRequest(that, baseurl.cart_number, res => {
      if (that.data.cart_num != res.data.cart_num) {
        that.data.cart_num = res.data.cart_num
        wx.setNavigationBarTitle({
          title: res.data.cart_num == 0 ? "购物车" : '购物车(' + res.data.cart_num + ')',
        })
      }
    }, c => { }, true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.isTime = true
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
    return request.share()
  }
})