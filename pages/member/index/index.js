// pages/member/index/index.js
const request = require('../../../utils/request.js')
const baseurl = require('../../../utils/baseurl.js')
const utils = require('../../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

    source: {
      img_path: baseurl.imgPath,
      img_list: {
        banner: "../../../images/image/no_momber_banner.png",
        toubiao: "../../../images/image/no_momber_toubiao.png",
        tequan_xianjin: "../../../images/image/no_momber_tequan_xianjin.png",
        tequan_quan: "../../../images/image/no_momber_tequan_quan.png",
        tequan_fanli: "../../../images/image/no_momber_tequan_fanli.png",
        tequan_peixun: "../../../images/image/no_momber_tequan_peixun.png",
        float_btn: "../../../images/image/no_momber_float_btn.png"
      },
      member_tqlist: [{
        img: "../../../images/image/no_momber_tequan_quan.png",
        title: "最高40%的商品优惠",
        info: "自买商品最高获取40%优惠"
      },
      {
        img: "../../../images/image/no_momber_tequan_xianjin.png",
        title: "最高40%的商品返利",
        info: "自买商品最高获取40%返利"
      },
      {
        img: "../../../images/image/no_momber_tequan_peixun.png",
        title: "商学院培训指导",
        info: "定制化课程，定期大咖分享"
      }
      ],
      img_list2: {
        user_vip_logo: "../../../images/image/yes_momber_vip_logo.png",
        header_banner: "../../../images/image/yes_momber_banner.png",
        header_home_logo: "../../../images/image/yes_momber_home_logo.png",
        header_lingpai_logo: "../../../images/image/yes_momber_lingpai.png",
        tab_img_left: "../../../images/image/yes_momber_tab_jiangli.png",
        tab_img_right: "../../../images/image/yes_momber_tab_fanli.png",
        back_img: "../../../images/image/person_dizhi_back.png",
        guize_img: "cloud://hxt-cdff72.6878-hxt-cdff72/member/yes_momber_xueyuan1.png",
        baodian_img: "cloud://hxt-cdff72.6878-hxt-cdff72/member/yes_momber_xueyuan2.png",
        jiangtang_img: "cloud://hxt-cdff72.6878-hxt-cdff72/member/yes_momber_xueyuan3.png",
        caifang_img: "cloud://hxt-cdff72.6878-hxt-cdff72/member/yes_momber_xueyuan4.png",
        xiaoxiaojiantou: '../../../images/image/xiaoxiaojiantou.png'
      },
      product_info_list: [{
        img: "../../../images/image/no_momber_panzi.png",
        title: "全球精选美食",
        info: "全球精选生鲜美食库"
      },
      {
        img: "../../../images/image/no_momber_lou.png",
        title: "资深买手选货",
        info: "十年以上资深买手为你搜罗全球好货"
      },
      {
        img: "../../../images/image/no_momber_feiji.png",
        title: "原产地直发",
        info: "优质原产地直发长期与国内外顶尖品牌战略合作"
      },
      {
        img: "../../../images/image/no_momber_diqiu.png",
        title: "全网独家货源",
        info: "全网独家热销美食"
      }
      ],
      userinfo: '',
      vipGoods: []
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 非会员的数据
  vipGoods: function () {
    let that = this
    request.getRequest(that, baseurl.member_goods, res => {
      if (res.status == 200) {
        let source = that.data.source
        source.vipGoods = res.data
        that.setData({
          source: source,
          hidden: 1
        })
      }
      console.log(res)
    })
  },
  // 开通会员
  ktmember: function () {
    wx.pageScrollTo({
      scrollTop: 560
    })
  },
  buyGoods: function (e) {
    console.log()
    let goods_id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '../buy_member/buy_member?goods_id=' + goods_id,
    })
  },
  // 会员数据
  memberData: function () {
    let that = this
    request.getRequest(that, baseurl.member_info, res => {
      let source = that.data.source
      source.list_data = res.data
      that.setData({
        source: source,
        hidden: 1
      })
    })
  },
  copyText: function () {
    console.log('12222')
    wx.setClipboardData({
      data: this.data.source.userinfo.invite_code,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 跳转网页
  gowebview: function (e) {
    let flag = e.currentTarget.dataset.flag
    let urls = [{
      url: baseurl.ruleh5,
      title: '规则中心'
    },
    {
      url: baseurl.noviceh5,
      title: '新手宝典'
    },
    {
      url: baseurl.dakah5,
      title: "大咖讲堂"
    },
    {
      url: baseurl.starh5,
      title: '明星采访'
    },
    {
      url: baseurl.wx_memberh5,
      title: '我的会员'
    },
    {
      url: baseurl.wx_fansh5,
      title: "我的粉丝"
    },
    {
      url: baseurl.revenueh5,
      title: '订单管理'
    },
    {
      url: baseurl.user_rebuteh5 + "&url1=../../member/tixian/tixian",
      title: '提现'
    }
    ]
    let url = urls[flag].url
    let title = urls[flag].title
    if(flag == 6 ){
      let type = e.currentTarget.dataset.type
      if(type != "0"){
        this.navWebview(url,title,type)
        return
      }else{
        this.navWebview(url, title)
      }
    }else{
      this.navWebview(url, title)
    }
    

    
  },
  fensiClick: function (e) {
    this.navWebview(baseurl.wx_fansh5, '我的粉丝')
  },
  navWebview: function (url, title,type=0) {

    wx.navigateTo({
      url: '../../other/webview/webview?type='+type+'&url='+url + "&title=" + title,
    })
  },
  // 店铺分享
  personStore: function (e) {
    wx.navigateTo({
      url: '../person_store/person_store',
    })
  },
  no_datatap() {
    let that = this
    let source = this.data.source
    if (wx.getStorageSync('token')) {
      request.getUserinfo(that, res => {
        that.setData({
          failflag: false
        })
        if (source.userinfo) {
          if (res.is_vip != source.userinfo.is_vip) {
            source.userinfo = res
            that.setData({
              source: source
            })
          }
        } else {
          source.userinfo = app.userinfo
          that.setData({
            source: source
          })
        }
        if (app.userinfo.is_vip == 0) that.vipGoods()
        else that.memberData()
      })
    } else {
      utils.showmodel('系统错误，请稍后再试')
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let source = this.data.source
    if (wx.getStorageSync('token')) {
      request.getUserinfo(that, res => {
        that.setData({
          failflag: false
        })
        if (source.userinfo) {
          if (res.is_vip != source.userinfo.is_vip) {
            source.userinfo = res
            that.setData({
              source: source
            })
          }
        } else {
          source.userinfo = app.userinfo
          that.setData({
            source: source
          })
        }
        if (app.userinfo.is_vip == 0) that.vipGoods()
        else that.memberData()
      })
    } else {
      utils.showmodel('系统错误，请稍后再试')
    }
    wx.setTabBarStyle({
      selectedColor:'#cfa664',
    })
  },
  // 会员邀请奖励
  share: function (e) {
    wx.navigateTo({
      url: '../person_store/person_store?flag=1',
    })
  },
  // 分享礼包
  shareLiBao: function (e) {
    wx.navigateTo({
      url: '../../home/member_list/member_list',
    })
  },
  // 非会员商品详情
  detailClick: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../other/desc_detail/desc_detail?vipGoods=' + JSON.stringify(this.data.source.vipGoods) + "&index=" + e.currentTarget.dataset.index,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setTabBarStyle({
      selectedColor: '#FF5000',
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return request.share()
  }
})