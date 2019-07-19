// pages/person/dizhi_xiangqing/dizhi_xiangqing.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const utils = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rangeTitle: [
      ["请选择"],
      ["请选择"],
      ["请选择"]
    ],
    rangeID: ["-1", "-1", "-1"],
    customItem: '',
    multiIndex: [0, 0, 0],
    diqus: [0, 0, 0],
    name:'',
    phone:'',
    dizhiText:'省、市、区县',
    item:null,
    address:'',
    checked:false
    
  },
  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    if(options.item){
      let item = JSON.parse(options.item)
      this.setData({
        item: item,
        checked: item.is_default == 0 ? false:true,
        dizhiText: item.province_name + "" + item.city_name + "" + item.district_name,
      })
      this.data.name = item.consignee
      this.data.phone = item.mobile
      this.data.address = item.address
    }
    if(options.flag) {
      wx.setNavigationBarTitle({
        title: '添加地址',
      })
    }
    this.cityRequest(0, -1)
  },
  // 所在地区城市请求
  cityRequest: function(flag, id) {
    let url = flag == 0 ? baseurl.address : baseurl.address + "?id=" + id
    let that = this
    request.getRequest(that,url, res => {
      if (res.status == 200) {
        var ids = ["请选择"]
        var titles = ["请选择"]
        if (res.data)
          res.data.forEach((item, index) => {
            titles.push(item.name)
            ids.push(item.id)
          })
        let rangeID = that.data.rangeID
        let rangeTitle = that.data.rangeTitle
        rangeID[flag] = ids;
        rangeTitle[flag] = titles
        that.setData({
          rangeID: rangeID,
          rangeTitle: rangeTitle
        })
      }
    }, c => {}, true)
  },
  bindMultiPickerChange: function(e) {
    this.data.multiIndex = e.detail.value
  },
  // 改变pickview  然后改变值
  bindMultiPickerColumnChange: function(e) {
    let column = e.detail.column
    let index = e.detail.value
    this.changecity(column, index)
    if (column >= 2) return
    let rangeTitle = this.data.rangeTitle

    if (index == 0 && column != 2) {
      rangeTitle[column + 1] = ["请选择"]
      if (column == 0) rangeTitle[column + 2] = ["请选择"]
      this.setData({
        rangeTitle: rangeTitle
      })
    } else {
      if (column == 0 || column == 1) {
        rangeTitle[2] = ["请选择"]
        if (column == 0) rangeTitle[1] = ["请选择"]
      }
      this.setData({
        rangeTitle: rangeTitle
      })
      this.cityRequest(column + 1, this.data.rangeID[column][index])
    }
  },
  // pickview 改变城市
  changecity: function(column, value) {
    let rangeTitle = this.data.rangeTitle
    let diqus = this.data.diqus
    let text = ''

    switch (column) {
      case 0:
        {
          this.changecityV(0, value)
          this.changecityV(1, 0)
          this.changecityV(2, 0)
          if (value != 0) text = rangeTitle[0][value]
          break;
        }
      case 1:
        {
          this.changecityV(1, value)
          this.changecityV(2, 0)
          let hz = value == 0 ? " " : rangeTitle[1][value]
          text = rangeTitle[0][diqus[0]] + "" + hz
          break;
        }
      case 2:
        {
          this.changecityV(2, value)
          let hz = value == 0 ? " " : rangeTitle[2][value]
          text = rangeTitle[0][diqus[0]] + "" + rangeTitle[1][diqus[1]] + hz
          break;
        }
    }
      this.setData({
        dizhiText: text
      })
    
  },
  changecityV: function(column, value) {
    this.data.diqus[column] = value
  },
  bindKeyInput:function(e){
    let flag = e.currentTarget.dataset.flag
    if (flag == 'phone') {
      this.setData({
        phone: e.detail.value
      })
    } else if (flag == 'name') {
      this.setData({
        name: e.detail.value
      })
    }else{
      this.setData({
        address: e.detail.value
      })
    }
  },
  switchChange:function(){
    this.setData({
      checked: !this.data.checked
    })
  },
  // 保存地址
  saveAddress:function(){
    let that = this
    let d = this.data
    if(!d.item)
    if(d.diqus[0] == 0 
      || d.diqus[1] == 0
      || d.diqus[2] == 0  ){
        utils.showmodel('请选择您所在的地区')
        return
      }
    let province = d.diqus[0] == 0 ? d.item.province: d.rangeID[0][d.diqus[0]]
    let city = d.diqus[1] == 0 ? d.item.city : d.rangeID[1][d.diqus[1]]
    let district = d.diqus[2] == 0 ? d.item.district : d.rangeID[2][d.diqus[2]]
    let params = {
      consignee:d.name,
      mobile: d.phone,
      province: province,
      city: city,
      district: district,
      address:d.address,
      is_default:d.checked == true?1:0
    }
 
    if (d.item) params.address_id = d.item.address_id
    request.postRequest(that,baseurl.do_address,params,res=>{
        if(res.status == 200){
          utils.showmodel(res.message,res=>{
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.postRequest()
            wx.navigateBack({
              delta:1
            })
          })
        }else{
          utils.showmodel(res.message)
        }
    })
  },
  //删除地址
  delete:function(){
    let that = this
    let item = that.data.item
    request.postRequest(that,baseurl.address_delete, { address_id: item.address_id},res=>{
      if (res.status == 200) {
        utils.showmodel(res.message, res => {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.data.list_data.splice(item.index,1)
          prevPage.setData({
            list_data: prevPage.data.list_data
          })
          wx.navigateBack({
            delta: 1
          })
        })
      } else {
        utils.showmodel(res.message)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})