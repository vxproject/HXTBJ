// components/detail_share/detail_share.js
let app = getApp()
const util = require('../../utils/util.js')
const baseurl = require('../../utils/baseurl.js')
const request = require('../../utils/request.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list_data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: 1,
    touxiang: app.userinfo.head_pic,
    name: app.userinfo.nickname,
    topData: [["专业精选美食会员制电商", "全球精选生鲜", "产地特色美食", "天天都有秒杀", "惊喜活动不断"], ["一个会员制电商创业平台", "无需开店成本", "优质素材分享", "专属培训服务", "收益闪电到账"]],
    seleted:0
  },
  lifetimes: {
    attached:function(e){
      let seleted = Math.floor(Math.random()*2)
      this.setData({
        seleted:seleted
      })
    },
    ready: function() {
      let that = this
      console.log(this.data.list_data)
      request.postRequest(null, baseurl.share_goods, {
        goods_id: this.data.list_data.id
      }, res => {
        that.setData({
          code: baseurl.imgPath + res.data.share_img
        })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    saveImage: function(e) {
      this.huizhi()
    },
    huizhi: function(e) {
      let that = this
      wx.showToast({
        title: '图片生成中....',
        icon: 'loading',
        duration: 100000
      })
      if (!that.data.list_data.touxiang) that.data.list_data.touxiang = 'http://thirdwx.qlogo.cn/mmopen/vi_32/ta0K1JCI1ichMKvLpkkbicoo5NCCYJ9eH2YrM8xqIXggict0A6qzLmtd9RJeapTp6FMLkSwjyEssZ8jFNlNgQAHLw/132'
      wx.downloadFile({
        url: that.data.list_data.touxiang,
        success: function(touxiang) {
          wx.downloadFile({
            url: that.data.list_data.img,
            success: function(img) {
              wx.downloadFile({
                url: that.data.code,
                success: function(code) {
                  var ctx = wx.createCanvasContext('firstCanvas', that)
                  // 背景色
                  const grd = ctx.createLinearGradient(0, 0, 260, 50)
                  grd.addColorStop(0, '#131313')
                  grd.addColorStop(1, '#414141')
                  ctx.setFillStyle(grd)
                  ctx.fillRect(0, 0, 260, 50)
                  // 文字标题

                  ctx.setFillStyle('#fff')
                  ctx.fillRect(0, 50, 260, 378)

                  that.drawText(ctx, [{
                    title: '好享淘',
                    x: 10,
                    y: 20,
                    color: "#ecc881",
                    size: 13
                  }, {
                      title: that.data.topData[that.data.seleted][0],
                    x: 60,
                    y: 20,
                    color: "#ecc881",
                    size: 12
                  }])
                  //4个小标题
                  that.drawText(ctx, [{
                    title: that.data.topData[that.data.seleted][1],
                    x: 20,
                    y: 40,
                    color: "#fff",
                    size: 8
                  }, {
                      title: that.data.topData[that.data.seleted][2],
                    x: 81,
                    y: 40,
                    color: "#fff",
                    size: 8
                  }, {
                      title: that.data.topData[that.data.seleted][3],
                    x: 143,
                    y: 40,
                    color: "#fff",
                    size: 8
                  }, {
                      title: that.data.topData[that.data.seleted][4],
                    x: 205,
                    y: 40,
                    color: "#fff",
                    size: 8
                  }])
                  for (let i = 0; i < 4; i++) {
                    ctx.drawImage('../../images/other/detail_share.png', i * 62 + 10, 33, 7, 8)
                  }

                  // 头像

                  ctx.save();
                  ctx.arc(45, 75, 15, 0, 2 * Math.PI);
                  ctx.stroke()
                  ctx.clip();
                  ctx.drawImage(touxiang.tempFilePath, 30, 60, 30, 30);
                  ctx.restore();

                  //头像右边的文字
                  that.drawText(ctx, [{
                    title: that.data.list_data.nickname,
                    x: 70,
                    y: 70,
                    color: "#999",
                    size: 9
                  }, {
                    title: "推荐给你一件好物",
                    x: 70,
                    y: 85,
                    color: "#333",
                    size: 11
                  }])
                  //商品图片
                  ctx.drawImage(img.tempFilePath, 31, 100, 198, 198)

                  //优惠券图片
                  ctx.drawImage('../../images/other/share_quan.png', 30, 355, 64, 15)

                  //价格文字
                  that.drawText(ctx, [{
                    title: '秒杀价',
                    x: 30,
                    y: 325,
                    color: "#e41e1e",
                    size: 20
                  }, {
                    title: "￥" + that.data.list_data.shop_price,
                    x: 90,
                    y: 327,
                    color: "#e41e1e",
                    size: 16
                  }, {
                    title: '券前价:￥' + that.data.list_data.market_price,
                    x: 30,
                    y: 345,
                    color: "#999",
                    size: 11
                  }, {
                    title: '优惠券',
                    x: 38,
                    y: 366,
                    color: "#fff",
                    size: 11
                  }, {
                    title: '长按识别二维码',
                    x: 160,
                    y: 393,
                    color: "#7d7d7d",
                    size: 10
                  }])


                  // 画横线
                  ctx.fillStyle = "#999";
                  ctx.setLineWidth(.5);
                  ctx.moveTo(30, 341)
                  ctx.lineTo(106, 341)
                  ctx.stroke()

                  // 商品名字 超出换两行
                  ctx.setFontSize(10)
                  ctx.fillStyle = "#666";

                  let names = that.data.list_data.name.split('')
                  let name = "";
                  let nameArr = []
                  for (var a = 0; a < names.length; a++) {
                    if (ctx.measureText(name).width < 90) {
                      name += names[a];
                    } else {
                      a--;
                      nameArr.push(name);
                      name = "";
                    }
                  }
                  nameArr.push(name);

                  if (nameArr.length > 2) {
                    var rowCut = nameArr.slice(0, 2);
                    var rowPart = nameArr[1];
                    var test = "";
                    var empty = [];
                    for (var a = 0; a < rowPart.length; a++) {
                      if (ctx.measureText(test).width < 80) {
                        test += rowPart[a];
                      } else {
                        break;
                      }
                    }
                    empty.push(test);
                    var group = empty[0] + "..."
                    rowCut.splice(1, 1, group);
                    nameArr = rowCut;
                  }
                  for (var b = 0; b < nameArr.length; b++) {
                    ctx.fillText(nameArr[b], 30, 390 + b * 17, 100);
                  }
                  //绘制小程序二维码
                  ctx.drawImage(code.tempFilePath, 160, 305, 70, 70)


                  ctx.draw(true, function(res) {
                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      width: 260,
                      height: 428,
                      destWidth: 1300,
                      destHeight: 2140,
                      fileType: "jpg",
                      quality: 1,
                      canvasId: 'firstCanvas',
                      success(res) {
                  
                        wx.authorize({
                          scope: 'scope.writePhotosAlbum',
                          success: function() {

                            wx.saveImageToPhotosAlbum({
                              filePath: res.tempFilePath,
                              success(res) {
                                wx.hideToast()

                                // that.lingqu()
                              },
                              fail: function(e) {

                              }
                            })
                          },
                          fail: function(e) {
                            console.log(e)
                            wx.hideToast()
                            util.showmodel('请设置可以存储图片')
                          },
                          complete: function(e) {
                          
                          }
                        })

                      },
                      fail: function(e) {
                        wx.hideToast()
                        util.showmodel('系统错误，请稍后再试')
                      }
                    }, that)
                  })



                  // ******************

                }
              })
            }
          })
        }
      })






    },
    drawText: function(ctx, textArr) {


      textArr.forEach((item, index) => {
        ctx.setFontSize(item.size)
        ctx.fillStyle = item.color;
        ctx.fillText(item.title, item.x, item.y)
        // ctx.draw()
      })


    }

  }
})