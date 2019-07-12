// pages/person/replace/replace.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const collect = require('../../../utils/collect.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      hidden:0,
      list_data:null,
    img_path: baseurl.imgPath,
    is_sc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.dataRequest(1)
  },
  dataRequest:function(page){
    let that = this
    request.getRequest(that,baseurl.order_goods_list +"?type=cancel&page="+page,res=>{
      if(res.status == 200){
        if(page != 1){
          res.data.data = that.data.list_data.data.concat(res.data.data)
        }
        that.setData({
          hidden:1,
          list_data:res.data
        })
      }
    })
  },
  detail:function(e){
    let index = e.currentTarget.dataset.index
    let data = this.data.list_data.data[index]
    console.log(index)

    wx.navigateTo({
      url: '../order_detail/order_detail?rec_id=' + data.rec_id,
    })
  },

  copy: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.coptxt,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
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
  shouhou:function(e){
    console.log('---------')
    wx.navigateTo({
      url: '../../other/webview/webview?url=' + baseurl.shouhouh5 + "&title=售后说明"
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  shouchang: function (e) {
    let that = this
    if(that.data.is_sc == true) return
    that.data.is_sc = true
    let flag = e.currentTarget.dataset.flag
    let item = e.currentTarget.dataset.item
    let bindex = e.currentTarget.dataset.bindex
    let index = e.currentTarget.dataset.index
    if (item.is_collectd == 0) {
      //收藏
      collect.add_collect(that,item.goods_id, res => {
        that.changeCollectd(1, index, bindex, item, flag)
      })
    } else {
      //取消
      collect.collect_cancel(that,item.goods_id, res => {
        that.changeCollectd(0, index, bindex, item, flag)
      })
    }



  },
  changeCollectd: function (is_collectd, index, bindex, item, flag) {
    let that = this
    
    item.is_collectd = is_collectd
    let d = that.data.list_data.data
    d[bindex] = item
    d = collect.orderData(d, item.goods_id, is_collectd, flag)
    that.data.list_data.data = d
    that.setData({
      list_data: that.data.list_data
    })
    setTimeout(res => {
      that.data.is_sc = false
    }, 200)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let list_data = this.data.list_data
    if (list_data.current_page >= list_data.last_page){
      request.tixing([])
    }else{
      this.dataRequest(list_data.current_page*1+1)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})