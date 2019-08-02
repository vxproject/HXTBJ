const baseurl = require('baseurl.js')
const request = require('request.js')
const utils = require('util.js')
function addgwc(that,goodsid, goods_num, cd,item_id=null){
  let params = {
    goods_id: goodsid,
    goods_num: goods_num
  }
  if (item_id) params.item_id = item_id
  request.postRequest(that,baseurl.add_cart,params,res=>{
    if (res.status == 200){
      tabBarRedDot(res.data.cart_number)
      typeof cd == "function" && cd(res)
      setTimeout(a=>{
        showLoading()
      },100)   
    }
  })
}
// 状态
function seletedCart(that,id,only_id,cd){
  let params = {}
  if(id != "") params = {
    id:id,
    only_id: only_id,
  }
  else params = {
    all_select: only_id
  }
  request.postRequest(that,baseurl.select_cart,params,res=>{
      if(res.status == 200){
        typeof cd =="function" && cd(res)
      }
  })
}
// 购物车列表
function cartList(that,cd, loding=false){
  request.getRequest(that,baseurl.cart,res=>{
    typeof cd == "function" && cd(res)
  },c=>{

  },loding)
}
//全选状态
function seletedState(data){
  let state = true
  for(let i = 0;i < data.length;i++){
    if (data[i].selected == 0) {
      state = false
      break;
    }
  }
  return state
}
// 改变数量
function changeNum(that, id, num, type_ls,cd){
  request.postRequest(null, baseurl.change_num, { id: id, goods_num: num, type: type_ls},res=>{
    that.setData({
      isRequest:false
    })
      if(res.status == 200) 
      typeof cd == "function" && cd(res)
  })
}
// 删除购物车里面的数据
function deletate(id,cd){
  request.postRequest(null,baseurl.cart_delete,{id:id},res=>{
    if(res.status == 200){
      updateRedDot(null)
      typeof cd == "function" && cd(res)
    }
  })
}
function showLoading(){
  wx.showToast({
    title: '加入购物车成功',
    icon: 'success',
    duration: 2000
  })
}
function jiesuan(that,cd){
  request.getRequest(that,baseurl.deal_cart+"?type=2",res=>{
    if(res.status == 200){
      typeof cd == "function" && cd(res.data)
    }
  },a=>{},false,a=>{
    wx.navigateBack({
      delta:1
    })
  })
}

function msTime(list_data){
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  list_data.list[0].forEach((item,index)=>{
   
    if (item.flashSale.length > 0){
      if (item.specGoods.store_count == 0){
        list_data.list[0].splice(index,1)
        item.ms_state = 3
        list_data.list[1].push(item)

      }else{
        let time = 0
        if (timestamp > item.flashSale[0].end_time) {
          //已经结束
          item.ms_state = 0
        } else {
          if (timestamp < item.flashSale[0].start_time) {
            //未开始
            time = item.flashSale[0].start_time - timestamp
            item.ms_state = 1
          } else {
            //秒杀中
            time = item.flashSale[0].end_time - timestamp
            item.ms_state = 2
          }
          let obj = {}
          if (time > 0) {
            let day = parseInt(time / (60 * 60 * 24));
            let hou = day > 0 ? day * 24 + parseInt(time % (60 * 60 * 24) / 3600) * 1 : parseInt(time % (60 * 60 * 24) / 3600) * 1;
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
              // day: timeFormat(day),
              hou: timeFormat(hou),
              min: timeFormat(min),
              sec: timeFormat(sec)
            }
          } else {
            obj = {
              day: "00",
              hou: "00",
              min: "00",
              sec: "00"
            }
           
            list_data = '-1'
          }
          item.time = obj
        }
      }
     
     
    }else{
      item.ms_state = 0
    }
  })
  return list_data
}

function datasource(list_data){
    let shangjia = []
    let xiajia = []
    for(let i = 0;i < list_data.length;i++){
      let item = list_data[i]
      if (item.goodsInfo.is_on_sale == 1 && item.specGoods.store_count != 0){
        if (item.flashSale[0]){
          if (item.flashSale[0].status == 1){
            item.ms_state = 2
            item.time = {
              hou:'00',
              min:'00',
              sec:'00'
            }
          } 
        }
        shangjia.push(item)
      } 
      else xiajia.push(item)
    }
    return [shangjia,xiajia]

}

function timeFormat(param){//小于10的格式化函数
  return param < 10 ? '0' + param : param;
}
// 购物车数量角标
function tabBarRedDot(dot){
  if(dot > 0){
      wx.setTabBarBadge({
      index: 2,
      text: ""+dot,
    })
  }else{
    wx.removeTabBarBadge({
      index:2
    })
  }
}

function updateRedDot(that){
  request.getRequest(that,baseurl.cart_number,res=>{
      if(res.status == 200){
        tabBarRedDot(res.data.cart_num)
      }
  },c=>{},true)
}
module.exports={
  addgwc, cartList, seletedCart, seletedState, changeNum, deletate, msTime, jiesuan, tabBarRedDot, updateRedDot, datasource
}