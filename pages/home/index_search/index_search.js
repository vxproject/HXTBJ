// pages/home/index_search/index_search.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const util = require('../../../utils/util.js')
const cart = require('../../../utils/cart.js')
const push = require('../../../utils/push.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sales_sum: '',
    shop_price: '',
    search_mix: '',
    list_data: null,
    img_path: baseurl.imgPath,
    seleted: 0,
    hidden: 0,
    is_vip: 0, is_bijia: false, bj_data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shuju = wx.getStorageSync('shuju')
    this.setData({
      shuju: shuju,
      is_vip:app.userinfo.is_vip
    })
    wx.getStorage({
      key: 'shuju',
      fail: function (res) {
        wx.setStorage({
          key: 'shuju',
          data: [],
        })
      }
    })
  },
  // 输入框
  bindinput: function(e) {
    let value = e.detail.value
    console.log('走这里了  导致name被清空了111')
    console.log(value)
    this.data.name = value
    console.log('走这里了  导致name被清空了')
    console.log(this.data.name)
  
  },

  // search
  search: function(type=0,index=-1) {
    this.listRequest(1, type, index)
  },
  clearClose:function(e){
    this.setData({
      name:''
    })
  },
  // 数据请求
  listRequest: function(page,type=0,index=-1) {
    let that = this
    let name = that.data.name
    that.setData({
      hidden: 1
    })
    this.saveJilu(name,type,index)
    let sales_sum = that.data.sales_sum
    let shop_price = that.data.shop_price
    let search_mix = that.data.search_mix
    let seleted = that.data.seleted
    let url = baseurl.goods_search + "?name=" + name + "&page=" + page
    if (seleted == 0) url = url + "&search_mix=desc"
    else if (seleted == 1) url = url + "&sales_sum=desc"
    else if (seleted == 2) url = url + "&shop_price=asc"
    else url = url + "&shop_price=desc"
  
    request.getRequest(that,url, res => {
      if (res.status == 200) {
        if (page == 1) that.setData({
          list_data: res.data
        })
        else {
          let list_data = that.data.list_data
          request.tixing(res.data.data)
          res.data.data = list_data.data.concat(res.data.data)
          that.setData({
            list_data: res.data
          })
        }

      }
    })
  },
  clear1:function(e){

    let that = this
    // wx.setStorageSync(key, data)
    wx.setStorage({
      key: 'shuju',
      data: [],
      success:function(){
        that.setData({
          shuju: []
        })
      }
    })
    // try {
    //   wx.setStorageSync('shuju', [])
    // } catch (e) { }
    
  },

  
  goodsDetail: function(e) {
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },
  addgwc: function(e) {
    let goods_id = e.currentTarget.dataset.id
    cart.addgwc(this,goods_id, 1)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 比价点击数据
  bijiaClick: function (e) {
    let that = this
    let d = that.data
    if (d.bj_data.length > 0) {
      that.setData({
        is_bijia: true,
      })
      return
    }

    let item = e.currentTarget.dataset.item
    let goods_id = item.goods_id
    push.parity(that,goods_id, res => {
      let bj_data = {}
      if (!res.data) {
        util.showmodel('暂未找到此商品比价信息')
        return
      }
      bj_data.pingtai = res.data
      // 自己产品参数
      let cs = {
        shop_price: item.shop_price,
        goods_name: item.goods_name,
        goods_image: baseurl.imgPath + "" + item.original_img
      }
      bj_data.imgPath = baseurl.imgPath
      bj_data.cs = cs
      that.setData({
        is_bijia: true,
        bj_data: bj_data
      })
    })


  },

  clear: function (e) {
    this.setData({
      is_bijia: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  changeTop: function(e) {

    let seleted = e.currentTarget.dataset.seleted
    let s_seleted = this.data.seleted
    if (seleted == 2) {
      seleted = s_seleted == 2 ? 3 : 2
      
    } else if (seleted == s_seleted) {
      return
    }
    this.setData({
      seleted: seleted
    })
    this.listRequest(1)
  },
  saveJilu: function(name,type=0,index=-1) {
  
    if(name == '') return
    wx.getStorage({
      key: 'shuju',
      success: function (res) {
       let shuju = res.data
        if (!shuju) shuju = []

        if (type == 1) {
          shuju.splice(index, 1)
        }
     
        let data = []
        data.push(name)
        if (shuju.length >= 10) {
          shuju.pop()
          
        } else {
          if(shuju.length == 0) shuju = data
          else shuju = data.concat(shuju) 
        }
       wx.setStorage({
         key: 'shuju',
         data: shuju,
       })

        // try {
        //   wx.setStorageSync('shuju', shuju)
        // } catch (e) { }
      }, fail:function(e){
        
      }
    })
    // var shuju = wx.getStorageSync('shuju')
  
  },
  searchItem: function(e) {
    var item = e.currentTarget.dataset.item
    console.log(item)
    var index = e.currentTarget.dataset.index
    this.setData({
      name:item
    })
    this.search(1,index)
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
    this.listRequest(this.data.list_data.current_page * 1 + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return request.share()
  }
})