// pages/other/webview/webview.js
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    options:{},
    flag:0,
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.options = options
    wx.hideShareMenu()
    this.setData({
      url: options.url + "?token=" + wx.getStorageSync('token')
    })
    if(options.str){
      let str = options.str
      str = str.replace(/\$/g, '=');
      str = str.replace(/\*/g, '&');
      if (str == 'ys') this.setData({
        url: this.data.url + "&is_wx=1&"+str
      })
      else{
        this.setData({
          url: this.data.url + "&" + str + "&is_wx=1&url=../goods_detail/goods_detail"
        })
      }
     
    }
   else if (options.rec_id){
      this.setData({
        url: this.data.url +"&rec_id="+options.rec_id
      })
    }
    else if(options.url1){
      this.setData({
        url: this.data.url +"&is_wx=1"
      })
    }
    else if(options.type){
      this.setData({
        url: this.data.url + "&type="+options.type
      })
    }
  
  },
  load:function(e){
    wx.setNavigationBarTitle({
      title: this.data.options.title,
      
    })

  },
  msgHandler:function(e){
    console.log('-------------')

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