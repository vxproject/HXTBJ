// components/cart-item/cart-item.js
const cart = require("../../utils/cart.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods_name: {
      type: String,
      value: ''
    },
    spec_key_name: {
      type: String,
      value: ''
    },
    market_price: {
      type: String,
      value: ''
    },
    num: {
      type: String,
      value: ''
    },
    img_path: {
      type: String,
      value: ''
    },
    check_flag: {
      type: Number,
      value: false
    },
    chajia: {
      type: String,
      value: "0"
    },
    index: {
      type: Number,
      value: 0
    },
    list_id: {
      type: Number,
      value: 0
    },
    time:{
      type:Object,
      value:{}
    },
    ms_state:{
      type:Number,
      value:-1
    },
    type:{
      type:String,
      value:'0'
    },
    is_vip: {
      type: String,
      value: '0'
    },
    store_count:{
      type:Number,
      value:0
    },
    member_first:{   
      type:Number ,
      value: 0,
    },
    flashSale:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startX: 0, //开始坐标
    startY: 0,
    isdh: false,
    touchMoveX: 0,
    touchMoveY: 0,
    isRequest:false,
    miaoshaflag:false, //秒杀时间状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchstart: function(e) {
      var that = this
      if (e.changedTouches[0] && e.changedTouches[0]) {
      this.data.startX = e.changedTouches[0].clientX
      this.data.startY = e.changedTouches[0].clientY
      }
      // items: this.data.items

    },
    touchmove: function(e) {
      var that = this
      if (e.changedTouches[0] && e.changedTouches[0]){
        that.data.touchMoveX = e.changedTouches[0].clientX //滑动变化坐标
        that.data.touchMoveY = e.changedTouches[0].clientY //滑动变化坐标
      }
      //获取滑动角度
    },
    touchend: function(e) {
      let that = this
      var index = e.currentTarget.dataset.index //当前索引
      let startX = that.data.startX //开始X坐标
      let startY = that.data.startY //开始Y坐标
      let touchMoveX = this.data.touchMoveX
      let touchMoveY = this.data.touchMoveY
      let angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
      if (Math.abs(angle) > 60) return;
      if (touchMoveX == 0) return;
      if ((startX - touchMoveX) > 60) //右滑
        this.change(true)
      else if ((touchMoveX - startX) > 60) //左滑
        this.change(false)
    },
    change: function(state) {
      console.log('-------------')
      this.setData({
        isdh: state
      })
      this.data.startX = 0
      this.data.startY = 0
      this.data.touchMoveX = 0
      this.data.touchMoveY = 0
    },
    changeState:function(e){
      // if(this.data.type == 1) return     
      let index = e.currentTarget.dataset.index
      this.triggerEvent('changeState', { index: index, type: this.data.type}, {})
    },
    changeNum:function(e){
      let isrequest = this.data.isRequest
      if(isrequest == true) return
      this.data.isRequest = true
      let flag = e.currentTarget.dataset.flag
      let num = this.data.num
      if (flag == "0" && num == 1) return
      let that = this
      let xnum = flag == "0" ? num * 1 - 1 : num * 1 +1
 
        cart.changeNum(that,this.data.list_id, xnum,res=>{
        this.triggerEvent('changeNum', { index: that.data.index, num: xnum, type: this.data.type}, {})
      })
      
    },
   
    delete:function(e){
      let that = this
      let id = this.data.list_id
      // wx.showModal({
      //   title: '温馨提示',
      //   content: '忍心删除吗?',
      //   cancelColor: '#FF5000', 
      //   confirmColor:'#595959',
      //   success(res) {
      //     if (res.confirm) {
            cart.deletate(id, res => {
              console.log(res)
              that.setData({
                isdh:-1
              })
              that.triggerEvent('delete', { index: that.data.index, type: that.data.type }, {})
            })
      //     } else if (res.cancel) {
      //       // that.triggerEvent('delete', { flag: 0 }, {})
            
      //       that.change(false)
      //     }
      //   }
      // })

    },
    detailClick:function(){
      if (this.data.type == 1 && this.data.store_count == 0){
        wx.showToast({
          icon: 'none',
          title: '该商品已售罄',
        })
        return
      } else if (this.data.type == 1 ){
        wx.showToast({
          icon: 'none',
          title: '该商品已经下架',
        })
        return
      }
      this.triggerEvent('detailClick', { index: this.data.index,type:this.data.type }, {})
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function(start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y
      //返回角度 /Math.atan()返回数字的反正切值
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
  }
})