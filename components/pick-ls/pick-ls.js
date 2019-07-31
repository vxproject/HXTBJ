// components/pick-lsz/pick-lsz.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     array:{
       type:Array,
       valueL:[],
     },


  },
  lifetimes: {
    attached() {
      if (this.data.array instanceof Array) {
      } else {
        console.info('传入的数据不是数组')
        this.setData({
          array: []
        })
      }
    },
    ready() {
      this.data.array.forEach(item=>{
        item.flag=false;
      })
      this.setData({
        array: this.data.array
      })
    },
    detached() {
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
      show_hid(){
        this.setData({
          flag:!this.data.flag
        })
      },

  }
})
