// 个人中心的数据
const baseurl = require('baseurl.js')
let person_data = {
  dingdan_list: [
    {
      img: "../../../images/image/person_index_fukuan.png",
      title: "待付款",
      path: '../order/order?flag=1',
      num: 0
    },
    {
      img: "../../../images/image/person_index_fahuo.png",
      title: "待发货",
      path: '../order/order?flag=2',
      num: 0
    },
    {
      img: "../../../images/image/person_index_shouhuo.png",
      title: "待收货",
      path: '../order/order?flag=3',
      num: -1
    },
    {
      img: "../../../images/image/person_index_pingjia.png",
      title: "待评价",
      path: '../order/order?flag=4',
      num: 0
    },
    {
      img: "../../../images/image/person_index_tuihuan.png",
      title: "退换货",
      path: '../replace/replace',
      num: 0
    }
  ],
  fuwu_list: [
    {
      img: "../../../images/image/person_index_liquan.png",
      title: "我的礼券",
      path: '../quan/quan'
    },
    {
      img: "../../../images/image/person_index_dizhi.png",
      title: "收货地址",
      path: '../dizhi/dizhi'
    },
    {
      img: "../../../images/image/person_index_ruzhu.png",
      title: "商家入驻",
      path: '../../other/webview/webview?url=' + baseurl.businessh5 + "&title=" + '商家入驻'
    },
    {
      img: "../../../images/image/person_index_bangzhu.png",
      title: "帮助中心",
      path: '../../other/webview/webview?url=' + baseurl.wentih5 + "&title=" + '帮助中心'+"&flag=1"
    },
    {
      img: "../../../images/image/person_index_sc.png",
      title: "我的收藏",
      path: '../shoucang_list/shoucang_list'
    },
    {
      img: "../../../images/image/kanjia.png",
      title: "我的砍价",
      path: '../../kanjia/mykanjia/mykanjia'
    },
  ],
  setlist: [
    { path: '../../other/webview/webview?url=' + baseurl.self_yinsih5 + "&title=" + '隐私' },
    { path: '../../other/webview/webview?url=' + baseurl.mianzeh5 + "&title=" + '法律免责' },

  ]
}

module.exports = {
  person_data
}