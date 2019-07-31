//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    arr: [{ title: '标题', txt: '不舍得花' }, { title: '标题', txt: '不舍得花' }, { title: '标题', txt: '不舍得花' }]
  },

  onLoad: function () {
    this.show = this.selectComponent('#pick-ls');
  },
  catchtap(){
    this.show.show_hid();
  }
 
})
