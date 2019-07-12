const baseurl = require('baseurl.js')
const request = require('request.js')
//添加商品收藏
let add_collect = (that,goods_id, cd) => {
  request.postRequest(that,baseurl.collect, { goods_id: goods_id }, res => {
    typeof cd == "function" && cd(res)
  })
}
/**
 * 获取收藏列表
 */
function collect_list(that,num, cd) {
  request.getRequest(that,baseurl.collect + "?page=" + num, res => {
    typeof cd == "function" && cd(res)
  })

}

/**
 * 取消收藏
 */

function collect_cancel(that,goodsid, cd) {
  request.postRequest(that,baseurl.collect_cancel, { goods_id: goodsid }, res => {
    typeof cd == "function" && cd(res)
  })
}
/**
 * 处理id
 */
function selectids(list, cd) {
  let goodid = ''
  list.forEach(item => {
    if (item.flag) {
      goodid = goodid + item.goods_id + ',';
    }
  })
  typeof cd == "function" && cd(goodid)
}


function selectAll(list) {
  let allFlag = true
  list.forEach(item => {
    if (!item.flag) {
      allFlag = false
    }
  })
  return allFlag
}



let orderData = (list_data, goods_id, is_collectd, flag) => {
  list_data.forEach((goodsInfo) => {
    if (flag == 0)
      goodsInfo.goodsInfo.forEach(item => {
        console.log(item)
        if (item.goods_id == goods_id) {
          item.is_collectd = is_collectd
        }
      })
    else if (goodsInfo.goods_id == goods_id) {
      goodsInfo.is_collectd = is_collectd
    }
  })

  return list_data
}

module.exports = {
  add_collect, collect_list, selectAll, collect_cancel, selectids, orderData
}