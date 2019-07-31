// components/tuikuanCell/tuikuanCell.js
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list_data: {
      type: Object,
      value: {}
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    makesure: function (e) {
      let index = e.currentTarget.dataset.index
      if (this.data.list_data.flag == 1 && this.data.list_data.seleted1 == -1 && index == 2){
        util.showmodel('请选择退款原因')
        return
      } 
      else if (this.data.list_data.flag == 2 && this.data.list_data.seleted2 == -1 && index == 2){
        util.showmodel('请选择商品损坏数量')
        return
      }
    // this.data.list_data.seleted2 = index
      this.data.list_data.cancleorder_flag = !this.data.list_data.cancleorder_flag
      this.setData({
        list_data: this.data.list_data
      })
      
      let params = { flag: this.data.list_data.flag, seleted: -1 }
      if (index == 2) {
        if (this.data.list_data.flag == 1) params.seleted = this.data.list_data.seleted1
        else params.seleted = this.data.list_data.seleted2
      }
      this.triggerEvent('makesure', params, {})
    },
    chooseOne_yy: function (e) {

      let index = e.currentTarget.dataset.index
      if (this.data.list_data.flag == 1) this.data.list_data.seleted1 = index
      else this.data.list_data.seleted2 = index
      this.setData({
        list_data: this.data.list_data
      })

    },
    

  }
})
