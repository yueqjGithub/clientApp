export default function () {
  return {
    name: '',
    params: {},
    useShop: {}, // 使用门店
    companyid: '', // 确认订单时的商户id，用作切换门店
    mineInfo: {}, // 我的页面用户信息
    orderInfo: {}, // 存储订单id
    // ---see系列存储包括门店，菜品信息，用于解决之前页面跳转造成的返回错乱BUG
    seeProduct: {}, // 当前正在/刚刚 查看过的产品
    seeShop: {}, // 当前正在/刚刚 查看过的门店
    seeOrder: {}, // 当前正在确认的订单
    shareDc: 0, // 邀请一位新人获得贝
    shareInfo: {}, // 面对面分享时的信息
    vipStatus: {
      type: 0,
      status: 0
    } // 用户的会员状态
  }
}
