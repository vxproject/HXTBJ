//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // number1:40,
    // sum:37,
    // index:1,
  },

  onLoad: function () {
    this.ceshi()
  },
 
  minusFromCart1: function(e){
    this.spSum(e)
  },
  addToCart1: function(e){
    this.spSum(e)
    console.log(this.data.number1)
  },
  spSum(e){
    this.setData({
      number1: e.detail.number
    })
  },
  ceshi:function(){
    this.ceshi2(5,this.ceshi3)
  },
  ceshi2: function (a,b) {
    if(a == 5){
      typeof b == "function" && b(1,9)
    }
  },
  ceshi3:function(e,c){
    console.log(e)
    console.log(c)
  }
})
