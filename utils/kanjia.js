const baseurl = require('baseurl.js')
const request = require('request.js')
const utils = require('util.js')

let add_goods = (that,params,cd) => {
  request.postRequest(that, baseurl.add_goods, params, res => {
    typeof cd == "function" && cd(res)
  })
}

let kanjia = (that,chop_goods_id,cd) =>{
  request.postRequest(that, baseurl.chop_user, { chop_goods_id: chop_goods_id},res=>{
      typeof cd == "function" && cd(res)
  })
}


function msTime(list_data,that) {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  list_data.chop_goods.forEach((item, index) => {
    if (item.status == 0) {
      let time = 0
      if (timestamp > item.chop_last_time) {
        item.status = 2
      } else {
        time = item.chop_last_time - timestamp
        let obj = {}
        if (time > 0) {
          // let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
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
          item.status = 2
          that.initUI(1)
        }
        item.time = obj
      }

    } else {
      // item.ms_state = 0
    }
  })
  return list_data
}

function timeFormat(param) {//小于10的格式化函数
  return param < 10 ? '0' + param : param;
}

function detailTime(list_data, that, type, chop_goods_id){
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  let item = list_data.info
    if (item.status == 0) {
      let time = 0
      if (timestamp > item.chop_last_time) {
        item.status = 2
      } else {
        time = item.chop_last_time - timestamp
        let obj = {}
        if (time > 0) {
          // let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
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
          item.status = 2
          if (type == 1) that.initUI(chop_goods_id)
          else that.stateUI(chop_goods_id)
        }
        item.time = obj
      }
    }
   
  return list_data
}

module.exports = {
  add_goods, msTime, detailTime, kanjia
}