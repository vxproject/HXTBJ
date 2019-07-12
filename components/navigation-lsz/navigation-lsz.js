// components/topTab/topTab.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    arrayList: {
      type: Array,
      value: [],
    },
    color: { 
      type: String,
      value: ''
    },
    border_color: { 
      type: String,
      value: ''
    },
    itemindex:{  
      type:Number,
      value:0
    },
    lineWidth: { 
      type: String,
      value: '60',
    },
    
  },

  /**
   * 组件的初始数据
   */
  data: {
   

  },
  lifetimes: {
    attached() {
      let length = this.data.arrayList.length || 0;
      let widthItem = length < 5 ? (100 / length).toFixed(2) : 35;
      this.setData({
        widthItem: widthItem
      })
    },
    ready(){  
      let index=0
      if (this.data.itemindex>0){ 
        this.data.itemindex >= this.data.arrayList.length - 1 ? index = this.data.arrayList.length - 1 : index = this.data.itemindex
      }else{ 
        index=0
      }
      this.setData({
        itemindex:index
      })
      this.setTabLine(this.data.itemindex);
    },

    detached() {
     
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _chooseOne(e) {
      let index = e.currentTarget.dataset.index; 
      this.setData({
        itemindex: index
      })
      this.setTabLine(index);
     
      this.triggerEvent('chooseOne', {
        index
      });
    },
    setTabLine(index){
      let translateX = 0;
      Promise.all([this.getTabsList(`#itemindex${index}`), this.getScrollView('.scroll-view')])
        .then(res => {
          let tab = res[0], 
            scroll = res[1]; 
          translateX = scroll.scrollLeft + tab.left;
          let lineBoxWidth = tab.width;
          if (this.data.lineWidth) {
            this.setData({
              translateX: translateX,
              lineBoxWidth: lineBoxWidth,
            })
          } else {
            this.setData({
              translateX: translateX,
              lineBoxWidth: lineBoxWidth,
              lineWidth: `${lineBoxWidth}px`,
            })
          };
        })
    },
    getScrollView(node) {
      return new Promise((resolve, reject) => {
        let query = wx.createSelectorQuery().in(this);
        query.select(node).fields({
          dataset: true,
          size: true,
          scrollOffset: true,
        }, res => {
          resolve(res)
        }).exec()
      })
    },
    getTabsList(node) {
      return new Promise((resolve, reject) => {
        let query = wx.createSelectorQuery().in(this);
        query.select(node).boundingClientRect(res => {
          resolve(res)
        }).exec()
      })
    }

  }
})