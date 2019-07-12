const baseurl = require('baseurl.js')
const request = require('request.js')
const utils = require('util.js')
const cart = require('cart.js')

function cancelOrder(that,order_id,cd){
  request.postRequest(that,baseurl.order_cancel, { order_id: order_id},res=>{
    typeof cd == "function" && cd(res)
  })  
}
function orderList(that,flag, rec_id,cd){
  let url = ""
  if (flag == "1") url = baseurl.goods_confirm
  request.postRequest(that,url, { rec_id: rec_id }, res => {
    typeof cd == "function" && cd(res)
  })  
}
function pay(that,order_sn,cd){
  request.getRequest(that,baseurl.wx_pay +"?order_sn="+order_sn,res=>{
    let c = res.data
    wx.requestPayment({
      timeStamp: ""+c.timeStamp,
      nonceStr: c.nonce_str,
      package: c.package,
      signType: 'MD5',
      paySign: c.sign,
      success(res) {

        typeof cd == "function" && cd(1)
      },
      fail(res) {
        typeof cd == "function" && cd(2)
        console.log(res)
      },complete(){
        
      }
    })
  },c=>{

  },false,a=>{
    typeof cd == "function" && cd(2)
  })
}
module.exports={
  cancelOrder, orderList, pay
}