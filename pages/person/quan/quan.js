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
    quan: [{ img: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/person/person_quan_can.png?sign=dd95c124ce8126f28d23c811a809354a&t=1563272720', quan: '../../../images/other/person_quan_kguoqi.png', money: 'quan_guize ziti_3 quan_guize_can', time:'color:#ffffff;' }, 
      { img: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/person/person_quan_guo.png?sign=c459534f28097f8f8961669a86467ede&t=1563272746', quan: '../../../images/other/person_quan_yixiaofei.png', money: 'quan_guize quan_guize1 ziti_3', time: 'color:#929fa8;' }, 
      { img: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/person/person_quan_guo.png?sign=c459534f28097f8f8961669a86467ede&t=1563272746', quan: '../../../images/other/person_quan_guoqi.png', money: 'quan_guize quan_guize1 ziti_3', time:'color:#929fa8'}],
    opacity:0,
     
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
      seleted: flag,
      list_data:[]
    })
   
    this.postRequest(flag)
  },
  postRequest:function(e,page=1){
    let that = this
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
          if (that.data.opacity == 0)
          setTimeout(()=>{
              that.setData({
                opacity:1
              })
          },1000)
        }
    },c=>{
        this.setData({
          hidden:1
        })
    })
  },
  /**
   * 立即使用
   */
  shiyong:function(e){
    wx.switchTab({
      url: '../../home/index/index',
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