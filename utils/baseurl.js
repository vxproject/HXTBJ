// let baseURL = "http://hxt.9das3.cn"   https://hxt.9das3.cn
let imgPath = "https://cdn.hxtapp.com"
let baseURL = "https://www.hxtapp.com"
baseURL = "https://test.hxtapp.com"
let version = "/v1"
// 个人信息
let login = baseURL + version + "/wx_login"   //微信登录授权
let wx_info = baseURL + version + "/wx_info"   //获取微信个人信息
let user_info = baseURL + version + "/user_info"  //个人信息详情
let message = baseURL + version + "/message"   //消息列表


let bind_mobile = baseURL + version + "/bind_mobile"  //手机号绑定
let coupon = baseURL + version + "/coupon"   //平台优惠券
let address_delete = baseURL + version + "/address_delete"  //删除地址
let do_address = baseURL + version + "/do_address"   //修改添加地址
let address_list = baseURL + version + "/address_list"  //收货地址列表

let order_coupon = baseURL + version + "/order_coupon"   //可用的平台优惠券

//购物车
let select_cart = baseURL + version + "/select_cart"   //默认页面
let deal_cart = baseURL + version + "/deal_cart"  //去结算
let change_num = baseURL + version + "/change_num_v2"   //修改购物车商品数量
let cart_delete = baseURL + version + "/cart_delete"  //删除购物车
let add_cart = baseURL + version + "/add_cart"   //添加购物车
let cart = baseURL + version + "/cart"  //购物车列表
let cart_number = baseURL + version + "/cart_number"


// 订单管理
let pay_order_status = baseURL + version + "/pay_order_status"   //订单支付结果查询
let order_return_pay = baseURL + version + "/order_return_pay"  //申请退款
let cart_order = baseURL + version + "/cart_order"   //购车下单
let add_comment = baseURL + version + "/add_comment"  //订单评论
let goods_confirm = baseURL + version + "/goods_confirm"   //确认收货
let order_detail = baseURL + version + "/order_detail"  //订单详情
let order_type_number = baseURL + version + "/order_type_number"   //订单待收货等数量
let wx_pay = baseURL + version + "/wx_small_pay"
// let wx_pay = baseURL + version + "/wx_pay wx_small_pay"  //微信支付预订单
let add_order = baseURL + version + "/add_order"   //直接购买下单
let order_cancel = baseURL + version + "/order_cancel"  //订单取消
let order_goods_list = baseURL + version + "/order_goods_list"   //待发货|待收货|待评价|退款货物
let order_hide = baseURL + version + "/order_hide" //删除订单
let order_return_submit = baseURL + version + "/order_return_submit"  //退款申请提交
let order_list = baseURL + version + "/order_list_v2"  //订单返回各种类型
let order_remind = baseURL + version + "/order_remind"  //发货提醒

//会员管理
let revenue = baseURL + version + "/revenue"  //我的预收入
let fans_detail = baseURL + version + "/fans_detail"  //粉丝详情
let wx_fans = baseURL + version + "/wx_fans"  //用户粉丝
let member_info = baseURL + version + "/member_info"  //会员信息界面
let details = baseURL + version + "/details"  //会员详情
let member_goods = baseURL + version + "/member/goods"  //会员商品列表
let user_rebute = baseURL + version + "/user_rebute"  //收入提现记录
let mobile_code = baseURL + version + "/mobile_code"  //手机号验证码返回
let add_bank = baseURL + version + "/add_bank"  //提现信息注册
let bank_status = baseURL + version + "/bank_status"  //查看银行卡是否绑定
let save_store = baseURL + version + "/save_store"  //店铺修改
let user_store = baseURL + version + "/user_store"  //店铺显示
let cash = baseURL + version + "/cash"  //提现申请
let pay_package = baseURL + version + "/pay_package"  //创业去支付
let member_package = baseURL + version + "/member_package"  //购买创业礼包

//公共信息
let upload_image = baseURL + version + "/upload_image"  //图片上传
let feedback = baseURL + version + "/feedback"  //平台留言
let bank = baseURL + version + "/bank"  //获取银行列表
let address = baseURL + version + "/address"  //获取省市区县乡

//商品管理
let comment = baseURL + version + "/comment"  //评论列表
let index = baseURL + version + "/index"  //登录首页
let appview = baseURL + version + "/appview" //APP启动次数统计
let flash_xu = baseURL + version + "/flash"  //首页秒杀（xu）
let goods_info = baseURL + version + "/goods_info"  //商品详情
let flash_sale = baseURL + version + "/flash_sale"  //秒杀活动
let category = baseURL + version + "/category"  //首页商品分类整页
let goods_search = baseURL + version + "/goods/search"  //商品搜索
let good_list = baseURL + version + "/goods/good_list"  //商品列表
let goods_child = baseURL + version + "/goods/child"  //子商品分类
let goods = baseURL + version + "/goods"  //商品分类

// 商品分享
let store_share = baseURL + version + "/store_share"

// 上传图片/v1/wx_upload 
let wx_upload = baseURL + version + "/wx_upload"

//h5页面
//1、我的预收入
let revenueh5 = baseURL + version + "/revenue"
//收入提现
let user_rebuteh5 = baseURL + version + "/user_rebute"
//隐私保护
let yinsih5 = baseURL + version + "/syinsi"
//个人隐私
let self_yinsih5 = baseURL + version + "/yinsi"
//帮助
let helph5 = baseURL + version + "/help"
//新手宝典
let noviceh5 = baseURL + version + "/novice"
//大咖讲堂
let dakah5 = baseURL + version + "/daka"
//1、明星采访
let starh5 = baseURL + version + "/star"
//会员权益
let equityh5 = baseURL + version + "/equity"

//我的粉丝
let wx_fansh5 = baseURL + version + "/wx_fans"
//我的会员
let wx_memberh5 = baseURL + version + "/wx_member"
//法律免责
let mianzeh5 = baseURL + version + "/mianze"

// //我的粉丝
// let wx_fansh5 = baseURL + version + "/wx_fans"
// //我的会员
// let wx_memberh5 = baseURL + version + "/wx_member"
// //法律免责
// let mianzeh5 = baseURL + version + "/mianze"

//商家入住
let businessh5 = baseURL + version + "/business"
//物流查询
let wuliuh5 = baseURL + version + "/wuliu"
//规则中心
let ruleh5 = baseURL + version + "/rule"

//公告列表
let notice_listh5 = baseURL + version + "/notice_list"
//帮助中心
let wentih5 = baseURL + version + "/wenti"
//普通粉丝
let fansh5 = baseURL + version + "/fans"
//推荐下载
let shareh5 = baseURL + version + "/share"
//售后说明
let shouhouh5 = baseURL + version + "/shouhou"
//店铺说明
let dianpuh5 = baseURL + version + "/dianpu"
// let yinsih5 = baseURL + version +"/syinsi"

//帮助中心wenti

let share_info = baseURL + version + "/share_info"

//微信获取分享列表
let share_goods_list = baseURL + version + "/share_goods_list"
let share_goods = baseURL + version + "/share_goods"

// 预售功能
let pre_goods = baseURL + version + "/pre_goods"
let add_pre = baseURL + version + "/add_pre" //添加预售商品
let pre_order = baseURL + version + "/pre_order" //首款支付信息
let pay_start = baseURL + version + "/pay_start" //首款支付

let advance_detail = baseURL + version + "/pre_detail" //预约商品详情


let add_coupon = baseURL + version + "/add_coupon" //添加优惠券
let order_goods_cancel = baseURL + version + "/order_goods_cancel"//未发货申请退款
//弹窗
let push_image = baseURL + version + "/push_image" //弹窗
//比价
let parity = baseURL + version + "/parity"

//收藏
let collect = baseURL + version + "/collect"  //商品收藏
let collect_cancel = baseURL + version + "/collect_cancel" //取消收藏
let share_collect = baseURL + version + "/share_collect" //收藏分享

//账号管理 
let change_mobile = baseURL + version + "/change_mobile"  //验证原手机号
let reset_mobile = baseURL + version + "/reset_mobile"  //新手机号添加


// 砍价
//砍价商品列表
let chop_price = baseURL + version + "/chop_price"
//我的砍价商品
let chop_goods = baseURL + version + "/chop_goods"
//添加砍价商品分享
let add_goods = baseURL + version + "/add_goods"
//用户砍价
let chop_user = baseURL + version + "/chop_user"
//我的砍价详情
let chop_detail = baseURL + version + "/chop_detail"
//获取砍价信息
let chop_share = baseURL + version + "/chop_share"
//删除我的砍价
let chop_delete = baseURL + version + "/chop_delete"


//618
let six_share = baseURL + version +"/six_share"

let add_free_coupon = baseURL + version + "/add_free_coupon"

let flash_list = baseURL + version + "/flash_list"

let collect_filter = baseURL + version + "/collect_filter"

module.exports = {
  baseURL: baseURL,
  imgPath: imgPath,
  // 个人信息
  login, wx_info, user_info, message, bind_mobile, coupon, address_delete, do_address, address_list, order_coupon,
  //购物车
  select_cart, deal_cart, change_num, cart_delete, add_cart, cart, cart_number,
  // 订单管理
  pay_order_status, order_return_pay, cart_order, add_comment, goods_confirm, order_detail, order_type_number, wx_pay, add_order, order_cancel, order_goods_list, order_return_submit, order_list, order_hide, order_remind, order_goods_cancel,
  //会员管理
  revenue, fans_detail, wx_fans, member_info, details, member_goods, user_rebute,
  mobile_code, add_bank, bank_status, save_store, user_store, cash, pay_package, member_package,
  //公共信息
  upload_image, feedback, bank, address,
  //商品管理 
  comment, index, appview, flash_xu, goods_info, flash_sale, category, goods_search, good_list, goods_child, goods,
  //h5界面
  revenueh5, user_rebuteh5, yinsih5, self_yinsih5, helph5, noviceh5, dakah5, starh5, equityh5, wx_fansh5, wx_memberh5, mianzeh5, businessh5, wuliuh5, ruleh5, notice_listh5, wentih5, fansh5, shareh5, shouhouh5, dianpuh5,
  wx_upload, store_share, share_info, pre_goods, add_pre, pre_order, pay_start, advance_detail,
  //微信获取收藏列表
  share_goods_list, add_coupon,
  //弹窗提示
  push_image, parity, collect, collect_cancel, share_collect, order_goods_cancel,
  //账号管理
  change_mobile, reset_mobile,
  //砍价
  chop_price, chop_goods, add_goods, chop_user, chop_detail, chop_share, chop_delete, six_share, add_free_coupon, flash_list, collect_filter, share_goods
}