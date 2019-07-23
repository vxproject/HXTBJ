// pages/order_detail/order_detail.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const orderstate = require('../../../utils/orderstate.js')
const order = require('../../../utils/order.js')
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 2,
    hidden: 0,
    list_data: null,
    flag: false,
    cancleorder_flag: false,  //取消订单状态
    arr_cancel: [
      { txt: '我不想买了', flag: false },
      { txt: '信息填写错误', flag: false },
      { txt: '商品拍重了', flag: false },
      { txt: '其他原因', flag: false },
    ],
    newArr: [{
      txt: '等待买家付款',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_daifukuan.png?sign=5f8571c94acc67c745574763c73abf16&t=1563354510'
    }, {
      txt: '交易关闭',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_yiguanbi.png?sign=8ebb3b836083b8cf2b59ce54a8aa86c2&t=1563353903'
    }, {
      txt: '等待卖家发货',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_daifahuo.png?sign=96dd1a35ef0b50f58f61f21cef755d5f&t=1563354537'
    }, {
      txt: '卖家已发货',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_daishouhuo.png?sign=77d74c3c92bfff8f0893f75b3b1c2bd6&t=1563354566'
    }, {
      txt: '交易完成',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_yishouhuo.png?sign=703774db13e5e16e673588125366db8f&t=1563354658'
    }, {
      txt: '交易完成',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_yishouhuo.png?sign=703774db13e5e16e673588125366db8f&t=1563354658'
    }, {
      txt: '交易完成',
      src: 'https://6878-hxt-cdff72-1258454013.tcb.qcloud.la/order_detail/ls_yishouhuo.png?sign=703774db13e5e16e673588125366db8f&t=1563354658'
    },],
    state: 0,
    img_path: baseurl.imgPath,
    isTime: false,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.data.options = options
  },
  orderData: function (id, flag) {
    let that = this
    let url = flag == "1" ? baseurl.order_detail + "?order_id=" + id : baseurl.order_detail + "?rec_id=" + id
    request.getRequest(that, url, res => {
      if (res.status == 200) {
        let state = orderstate.orderstate(res.data)
        that.setData({
          hidden: 1,
          list_data: res.data,
          state: state
        })
        if (state == 0) that.countDown()
        if (state == 3) that.datpp()
      }
    })
  },
  datpp: function () {
    let list_data = this.data.list_data
    let that = this
    if (list_data) {
      if (list_data.deleted == 0 && list_data.pay_status == 1) {
        setTimeout(res => {
          if (this.data.isTime == true) return
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          let time = list_data.auto_receive_time - timestamp
          let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          if (time <= 0) {
            list_data.daytime = null
            that.onLoad(that.data.options)
          } else {
            if (day > 0)
              list_data.daytime = "" + that.timeFormat(day) + "天" + that.timeFormat(hou) + "时" + that.timeFormat(min) + "分" + that.timeFormat(sec) + "秒";
            else if (hou > 0)
              list_data.daytime = "" + that.timeFormat(hou) + "时" + that.timeFormat(min) + "分" + that.timeFormat(sec) + "秒";
            else if (min > 0)
              list_data.daytime = "" + that.timeFormat(min) + "分" + that.timeFormat(sec) + "秒";
            else
              list_data.daytime = "" + that.timeFormat(sec) + "秒";
          }
          that.setData({
            list_data: list_data
          })
          that.datpp()

        }, 1000)
      }
    }

  },
  countDown: function () {
    let list_data = this.data.list_data
    let that = this
    if (list_data) {
      if (list_data.deleted == 0 && list_data.pay_status == 0) {
        setTimeout(res => {
          if (this.data.isTime == true) return
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          let time = list_data.pay_last_time - timestamp
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          if (time <= 0) {
            list_data.time = null
            let order_id = { order_id: item.order_id }
            that.cancelOrder(order_id)
          } else {
            if (hou > 0)
              list_data.time = "" + that.timeFormat(hou) + "时" + that.timeFormat(min) + "分" + that.timeFormat(sec) + "秒";
            else if (min > 0)
              list_data.time = "" + that.timeFormat(min) + "分" + that.timeFormat(sec) + "秒";
            else
              list_data.time = "" + that.timeFormat(sec) + "秒";
          }
          that.setData({
            list_data: list_data
          })
          that.countDown()

        }, 1000)
      }
    }

  },
  timeFormat: function (param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  cancelOrder1: function (orderid, that) {
    // that.postRequest(orderid)
  },
  orderClick: function (e) {
    console.log()
    let flag = e.currentTarget.dataset.flag
    let list_data = this.data.list_data
    let orderid = list_data.order_id
    let goods = list_data.goodsInfo[0]
    if (flag == 1) {// 取消订单
      this.setData({
        cancleorder_flag: !this.data.cancleorder_flag,
        orderid: orderid,//订单id
      })
    }
    // if (flag == 1) this.cancelOrder(orderid) // 取消订单 
    else if (flag == 2) this.payOrder(list_data.order_sn) //立即付款
    else if (flag == 3) this.wuliu(goods.rec_id) //物流
    else if (flag == 4) this.shouhuo(goods.rec_id) //确认收货
    // else if (flag == 5) this.payAgain(goods.goods_id, goods.item_id, goods.goods_num) //再来一次
    else if (flag == 6) this.pingjia(goods.rec_id, goods.spec_img) //评价
    else if (flag == 7) this.deletOrder(list_data)  // 删除订单
    else if (flag == 8) this.tixingOrder(goods.rec_id)  // 提醒发货
  },
  /**
   * 删除订单
   */
  deletOrder(data) {
    wx.showModal({
      content: '是否确定删除订单？',
      cancelColor: '#2170c9',
      confirmColor: '#2170c9',
      success: res => {
        if (res.confirm) {
          let obj = {};
          if (data.deleted == 1) {
            obj = {
              order_id: data.order_id
            };
          } else {
            obj = {
              rec_id: data.goodsInfo[0].rec_id
            };
          }
          request.postRequest(this, baseurl.order_hide, obj, res => {
            if (res.status == 200) {
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              prevPage.setData({
                seleted: this.data.options.pagenum
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.cancel) {
        }
      }
    })

  },
  /**
   * 提醒发货
   */
  tixingOrder(data) {
    wx.showModal({
      content: '只能提醒一次,您是否提醒？',
      cancelColor: '#2170c9',
      confirmColor: '#2170c9',
      success: res => {
        if (res.confirm) {
          request.postRequest(this,baseurl.order_remind, { rec_id: data }, res => {
            if (res.status == 200) {
              wx.showModal({
                content: '已通知卖家尽快为您发货！',
                showCancel:false,
                confirmText:'确定',
                confirmColor:'#2170c9',
                success:res=>{
                  let options = this.data.options
                  this.orderData(options.rec_id, "2")
                }
              })
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  cancelOrder: function (orderid) {
    let that = this
    order.cancelOrder(that, orderid, res => {
      util.showmodel(res.message)
      that.setData({
        cancleorder_flag: false,
      })
      if (res.status == 200) {
        that.onLoad(that.data.options)
      }
    })
  },
  payOrder: function (order_sn) {
    order.pay(this, order_sn, a => {
      wx.redirectTo({
        url: '../../other/buy_result/buy_result?order_sn=' + order_sn,
      })
    })
  },
  wuliu: function (rec_id) {
    wx.navigateTo({
      url: '../../other/webview/webview?url=' + baseurl.wuliuh5 + "&title=物流" + "&rec_id=" + rec_id,
    })
  },
  shouhuo: function (rec_id) {
    let that = this
    util.showCancelModel("要确认收货吗?", res => {
      order.orderList(that, "1", rec_id, res => {
        if (res.status == 200) {
          wx.navigateTo({
            url: '../../person/shouhuosuccess/shouhuosuccess?item=' + rec_id,
          })
        }
      })
    })
  },
  goodsDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    let goods_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + goods_id,
    })
  },
  payAgain: function (goods_id, item_id, goods_num) {
    wx.navigateTo({
      url: '../../other/buy_goods/buy_goods?goods_id=' + goods_id + "&goods_num=" + goods_num + "&item_id=" + item_id,
    })
  },
  pingjia: function (rec_id, image) {
    wx.navigateTo({
      url: '../../other/goods_eval/goods_eval?rec_id=' + rec_id + "&image=" + image,
    })
  },
  copyText: function () {
    wx.setClipboardData({
      data: this.data.list_data.order_sn,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  shouhou: function (e) {
    let that = this
    if (that.data.state == 2) {
      that.tuikuan()
    } else
      if (that.data.list_data.goodsInfo[0].return_status == 0)
        wx.navigateTo({
          url: '../order_tuikuan/order_tuikuan?rec_id=' + this.data.list_data.goodsInfo[0].rec_id + "&goodsInfo=" + JSON.stringify(this.data.list_data.goodsInfo),
        })
      else {
        wx.navigateTo({
          url: '../order_tuikuan_info/order_tuikuan_info?rec_id=' + this.data.list_data.goodsInfo[0].rec_id,
        })
      }
  },
  tuikuan: function (e) {
    let rec_id = this.data.list_data.goodsInfo[0].rec_id
    request.postRequest(this, baseurl.order_goods_cancel, {
      rec_id: rec_id
    }, res => {
      util.showmodel(res.message, res => {
        wx.redirectTo({
          url: '../order_detail/order_detail?rec_id=' + rec_id,
        })
      })
    })
  },
  /**
 * 选择一个原因
 */
  chooseOne_yy(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let arr_cancel = that.data.arr_cancel;
    let flag = arr_cancel[index].flag;
    arr_cancel.forEach(item => {
      item.flag = false
    })
    arr_cancel[index].flag = !flag;
    that.setData({
      arr_cancel: arr_cancel
    })
  },
  /**
  * 底部按钮 （取消订单）
  */
  makesure(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index == '1') {
      that.setData({
        cancleorder_flag: false
      })
    }
    if (index == '2') {
      let data = { order_id: that.data.orderid, reason: order.chools_one(that.data.arr_cancel, that) ? that.data.arr_cancel[that.data.index_ls].txt : undefined }
      this.cancelOrder(data);
    }

  },
  changese_flag() {
    this.setData({
      cancleorder_flag: !this.data.cancleorder_flag
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let options = this.data.options
    if (options.order_id) {
      this.orderData(options.order_id, "1")
    } else {
      this.orderData(options.rec_id, "2")
    }
    if (this.data.isTime = true) {
      this.data.isTime = false
      this.countDown()
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.isTime = true
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.isTime = true
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})