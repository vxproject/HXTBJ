//弹框提示
const baseurl = require('baseurl.js')
const request = require('request.js')
let push_alert=(that,cd)=>{
  request.getRequest(that,baseurl.push_image,res=>{
    typeof cd == "function" && cd(res)
  })
}
//比价弹窗
let parity = (that, goods_id, cd, item_id=-1) => {
  console.log(item_id)
  let url =  baseurl.parity+"?goods_id=" + goods_id
  if(item_id != -1){
    url =  baseurl.parity + "?goods_id=" + goods_id+"&item_id="+item_id
  }
  request.getRequest(that,url, res => {
    typeof cd == "function" && cd(res)
  })
}
module.exports ={
  push_alert, parity
}