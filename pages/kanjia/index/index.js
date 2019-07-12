// pages/kanjia/index/index.js

const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const utils = require('../../../utils/util.js')
const kanjia = require('../../../utils/kanjia.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    hidden: 0,
    list_data: null,
    img_path: baseurl.imgPath,
    kj_state: ['继续砍价',"查看订单","点击删除"],
    isTime:false,
    chop_id:-1,
    address:{},
    is_dizhi:false,
    is_click:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  initUI: function(page=1) {

    let that = this
    request.getRequest(that, baseurl.chop_price + "?page=" + page, res => {
      let list_data = that.data.list_data
      if (page == 1) list_data = res.data
      else res.data.chop_price.data = list_data.chop_price.data.cancat(res.data.chop_price.data)
      that.setData({
        hidden: 1,
        list_data: res.data
      })
      if (that.data.isTime == false) {
        that.data.isTime = true
        that.countDown()
      }
      
     // that.countDown()
    })
  },
  // 点击免费拿
  countDown:function(){
    let that = this
    if(that.data.isTime == false){
      return
    } 
    that.data.isTime = true
    let list_data = that.data.list_data
    if (!list_data){
      that.data.isTime = false
      return
    } 
    if (list_data.chop_goods.length == 0){
      that.data.isTime = false
      return
    } 
    setTimeout(res => {
      that.countDown()
    }, 1000)
    list_data = kanjia.msTime(list_data,that)
    that.setData({
      list_data:list_data
    })

  },
  mfpay: function(e) {
    let that = this
    let chop_id = e.currentTarget.dataset.chop_id
 
    that.data.chop_id = chop_id
    wx.navigateTo({
      url: '../../person/dizhi/dizhi?flag=2',
    })
  },

  kanjiaClick:function(e){
    let that = this
    let address = that.data.address
    that.setData({
      is_dizhi:true
    })
    // utils.showmodel(address.province_name + "" + address.city_name + "" + address.district_name + address.address + "" + address.mobile,res=>{

    // })
  },
  confirm_btn:function(e){
    let that = this
    let flag = e.currentTarget.dataset.flag
    that.setData({
      is_dizhi:false
    })
    if(flag == 1)
      kanjia.add_goods(that, { chop_id: that.data.chop_id,address_id:that.data.address.address_id }, res => {
      wx.navigateTo({
        url: '../kj_info/kj_info?chop_goods_id=' + res.data.chop_goods_id +"&is_kj=0",
      })
      that.initUI(1)
    })

  },

// 砍价详情
  kj_detail:function(e){
    let that = this
    let chop_goods_id = e.currentTarget.dataset.chop_goods_id
    let is_kj = e.currentTarget.dataset.is_kj
    console.log(is_kj)
    wx.navigateTo({
      url: '../kj_info/kj_info?chop_goods_id=' + chop_goods_id + "&is_kj=" + is_kj+"&type=1",
    })

  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  shouhou:function(e){
    let item = e.currentTarget.dataset.item
    let that = this
    if(item.status == 1) wx.navigateTo({
      url: '../../other/webview/webview?url=' + baseurl.wuliuh5 + "&title=物流" + "&rec_id=" + item.rec_id,
    })
    else {
      if (that.data.is_click == true)  return;
      that.data.is_click = true
      request.postRequest(this, baseurl.chop_delete, { chop_goods_id: item.chop_goods_id},res=>{
        let index = e.currentTarget.dataset.index
        let list_data = that.data.list_data
        list_data.chop_goods.splice(index,1)
        that.setData({list_data:list_data})
      },a=>{
        that.data.is_click = false
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    if (that.data.isTime == false){
      that.data.isTime = true
      that.countDown()
    }
    wx.hideShareMenu()
    this.initUI(1)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.data.isTime = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.isTime = false
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
  }
})