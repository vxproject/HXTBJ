// components/collectionCell/collectionCell.js
const baseurl = require("../../utils/baseurl.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    imgsrc: {
      type: String,
      value: baseurl.imgPath
    },
    show_flag: {
      type: Boolean,
      value: false
    },
    index: {
      type: Number,
      value: 0
    }
  },
  lifetimes: {
    attached: function() {
      this.setData({
        shop_price: this.data.item.goodsInfo.shop_price.split('.')
      })
    }

  },


  /**
   * 组件的初始数据
   */
  data: {
    shop_price: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {



    lookdetail: function(e) {
      console.log('------------')
      let id = e.currentTarget.dataset.id,
        ind = e.currentTarget.dataset.ind;
      console.log(id)
      if (ind == 1) {
        wx.navigateTo({
          url: '/pages/other/goods_detail/goods_detail?goods_id=' + id,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '该商品已经下架',
        })
      }


    },
    button:function(e){
      return;
    },
    chooseOne: function(e) {
      let index = this.data.index
      this.triggerEvent('chooseOne', {
        index: index
      }, {})
    },
    deleteOne: function(e) {
      let that = this
      let goodid = e.currentTarget.dataset.id,
        index = e.currentTarget.dataset.index;
        console.log('---------')
      wx.showModal({
        title: '温馨提示',
        content: '确定要删除收藏商品吗？',
        confirmText: "再想想",
        confirmColor: "#FF5000",
        cancelText: "确定",
        success: res => {
          if(res.cancel)
          that.triggerEvent('deleteOne', {
            goodid: goodid,
            index: index
          }, {})
        }
      })
    
    }
  }
})