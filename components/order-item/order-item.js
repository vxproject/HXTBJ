// components/order-item/order-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: 1,
      value: '名字',
      observer: function (e) {
        console.log('-----')
      }
    },
    //该菜品的数量
    number: {
      type: Number,
      value: 0
    },
    //该菜品共计金额
    sum: {
      type: Number,
      value: 0
    },
    //该菜品在购物车列表中的位置，index为下标
    index: {
      type: Number,
      value: 0
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
    minusFromCart: function () {
      this.sumPrice(0)
      var eventDetail = {
        index: this.data.index,
        number: this.data.number
      }
      this.triggerEvent('minusEvent', eventDetail, {}) // 触发minusEvent事件
    },
    addToCart: function () {
      this.sumPrice(1)
      var eventDetail = {
        index: this.data.index,
        number: this.data.number
      }
      this.triggerEvent('addEvent', eventDetail, {}) // 触发addEvent事件
    },
    sumPrice:function (flag){
      if (flag == 1) this.properties.number ++
      else this.properties.number --
      if (this.properties.number <= 0) this.properties.number = 0
    }
  }
})