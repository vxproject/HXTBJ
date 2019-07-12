// pages/person/quan/quan.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seleted: 0,
    topData: ["可使用", "已消费", "已过期"],
    hidden:0,
    list_data:[],
    quan: [{img: '../../../images/image/person_quan_can.png', quan: 'quan_title ziti_1 quan_title_can', money: 'quan_guize ziti_3 quan_guize_can', time:'color:#ffffff;' }, 
      { img: '../../../images/image/person_quan_guo.png', quan: 'quan_title quan_title1 ziti_1', money: 'quan_guize quan_guize1 ziti_3', time: 'color:#929fa8;' }, 
      { img: '../../../images/image/person_quan_to.png', quan: 'quan_title quan_title1 ziti_1', money: 'quan_guize quan_guize1 ziti_3', time:'color:#929fa8'}]
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    this.postRequest(0)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 这个是选项卡
  btnClick: function(e) {
    let flag = e.currentTarget.dataset.flag
    this.setData({
      seleted: flag
    })
    console.log(this.data.quan[flag].img)
    this.postRequest(flag)
  },
  postRequest:function(e,page=1){
    let a = +"?type=" + e
    request.getRequest(this,baseurl.coupon + "?type=" + e+"&page="+page,res=>{
        if(res.status == 200){
          if(page != 1){
            let d = this.data.list_data

            res.data.data = d.data.concat(res.data.data)
          }
          this.setData({
            list_data: res.data
          })
        }
    },c=>{
        this.setData({
          hidden:1
        })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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

    let d = this.data.list_data

    if (d.current_page >= d.last_page) request.tixing([])
    else this.postRequest(this.data.seleted, d.current_page * 1 + 1)
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})