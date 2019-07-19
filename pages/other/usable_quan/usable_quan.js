// pages/other/usable_quan/usable_quan.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quan: [{ img: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/person/person_quan_can.png?sign=dd95c124ce8126f28d23c811a809354a&t=1563272720', quan: '../../../images/other/person_quan_kguoqi.png', money: 'quan_guize ziti_3 quan_guize_can', time: 'color:#ffffff;' },
    { img: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/person/person_quan_guo.png?sign=c459534f28097f8f8961669a86467ede&t=1563272746', quan: '../../../images/other/person_quan_yixiaofei.png', money: 'quan_guize quan_guize1 ziti_3', time: 'color:#929fa8;' },
    { img: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/person/person_quan_guo.png?sign=c459534f28097f8f8961669a86467ede&t=1563272746', quan: '../../../images/other/person_quan_guoqi.png', money: 'quan_guize quan_guize1 ziti_3', time: 'color:#929fa8' }],
    opacity: 0, 
    seleted:0,
    coupon:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.info(JSON.parse(options.coupon))
    if (JSON.parse(options.coupon).length > 0){
      this.setData({
        coupon: JSON.parse(options.coupon)
        // price: JSON.parse(options.price),
      })
    }

    setTimeout(()=>{
      this.setData({
        opacity:1
      })
    },1000)
  },
  // getRequest: function (goods_list, order_amount){
  //   let that = this
  //   request.getRequest(that,baseurl.order_coupon + "?&goods_list=" + goods_list +"&order_amount="+order_amount,res=>{
  //       if(res.data == null){
  //         res.data = []
         
  //       }
  //     that.setData({
  //       list_data: res.data
  //     })
  //   },c=>{
  //     this.setData({
  //       hidden:2
  //     })
  //   })
  // },
  usableClick:function(e){
    console.log()
    let item = e.currentTarget.dataset.item,
    id = item.id
    let money = item.money
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      money: money, coupon_id: id
    })
    wx.navigateBack({
      delta: 1
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