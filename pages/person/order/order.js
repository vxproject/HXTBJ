// pages/person/order/order.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const order = require('../../../utils/order.js')
const util = require('../../../utils/util.js')
const collect = require('../../../utils/collect.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancleorder_flag: false,  //取消订单状态
    arr_cancel: [
      { txt: '我不想买了', flag: false },
      { txt: '信息填写错误', flag: false },
      { txt: '商品拍重了', flag: false },
      { txt: '其他原因', flag: false },
    ],



    seleted: 0,
    is_vip: 0,
    topData: [{
      title: "全部",
      type: ''
    }, {
      title: "待付款",
      type: 'WAITPAY'
    }, {
      title: "待发货",
      type: 'waitSend'
    }, {
      title: "待收货",
      type: 'waitReceive'
    }, {
      title: "待评价",
      type: 'waitComment'
    }],
    hidden: 0,
    list_data: [],
    img_path: baseurl.imgPath,
    isTime: false,
    is_sc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      is_vip: app.userinfo.is_vip
    })
    this.postRequest(options.flag, 1)
    this.countDown()
  },
  // 这个是选项卡
  btnClick: function (e) {
    let flag = e.currentTarget.dataset.flag
    let seleted = this.data.seleted
    if (flag == seleted) return
    let list_data = this.data.list_data;
    list_data.data = [];
    this.setData({
      seleted: flag,
      list_data: list_data
    })
    this.postRequest(flag, 1)
  },
  postRequest: function (flag, page, hidden = false) {
    let topData = this.data.topData
    let url = baseurl.order_goods_list
    let that = this
    if (flag == 0 || flag == 1) url = baseurl.order_list
    request.getRequest(that, url + "?page=" + page + "&type=" + topData[flag].type, res => {
      if (res.status == 200) {
        if (page == 1) {
          that.setData({
            list_data: res.data,
            seleted: flag
          })
          wx.stopPullDownRefresh()
        } else {
          // 提醒
          request.tixing(res.data.data)
          let list_data = that.data.list_data
          res.data.data = list_data.data.concat(res.data.data)

          that.setData({
            list_data: res.data
          })
        }
      }
    }, c => {
      this.setData({
        hidden: 1
      })
    }, hidden)
  },
  orderDetail: function (e) {
    let id = e.currentTarget.dataset.id
    let state = e.currentTarget.dataset.state
    let pagenum = e.currentTarget.dataset.pagenum
    if (state == 1) id = e.currentTarget.dataset.recid
    let seleted = this.data.seleted
    let url = '../order_detail/order_detail?order_id=' + id + '&pagenum=' + pagenum;
    if (seleted > 1 || state == 1) {
      url = '../order_detail/order_detail?rec_id=' + id + '&pagenum=' + pagenum;
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 删除订单
   */
  deleteOrder_one(e) {
    wx.showModal({
      content: '是否确定删除订单？',
      cancelColor: '#2170c9',
      confirmColor: '#2170c9',
      success: res => {
        if (res.confirm) {
          let rec_id = e.currentTarget.dataset.item;
          request.postRequest(this, baseurl.order_hide, { rec_id: rec_id }, res => {
            if (res.status == 200) {
              this.postRequest(this.data.seleted, 1, true)
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  /**
  * 删除订单(全部)
  */
  deleteOrder_two(e) {
    wx.showModal({
      content: '是否确定删除订单？',
      cancelColor: '#2170c9',
      confirmColor: '#2170c9',
      success: res => {
        if (res.confirm) {
          let order_id = e.currentTarget.dataset.item;
          request.postRequest(this, baseurl.order_hide, { order_id: order_id }, res => {
            if (res.status == 200) {
              this.postRequest(this.data.seleted, 1, true)
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  /**
   * 底部按钮 （取消订单）
   */
  makesure(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let arr_cancel = that.data.arr_cancel;
    if (index == '1') {
      that.setData({
        cancleorder_flag: false
      })
    }
    if (index == '2') {
      let data = { order_id: that.data.orderid, reason: order.chools_one(that.data.arr_cancel,that) ? that.data.arr_cancel[that.data.index_ls].txt : undefined }
      this.cancelOrder(data);
    }
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
      arr_cancel: arr_cancel,
    })
  },
  changese_flag() {
    this.setData({
      cancleorder_flag: !this.data.cancleorder_flag
    })
  },
  orderClick: function (e) {
    let flag = e.currentTarget.dataset.flag
    let item = e.currentTarget.dataset.item
    let orderid = item.order_id
    let rec_id = item.rec_id
    if (!rec_id) rec_id = item.goodsInfo[0].rec_id
    let goods_id = item.goods_id
    if (!goods_id) goods_id = item.goodsInfo[0].goods_id
    let spc_image = item.spec_img
    if (!spc_image) spc_image = item.goodsInfo[0].spec_img
    if (flag == 1) {// 取消订单
      this.setData({
        cancleorder_flag: !this.data.cancleorder_flag,
        orderid: orderid,//订单id
      })
    }

    // if(flag == 1) this.cancelOrder(orderid) // 取消订单 
    else if (flag == 2) this.payOrder(item.order_sn) //立即付款
    else if (flag == 3) this.wuliu(rec_id)   //物流
    else if (flag == 4) this.shouhuo(rec_id)  //确认收货
    else if (flag == 5) this.payAgain(goods_id, item.item_id ? item.item_id : item.goodsInfo[0].item_id, item.goods_num ? item.goods_num : item.goodsInfo[0].goods_num)
    else if (flag == 6) this.pingjia(rec_id, spc_image)
  },
  cancelOrder: function (orderid) {
    let that = this
    order.cancelOrder(that, orderid, res => {
      util.showmodel(res.message)
      that.setData({
        cancleorder_flag:false,
      })
      if (res.status == 200) {
        that.postRequest(that.data.seleted, 1, true)
      }
    })
  },
  payOrder: function (order_sn) {
    let that = this
    order.pay(that, order_sn, a => {
      // if (a == 1) {
      wx.redirectTo({
        url: '../../other/buy_result/buy_result?order_sn=' + order_sn,
      })
      // }
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
          // that.postRequest(that.data.seleted, 1, true)
          wx.navigateTo({
            url: '../../person/shouhuosuccess/shouhuosuccess?item=' + rec_id,
          })
        }
      })
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
  countDown: function () {
    let that = this
    setTimeout(res => {
      if (that.data.isTime == true) return
      if (that.data.list_data) {
        let data = that.data.list_data.data
        if (data) {
          data.forEach(item => {
            if (item.deleted == 0 && item.pay_status == 0) {
              var timestamp = Date.parse(new Date());

              timestamp = timestamp / 1000;
              let time = item.pay_last_time - timestamp
              let hou = parseInt(time % (60 * 60 * 24) / 3600);
              let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
              let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
              if (time <= 0) {
                item.deleted = 1
                let order_id = { order_id: item.order_id}
                that.cancelOrder1(order_id)
                item.time = null
              } else {
                item.time = "" + that.timeFormat(hou) + ":" + that.timeFormat(min) + ":" + that.timeFormat(sec)
              }

            }
          })
          that.data.list_data.data = data
          that.setData({
            list_data: that.data.list_data
          })
        }
      }
      that.countDown()
    }, 1000)
  },
  timeFormat: function (param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  cancelOrder1: function (orderid) {

    let that = this
    order.cancelOrder(that, orderid, res => {
      if (res.status == 200) {
        that.postRequest(that.data.seleted, 1, true)
      }
    })
  },
  // copy:function(e){
  //   wx.setClipboardData({
  //     data: e.currentTarget.dataset.coptxt,
  //     success: function (res) {
  //       wx.showToast({
  //         title: '复制成功',
  //       })
  //     }
  //   })
  // },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isTime == true) {
      this.data.isTime = false
      this.countDown()
      this.postRequest(this.data.seleted, this.data.list_data.current_page * 1, true)
    }

  },
  // 收藏方法
  scClick: function (e) {
    let goods_id = e.currentTarget.dataset.item.goods_id
    collect.add_collect(this, goods_id, res => {
      setTimeout(a => {
        wx.showToast({
          icon: 'none',
          title: '商品收藏成功',
        })
      }, 100)
    })
  },
  shouchang: function (e) {
    let that = this
    if (that.data.is_sc == true) return
    that.data.is_sc = true
    let flag = e.currentTarget.dataset.flag
    let item = e.currentTarget.dataset.item
    let bindex = e.currentTarget.dataset.bindex
    let index = e.currentTarget.dataset.index
    if (item.is_collectd == 0) {
      //收藏
      collect.add_collect(that, item.goods_id, res => {
        that.changeCollectd(1, index, bindex, item, flag)
      })
    } else {
      //取消
      collect.collect_cancel(that, item.goods_id, res => {
        that.changeCollectd(0, index, bindex, item, flag)
      })
    }



  },
  changeCollectd: function (is_collectd, index, bindex, item, flag) {
    let that = this

    item.is_collectd = is_collectd
    let d = that.data.list_data.data
    if (flag == 0)
      d[bindex].goodsInfo[index] = item
    else d[bindex] = item
    d = collect.orderData(d, item.goods_id, is_collectd, flag)

    that.data.list_data.data = d
    that.setData({
      list_data: that.data.list_data
    })
    setTimeout(res => {
      that.data.is_sc = false
    }, 200)

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
    this.postRequest(this.data.seleted, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.postRequest(this.data.seleted, this.data.list_data.current_page * 1 + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})