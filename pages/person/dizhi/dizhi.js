// pages/person/dizhi/dizhi.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const search = require('../../../utils/search.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
      hidden:0,
      list_data:[],
      flag:0,
      value:'',
      result:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu()
      if(options.flag) this.data.flag = options.flag
      this.postRequest()
    },
    //添加地址按钮
    adddizhi: function (){
        wx.navigateTo({
          url: '../dizhi_xiangqing/dizhi_xiangqing',
        })
    },
    postRequest:function(){
      let that = this
      request.getRequest(that,baseurl.address_list,res=>{
          if(res.status == 200){
              this.setData({
                list_data:res.data
              })
          }else{
            util.showmodel(res.message)
          }
      },c=>{
          that.setData({
            hidden:1
          })
      })
    },
    edditaddress:function(e){
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      item.index = index
      wx.navigateTo({
        url: '../dizhi_xiangqing/dizhi_xiangqing?item=' + JSON.stringify(item),
      })
    },
    seletedaddress:function(e){
      let that = this
      let item = e.currentTarget.dataset.item
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      if(that.data.flag == 1){
        let list_data = prevPage.data.list_data
        list_data.address = item
        prevPage.setData({
          list_data: list_data,
          is_sx:true
        })
        wx.navigateBack({
          delta:1
        })
      }else if(that.data.flag == 2){
          prevPage.setData({
            address:item
          })
        
          wx.navigateBack({
            delta:1
          })
        prevPage.kanjiaClick()
      }
      
    },
  bindKeyInput:function(e){
    let value = e.detail.value
    let result = search.searchList(value, this.data.list_data)
    this.setData({
      value:value,
      result:result
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