
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: 'login', alias: ['/'], name: 'login', component: () => import('pages/Login.vue') }
    ]
  },
  { // --有footer页
    path: '/app',
    component: () => import('layouts/FooterLayout.vue'),
    children: [
      { path: 'index', name: 'Index', component: () => import('pages/index/index.vue') }, // 首页
      { path: 'order', name: 'Order', component: () => import('pages/order/order.vue') }, // 订单
      { path: 'mine', name: 'Mine', component: () => import('pages/mine/mine.vue') }, // 我的
      { path: 'suggestion', name: 'Suggestion', component: () => import('pages/suggestion/suggestion.vue') } // 推荐
    ]
  },
  { // --无footer页
    path: '/use',
    component: () => import('layouts/cusLayout.vue'),
    children: [
      { path: 'search', name: 'Search', component: () => import('pages/index/search.vue') }, // 搜索
      { path: 'shop', name: 'Shop', component: () => import('pages/shop/shop.vue') }, // 门店详情
      { path: 'product', name: 'Product', component: () => import('pages/product/product.vue') }, // 产品详情
      { path: 'orderset', name: 'OrderSet', component: () => import('pages/order/orderSet.vue') }, // 订单确认页
      { path: 'orderdetail', name: 'OrderDetail', component: () => import('pages/order/orderDetail.vue') }, // 订单详情页
      { path: 'hobby', name: 'Hobby', component: () => import('pages/mine/hobby.vue') }, // 个人喜好
      { path: 'bill', name: 'Bill', component: () => import('pages/mine/bill/bill.vue') }, // 贝记录
      { path: 'favorite', name: 'Favorite', component: () => import('pages/mine/favorite/favorite.vue') }, // 收藏
      { path: 'member', name: 'Member', component: () => import('pages/mine/member/member') },
      { path: 'feedback', name: 'Feedback', component: () => import('pages/mine/feedback/feedBack.vue') }, // 反馈
      { path: 'payfail', name: 'Payfail', component: () => import('pages/order/payFaild.vue') }, // 支付失败
      { path: 'confirmorder', name: 'ConfirmOrder', component: () => import('pages/order/confirmOrder.vue') }, // 订单确认
      { path: 'switchShop', name: 'SwitchShop', component: () => import('pages/order/changeShops.vue') },
      { path: 'usesuccess', name: 'UseSuccess', component: () => import('pages/order/useSuc.vue') }, // 核销成功
      { path: 'refund', name: 'Refund', component: () => import('pages/order/refund.vue') }, // 申请退款
      { path: 'refundprogress', name: 'RefundProgress', component: () => import('pages/order/refundProgress.vue') }, // 退款进度
      { path: 'prize', name: 'Prize', component: () => import('pages/prize/prize.vue') }, // 抽奖
      { path: 'lottery', name: 'Lottery', component: () => import('pages/prize/prizeRecord.vue') }, // 抽奖纪录
      { path: 'carve', name: 'Carve', component: () => import('pages/Carve/carve.vue') }, // 瓜分千万贝
      { path: 'share', name: 'Share', component: () => import('pages/share/share.vue') },
      { path: 'faceshare', name: 'FaceShare', component: () => import('pages/share/faceShare.vue') }, // 面对面邀请
      { path: 'limitbuy', name: 'LimitBuy', component: () => import('pages/limitBuy/limitBuy.vue') } // 限时秒杀
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
