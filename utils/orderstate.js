var orderstate = function(list_data) {
  // 未支付
  if (list_data.pay_status == 0) {
    if (list_data.deleted == 1) {
      // 订单取消
      return 1
    } else {
      //待支付
      return 0
    }
  } else { //已经支付
    let good_info = list_data.goodsInfo
    if (good_info[0].is_comment == 0 && good_info[0].is_send == 0 && good_info[0].return_status == 0) return 2 //待发货
    else if (good_info[0].is_comment == 0 && good_info[0].is_send == 1 && good_info[0].return_status == 0) return 3 //待收货
    else if (good_info[0].is_comment == 1) return 5  //已评论
    else if (good_info[0].return_status == 1 || good_info[0].return_status == 2) return 6
    else if (good_info[0].is_send == 4) return 4   //待评论
  }
  return 0
}
module.exports = {
  orderstate
}