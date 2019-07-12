// pages/home/miaosha/miaosha.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    s_top: 0,
    s_flag: false,
    list_data: [],
    is_loading: false,
    status: -1,
    scroll_left: 0,
    banner: null,
    img_path: baseurl.imgPath,
    hidden: 0,
    cid: 0,
    index: 0,
    is_clearTime: false,
    isRequest: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    for (let i = 0; i < 15; i++) {
      that.data.list_data.push([])
    }
    that.data.cid = options.cid
    that.initUI(options.cid)
    that.countDown()

  },
  onPageScroll: function (e) {
    let that = this

    if (e.scrollTop < that.data.s_top && that.data.s_flag == true) that.setData({
      s_flag: false
    })
    else if (e.scrollTop >= that.data.s_top && that.data.s_flag == false) that.setData({
      s_flag: true
    })
  },
  changeCount: function (e) {
    let that = this
    let status = e.detail.current
    that.setData({
      status: status,
      scroll_left: status > 2 ? (status - 2) * 150 : 0
    })
    if (that.data.list_data[status].length == 0) that.initUI(that.data.time_axis[status].cid, 1)
    else that.initUI(that.data.time_axis[status].cid, 1, true)
  },
  navClick: function (e) {
    let that = this
    if (that.data.reqFlag) {
      let status = e.currentTarget.dataset.index
      that.setData({
        status: status
      })
    }

  },
  initUI: function (cid = 1, page = 1, loading = false) {
    let that = this
    if (that.data.isRequest == true) return
    that.data.isRequest = true
    that.data.reqFlag = false
    request.getRequest(that, baseurl.flash_list + "?cid=" + cid + "&page=" + page, res => {
      let status = that.data.status
      let list_data = that.data.list_data
      let index = that.data.index
      let flag = false
      res.data.time_axis.forEach((item, index) => {
        if (item.cid == cid) {
          status = index
          // index: index
          flag = true
          list_data[index] = res.data.list
          that.setData({
            scroll_left: status > 2 ? (status - 2) * 150 : 0
          })
        }
      })
      //cid被删除
      if (flag == false) {
        if (res.data.time_axis[status]) {
          that.initUI(res.data.time_axis[status].cid, 1)
        } else {
          that.setData({
            status: 0
          })
          that.initUI(res.data.time_axis[0].cid, 1)
        }
        return;
      }
      if (page == 1) {
        that.setData({
          banner: res.data.img,
          time_axis: res.data.time_axis,
          list_data: list_data,
          status: status,
          hidden: 1
        })
        wx.stopPullDownRefresh()
      } else {
        res.data.list.data = list_data[status].data.cancat(res.data.list.data)
        that.setData({
          list_data: res.data.list,
        })
      }
      // 获取定位位置
      if (that.data.s_top == 0 && res.data.time_axis.length > 0) {
        setTimeout(() => {
          that.setData({
            is_loading: true
          })
          wx.createSelectorQuery().select('.fiexd').boundingClientRect(res => {
            that.setData({
              s_top: res.top
            })
          }).exec()
        }, 1000)
      }
      setTimeout(res => {
        that.setData({
          reqFlag: true
        })
      }, 500)

    }, a => {
      that.data.isRequest = false
    }, loading)
  },
  countDown: function (e) {
    let that = this
    let status = that.data.status
    let time_axis = that.data.time_axis
    if (time_axis)
      if (time_axis[status]) {
        if (time_axis[status].category_status == 0 || time_axis[status].category_status == 1) {
          let item = that.msTime(time_axis[status])
          time_axis[status] = item
          that.setData({
            time_axis: time_axis
          })
        }
      }
    if (that.data.is_clearTime == true) return
    setTimeout(() => {
      that.countDown()
    }, 1000)
  },
  timeFormat: function (param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  msTime: function (item) {
    let that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (item.category_status == 3) return
    if (item.time) {
      let se_time = item.time
      let time = 0
      if (item.category_status == 0) {
        time = se_time - timestamp
      } else {
        time = se_time - timestamp
      }
      //秒杀中
      let obj = {}
      if (time > 0) {
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          hou: that.timeFormat(day) > 0 ? that.timeFormat(day) * 24 + that.timeFormat(hou) * 1 : that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        }
        item.djs = obj
      } else {
        item.djs = {
          hou: '00',
          min: '00',
          sec: '00'
        }
        if (item.time == 0) {
          item.category_status = 1
        } else {
          item.category_status = 3
          that.stateUI()
        }
      }
    } else {
      item.category_status = 3
      that.stateUI()
    }
    return item
  },
  stateUI: function (e) {
    let that = this
    setTimeout(() => {
      if (that.data.time_axis)
        that.initUI(that.data.time_axis[that.data.status].cid, 1)
      else that.initUI(that.data.cid, 1)
    }, 1000)


  },

  goods_detail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../other/goods_detail/goods_detail?goods_id=' + id,
    })
  },
  share: function (e) {
    return
  },
  qgClick: function (e) {
    let status = e.currentTarget.dataset.status
    if (status == 1) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../../other/goods_detail/goods_detail?goods_id=' + id,
      })
    } else {

    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    that.data.is_clearTime = true
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    that.data.list_data = []
    for (let i = 0; i < 15; i++) {
      that.data.list_data.push([])
    }
    if (that.data.time_axis)
      that.initUI(that.data.time_axis[that.data.status].cid, 1)
    else that.initUI(that.data.cid, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    let that = this
    let status = that.data.status
    if (that.data.list_data[status].current_page >= that.data.list_data[status].last_page) {
      request.tixing([])
    } else {
      that.initUI(that.data.time_axis[status].cid, that.data.list_data[status].current_page + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == "button") {
      let title = e.target.dataset.title
      let id = e.target.dataset.id
      return request.share(title, id, 0);
    } else {
      return request.share('好享淘优选', '', 0);
    }
  }
})