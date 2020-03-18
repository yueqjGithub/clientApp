// const host = 'https://8696123.iidingyun.com'

const urls = {
  uploadImg: '/api/common/upload/upload.vm',
  mobileLogin: '/api/c2/login/app/login_by_mobile.vm', // 手机登录
  wxLogin: '/api/c2/login/app/login_by_code.vm', // 微信授权登录
  bindMobile: '/api/c2/login/app/bind_mobile.vm', // 微信登录时无手机号绑定手机号
  queryQrcode: '/api/common/sms/send_login.vm', // 获取手机验证码
  // -----------已登录过的情况---------
  loginByToken: '/api/c2/login/login.vm', // token存在，验证登录
  freshToken: '/api/c2/login/refresh.vm', // token第一次验证失败，再次发起验证是否超过30天
  // -------首页------------
  // queryIndexList: '/api/c2/home/index.vm', // 首页第一次请求
  queryIndexList: '/api/c2/home/shop_index.vm', // 首页第一次请求
  // addIndexList: '/api/c2/home/screen.vm', // 后续请求首页列表
  addIndexList: '/api/c2/home/shop_screen.vm', // 后续请求首页列表
  // --------首页筛选------
  getTypeList: '/api/c2/shop/type.vm', // 获取筛选类型
  // ----------搜索------------
  doSearch: '/api/c2/home/search.vm', // 执行搜索
  getHotSearch: '/api/c2/home/search_hot_word.vm', // 获取搜索热词
  // --------门店详情---------
  queryShopDetail: '/api/c2/shop/view.vm', // 门店详情
  // -------产品--------------
  queryProductDetail: '/api/c2/product/view.vm', // 产品详情
  collection: '/api/c2/my/favorite/product.vm', // 收藏产品
  // ----------支付--------------
  queryWxPayInfo: '/api/common/pay2/order/app_pay.vm', // 拉取微信支付参数
  // -------------------订单-------------
  confirmOrder: '/api/c2/my/order/confirm.vm', // 确认订单
  changeShop: '/api/c2/shop/change.vm', // 切换使用门店
  useOrder: '/api/c2/my/order/use.vm', // 核销订单
  deleteOrder: '/api/c2/my/order/delete.vm', // 删除订单
  auditOrder: '/api/c2/my/dc/check_dc.vm', // 检查是否可进入订单确认页
  getOrderList: '/api/c2/my/order/list.vm', // 订单列表
  orderDetail: '/api/c2/my/order/view.vm', // 订单详情
  refund: '/api/common/pay2/order/refund.vm', // 退款
  // ------------------我的------------------
  queryDCRecorder: '/api/c2/my/dc/dc_list.vm', // 获取贝记录
  dailyCheck: '/api/c2/my/dc/daily_dc.vm', // 每日签到
  queryMyInfo: '/api/c2/my/index.vm', // 我的信息
  favoriteList: '/api/c/my/tag/list.vm', // 喜好标签列表
  saveFavorite: '/api/c/my/tag/update.vm', // 保存喜好
  myFavorite: '/api/c2/my/favorite/list.vm', // 收藏列表
  getChargeType: '/api/c2/my/member/open.vm', // 获取充值类型
  chargeMember: '/api/common/pay2/order/app_charge.vm', // app充值会员-RMB
  chargeByDc: '/api/c2/my/member/pay_charge.vm', // 用贝购买会员
  // ---------------------投诉反馈-----------------
  getFeedType: '/api/c2/my/feedback/type.vm', // 获取反馈类型
  subFeed: '/api/c2/my/feedback/create.vm', // 提交反馈
  // -------------------推荐----------------------
  getSugFirst: '/api/c2/product/recommend.vm', // 推荐首页
  sugPage: '/api/c2/product/screen.vm', // 推荐分页
  // -----------------------抽奖--------------------
  doPrize: '/api/c2/apps/lottery/draw.vm', // 点击抽奖
  getPrizeList: '/api/c2/apps/lottery/index.vm', // 抽奖加载
  prizeRecord: '/api/c2/apps/lottery/list.vm', // 抽奖纪录
  // ----------面对面分享-------------
  faceCode: '/api/c2/common/qrcode.vm', // 面对面分享二维码
  // ----------------瓜分------------------
  doShareDc: '/api/c2/apps/partition/part.vm', // 立即瓜分
  joinNext: '/api/c2/apps/partition/partake.vm', // 参与下一期
  joinParty: '/api/c2/apps/partition/partake.vm', // 立即参与
  partition: '/api/c2/apps/partition/index.vm', // 瓜分首页
  // ------------秒杀--------------
  limitIndex: '/api/c2/apps/seckill/index.vm' // 限时秒杀首页
}

export default urls
