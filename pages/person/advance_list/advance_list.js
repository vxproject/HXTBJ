// pages/person/advance_list/advance_list.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seleted: 0,
    topData: ["可使用", "已消费", "已过期"],
    list_data: [{ data: [] }, { data: [] }, { data: [] }],
    isRequest:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData(1)
  },
  // 这个是选项卡
  btnClick: function (e) {
    let that = this
    if (that.data.isRequest == true) return
    let flag = e.currentTarget.dataset.flag
    that.setData({
      seleted: flag
    })
    let list_data = that.data.list_data
    if (list_data[flag].data.length <= 0) that.requestData()
  },
  // 网络请求
  requestData:function(page=1){
    let that = this
    that.data.isRequest = true
    let status = that.data.seleted
    request.getRequest(that,baseurl.pre_goods + "?status=" + status+"&page="+page,res=>{
      let list_data = that.data.list_data
      let shuju = list_data[that.data.seleted]
      res.data.data = shuju.data.concat(res.data.data)
      list_data[that.data.seleted] = res.data
      if (page > 1) request.tixing(res.data.data)
      that.setData({
        list_data: list_data
      })
    },c=>{
      that.data.isRequest = false
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
    let that = this
    that.postRequest(that.data.seleted, that.data.list_data[that.data.seleted].current_page * 1 + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})