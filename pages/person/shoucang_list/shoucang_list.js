// pages/person/shoucang_list/shoucang_list.js
const app = getApp();
const collect = require('../../../utils/collect.js');
const request = require('../../../utils/request.js');
const baseURL = require('../../../utils/baseurl.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    show_flag: false, //管理状态
    allFlag: false, //全选状态
    // moregood: true, //更多  
    list: [],
    imgsrc: baseURL.imgPath,
    no_data: {
      src: '/images/image/person_order.png',
      title: '您暂无收藏商品'
    },
    indexarr: []  //存商品id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getlist(1)
  },
  /**
   * 获取收藏列表
   */
  getlist(num) {
    let that = this
    collect.collect_list(that,num, res => {
      if (res.data.current_page == 1) {
        wx.stopPullDownRefresh();
      }
      let oldlist = that.data.list;
      let list = res.data.data
      if (list.length) {
        list.forEach(item => {
          item.flag = false,
            item.scrollflag = false
        })
      }
      // else {
      //   that.data.moregood = false
      //   request.tixing([])
      // }

      that.setData({
        list: res.data.current_page == 1 ? list : oldlist.concat(list),
        hidden: true,
      })
      that.data.current_page = res.data.current_page;
      that.data.last_page = res.data.last_page;
    })
  },
  /**
   * 管理
   */
  selectOne() {
    let that = this;
    that.setData({
      show_flag: !that.data.show_flag
    })
    if (that.data.show_flag) {
      let list = that.data.list;
      list.forEach(item => {
        item.scrollflag = false
      })
      that.setData({
        list: list
      })
    }
  },
  /**
   * 选择
   */
  chooseOne(e) {
    let that = this,
      index = e.currentTarget.dataset.index,
      list = this.data.list
    list[index].flag = !list[index].flag

    that.setData({
      list: list,
      allFlag: collect.selectAll(list)
    })
  },
  /**
   * 全选
   */
  // chooseAll() {
  //   let that = this
  //   let list = this.data.list
  //   that.setData({
  //     allFlag: !that.data.allFlag
  //   })
  //   if (that.data.allFlag) {
  //     list.forEach(item => {
  //       item.flag = true
  //     })
  //   } else {
  //     list.forEach(item => {
  //       item.flag = false
  //     })
  //   }
  //   that.setData({
  //     list: list
  //   })
  // },
  /**
   * 侧滑删除
   */
  deleteOne(e) {
    let that = this,
      goodid = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index;
    collect.collect_cancel(that,goodid, res => {
      let list = that.data.list
      list.splice(index, 1)
      that.setData({
        list: list
      })
    })
  },

  /**
   * 批量删除
   */
  deleteAll() {
    let that = this;
    let list = this.data.list;
    let indexarr = this.data.indexarr;
    list.forEach((item, index) => {
      if (item.flag) {
        indexarr.push(item.goods_id);
      }
    })
    collect.selectids(list, res => {
      if(res){
        collect.collect_cancel(that,res, res => {
          indexarr.forEach(item => {
            list.forEach((it, index) => {
              if (it.goods_id == item) {
                list.splice(index, 1)
              }
            })
          })
          that.setData({
            show_flag: false,
            list: list,
            indexarr: []
          })
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '请选择要取消收藏的商品',
        })
      }
 
    })
  },
  /**
   * 查看详情
   */
  lookdetail(e) {
    let id = e.currentTarget.dataset.id,
      ind = e.currentTarget.dataset.ind;
    if (ind == 1) {
      wx.navigateTo({
        url: '../../other/goods_detail/goods_detail?goods_id=' + id,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '该商品已经下架',
      })
    }

  },
  /**
   * 滑动
   */
  bindtouchstart(e) {
    let that = this;
    if (!that.data.show_flag) {
      let ind = e.currentTarget.dataset.index,
        pageX = e.changedTouches[0].pageX;
      that.setData({
        pageX: pageX,
        ind: ind
      })
    }
  },
  bindtouchend(e) {
    let that = this,
      pageendX = e.changedTouches[0].pageX,
      pageX = this.data.pageX,
      ind = this.data.ind,
      list = this.data.list;
    list.forEach(item => {
      item.scrollflag = false
    })
    // if (pageendX - pageX > 60) {//向右滑
    // }
    if (pageX - pageendX > 60) {  //向左滑
      list[ind].scrollflag = true;
    }
    that.setData({
      list: list
    })
  },
  /**
   * 暂无数据
   */
  no_datatap() {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;

    that.getlist(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    // if (that.data.moregood ) {
    console.info('走这里 11111111')
    if (that.data.current_page + 1 <= that.data.last_page) {
      console.info('走这里 22222222')
      that.getlist(that.data.current_page + 1);
    } else {
      console.info('走这里 33333')
      request.tixing([])
    }
    // }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
   let title = e.target.dataset.title
    if (e.from == 'button') {
      let goodid = e.target.dataset.id
       
      return request.share(title, goodid)
    } else {
      return request.share('我的收藏','-2')
    }
  }
})