<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            {{productInfo.shop_name}}
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <!-------------------content---------------------------->
    <div class="bg-white order-content">
      <div class="q-pa-sm flex-row flex-space-between flex-align-center">
        <!--图片区域-->
        <div class="flex-row flex-just-start flex-align-center">
          <!--图片-->
          <div class="pro-img">
            <img :src="`https://${productInfo.head_photo}`" alt="">
          </div>
          <!--菜名--->
          <div class="flex-column flex-align-start flex-space-around">
            <div class="pro-name">{{productInfo.product_name}}</div>
            <div class="pro-old-price">门店价{{productInfo.price}}元</div>
          </div>
        </div>
        <!---头部价格区域------->
        <div class="flex-column flex-align-end flex-space-around">
          <div class="price-n">￥{{userType === 0 ? productInfo.sale_price : productInfo.member_sale_price.toFixed(2)}}</div>
          <div class="price-m" v-if="userType === 0">会员价：{{productInfo.member_sale_price.toFixed(2)}}元</div>
        </div>
      </div>
      <!---------数量区域---------------->
      <div class="q-pa-sm flex-row flex-space-between flex-align-center border-top-order">
        <div class="normal-word">数量</div>
        <div class="flex-row flex-space-around flex-align-center">
          <q-btn icon="app:iconreduce" flat round size="xs" class="count-btn" :class="buy_count===1 ? 'count-btn-not' : ''" @click="reduceCount">
            <q-tooltip v-model="showReduceLimit" content-style="font-size:1rem" anchor="bottom middle" v-if="showReduceLimit">
              至少购买一份
            </q-tooltip>
          </q-btn>
          <span class="buy-count">{{buy_count}}</span>
          <q-btn icon="app:iconadd" flat round size="xs" class="count-btn" :class="buy_count===productInfo.inventory ? 'count-btn-not' : ''" @click="addCount">
            <q-tooltip v-model="showAddLimit" content-style="font-size:1rem" anchor="bottom middle" v-if="showAddLimit">
              已限购
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="q-pa-sm flex-row flex-space-between flex-align-center border-top-order">
        <div class="normal-word">小计</div>
        <div class="price-all" v-if="userType === 0">特惠价：￥{{(buy_count * productInfo.sale_price).toFixed(2)}}</div>
        <div class="price-all" v-if="userType === 1">特惠价：￥{{(buy_count * productInfo.member_sale_price).toFixed(2)}}</div>
      </div>
    </div>
    <!-------------------content---------------------------->
    <div class="bg-white order-content">
      <!----抵扣---->
      <div class="q-pa-sm flex-row flex-space-between flex-align-center">
        <!---左侧-->
        <div class="flex-column flex-align-start flex-space-around">
          <div class="normal-word">用贝抵钱</div>
          <div class="balance">剩余{{productInfo.balance || 0}}贝</div>
        </div>
        <!---右侧-->
        <div class="flex-column flex-align-start flex-space-around">
          <div class="flex-row flex-nowrap flex-just-end flex-align-center">
            <div style="color: #888888;font-size: 1.2rem">使用</div>
            <div class="flex-row flex-space-between flex-align-center dc-div" @click="chooseUseDC">
              <div class="text-center dc-val">{{use_dc}}</div>
            </div>
            <div class="dc-cash">抵￥{{dc_price.toFixed(2)}}</div>
          </div>
          <div class="dc-tips" v-if="productInfo.balance <= use_dc" @click="toMine">赚贝可抵更多现金</div>
        </div>
      </div>
      <!-----------实付----------------->
      <div class="q-pa-sm border-top-order flex-row flex-space-between flex-align-center">
        <!---左侧-->
        <div class="flex-column flex-align-start flex-space-around">
          <div class="normal-word">实付金额</div>
        </div>
        <div class="price-all">￥{{actualPrice}}</div>
      </div>
    </div>
    <!-------------------content---------------------------->
    <div class="bg-white order-content q-pa-sm">
      <div class="normal-word">使用流程</div>
      <div class="flex-row flex-space-around flex-align-baseline q-pa-sm">
        <div class="flex-column flex-just-center flex-align-center  step-img">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/step1.png" alt="">
          <div class="step-word">线上支付</div>
        </div>
        <div></div>
        <div class="flex-column flex-just-center flex-align-center step-img">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/step2.png" alt="">
          <div class="step-word">去订单列表</div>
        </div>
        <div></div>
        <div class="flex-column flex-just-center flex-align-center step-img">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/step3.png" alt="">
          <div class="step-word">由店员确认使用</div>
        </div>
      </div>
    </div>
    <!----------------------支付按钮------------------------>
    <div class="q-pa-lg">
      <q-btn class="full-width cus-btn-primary text-white"
      :label="`￥${actualPrice} 提交订单`"
       unelevated
       @click="payOrder"
       :loading="payBtnLoading"
       :disable="payBtnLoading"
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'orderSet',
  data () {
    return {
      productInfo: {},
      buy_count: 1, // 购买份数
      showReduceLimit: false,
      showAddLimit: false,
      timeOut: '',
      payBtnLoading: false,
      chooseDC: true, // 是否用贝
      userType: 0
      // balance: 0, // 我剩余贝
      // use_dc: 0 // 可控制的使用贝数量
    }
  },
  created () {
    // console.log(this.$q.localStorage.getItem('payInfo'))
    let loginInfo = this.$q.localStorage.getItem('loginInfo')
    this.userType = loginInfo.type
    this.productInfo = this.$store.state.common.seeOrder
  },
  // beforeRouteLeave (to, from, next) {
  //   if (to.name === 'Product') {
  //     return next({ name: 'Product', params: { 'shopid': this.productInfo.shopid, 'productid': this.productInfo.productid, 'shop_name': this.productInfo.shop_name } })
  //   } else {
  //     return next()
  //   }
  // },
  computed: {
    // showReduceLimit () {
    //   return this.buy_count === 1
    // }
    actualPrice () {
      let price
      if (this.userType === 0) {
        price = this.buy_count * this.productInfo.sale_price - (this.use_dc / 1000)
      } else {
        price = this.buy_count * this.productInfo.member_sale_price - (this.use_dc / 1000)
      }
      return price.toFixed(2)
    },
    show_dc () { // bottomsheet显示使用贝
      let vm = this
      let num = 0
      let actDc = vm.buy_count * vm.productInfo.dc_value
      if (vm.productInfo.balance < actDc) { // 剩余贝小于实际贝
        num = num = vm.productInfo.balance - vm.productInfo.balance % 10 || 0
      } else {
        num = actDc
      }
      return num
    },
    use_dc () {
      let vm = this
      let num = 0
      let actDc = vm.buy_count * vm.productInfo.dc_value
      if (vm.chooseDC) {
        if (vm.productInfo.balance < actDc) { // 剩余贝小于实际贝
          // num = vm.productInfo.balance || 0
          num = vm.productInfo.balance - vm.productInfo.balance % 10 || 0
        } else {
          num = actDc
        }
      } else {
        num = 0
      }
      return num
    },
    dc_price () {
      let num = this.use_dc / 1000
      return Math.floor(num * 100) / 100
    }
  },
  methods: {
    toMine () {
      this.$router.push({ name: 'Mine' })
    },
    goBack () {
      this.$router.go(-1)
    },
    reduceCount () { //
      if (this.buy_count > 1) {
        this.buy_count--
      } else {
        clearTimeout(this.timeOut)
        this.showReduceLimit = true
        this.timeOut = setTimeout(() => {
          this.showReduceLimit = false
        }, 1500)
      }
    },
    addCount () {
      // daily_max_buy  buy_count
    // && this.buy_count < this.productInfo.daily_max_buy - this.productInfo.buy_count
      if (this.productInfo.market_type === 0) { // 普通菜品
        if (this.buy_count < this.productInfo.inventory) {
          this.buy_count++
        } else {
          clearTimeout(this.timeOut)
          this.showAddLimit = true
          this.timeOut = setTimeout(() => {
            this.showAddLimit = false
          }, 1500)
        }
      } else { // 活动菜品
        if (this.buy_count < this.productInfo.daily_max_buy - this.productInfo.buy_count && this.productInfo.buy_count < this.productInfo.inventory) {
          this.buy_count++
        } else {
          clearTimeout(this.timeOut)
          this.showAddLimit = true
          this.timeOut = setTimeout(() => {
            this.showAddLimit = false
          }, 1500)
        }
      }
    },
    chooseUseDC () { // 选择是否用贝
      let vm = this
      let actions = [
        {
          label: '不使用',
          id: 0,
          classes: 'my-bt-sheet-nouse my-bt-sheet'
        },
        {
          label: vm.show_dc,
          id: 1,
          classes: 'my-bt-sheet'
        }
      ]
      if (vm.use_dc < vm.productInfo.dc_value) {
        actions[2] = {
          label: '赚贝抵用更多现金',
          id: 2,
          classes: 'text-primary my-bt-sheet'
        }
      }
      vm.$q.bottomSheet({
        message: '',
        actions: actions
      }).onOk(action => {
        switch (action.id) {
          case 0:
            vm.chooseDC = false
            break
          case 1:
            vm.chooseDC = true
            break
          case 2:
            vm.$router.push({ name: 'Mine' })
            break
        }
      })
    },
    payOrder () { // 支付
      let vm = this
      vm.$q.bottomSheet({
        message: '请选择支付方式',
        grid: true,
        actions: [
          {
            label: '微信支付',
            id: 'wx',
            icon: 'app:iconweixin',
            classes: 'wx-pay'
          },
          {
            label: '支付宝',
            id: 'zfb',
            icon: 'app:iconzhifubao',
            classes: 'ali-pay'
          }
        ]
      }).onOk(action => {
        switch (action.id) {
          case 'wx':
            vm.useWxPay()
            break
          case 'zfb':
            vm.useAliPay()
            break
        }
      })
    },
    useWxPay () {
      let vm = this
      vm.payBtnLoading = true
      let param = {
        'shopid': vm.productInfo.shopid, // 门店ID
        'pay_amount': vm.actualPrice, // 实际付款
        'dc': vm.dc_price, // dc实际优惠金额，不是贝数量
        'productid': vm.productInfo.productid, // 产品ID
        'count': vm.buy_count
      }
      // console.log(param)
      vm.$axios(urls.queryWxPayInfo, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.toWxPay(res.payParam)
        } else {
          vm.$q.notify(res.msg)
        }
      }, err => {
        vm.$q.notify({ message: `${JSON.stringify(err)}` })
      })
    },
    toWxPay (param) {
      let vm = this
      /* eslint-disable */
      Wechat.sendPaymentRequest(param, function () {
        // 成功操作
        vm.$q.notify({ message: '支付成功' })
        setTimeout(() => {
          vm.$router.push({ name: 'Order' })
        }, 1000)
        vm.payBtnLoading = false
      }, function (reason) {
        vm.$q.notify({ message: '支付已取消' })
        vm.payBtnLoading = false
        // vm.$q.localStorage.set('payInfo', vm.$route.params.productInfo)
        // let info = {
        //   product_name: vm.productInfo.product_name,
        //   shop_name: vm.productInfo.shop_name,
        //   price: vm.productInfo.price,
        //   discount: (vm.productInfo.price - vm.actualPrice).toFixed(2)
        // }
        // vm.$router.push({ name: 'Payfail', params: { info: info } })
      })
      /* eslint-disable */
    },
    useAliPay () {}
  }
}
</script>

<style scoped>
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: .6rem;
    padding-bottom: .6rem;
  }
  .order-content{
    margin-bottom: 1rem;
  }
  .pro-img{
    width: 20vw;
    height: 20vw;
    margin-right: 1rem;
  }
  .pro-img img{
    width: 100%;
    height: 100%;
  }
  .pro-name{
    font-size: 1.4rem;
    font-weight: bold;
    color: #000000;
    margin-bottom: .8rem;
  }
  .pro-old-price{
    color: #838D94;
    font-size: 1.2rem;
  }
  .price-n{
    font-size: 1.2rem;
    color: #F95860;
    font-weight: bold;
    margin-bottom: .8rem;
  }
  .price-m{
    font-size: 1.2rem;
    color: #838D94;
  }
  .price-all{
    font-size: 1.2rem;
    color: #F95860;
    font-weight: bold;
  }
  .normal-word{
    font-size: 1.3rem;
    color: #000000;
    font-weight: bold;
  }
  /*-------------加减按钮样式--------------*/
  .count-btn{
    color: white;
    background: linear-gradient(0deg,rgba(255,96,104,1),rgba(255,141,147,1));;
    font-weight: bold;
  }
  .count-btn-not{
    background: transparent !important;
    border: 1px solid #D3D3D3;
    color: #D3D3D3;
  }
  .buy-count{
    font-size: 1.3rem;
    color: #000000;
    font-weight: bold;
    margin: 0 1.5rem
  }
  /*-------------加减按钮样式--------------*/
  .tol-word{
    font-size: 1rem;
  }
  .border-top-order{
    border-top: 2px dotted #ECECEC;
  }
  .balance{
    font-size: 1rem;
    color: #666666;
    margin-top: .4rem;
  }
  .dc-div{
    margin: 0 0.6rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: #EF4A69;
    background-image: url("https://pic.iidingyun.com/8696123/commonImg/c/dcBg.png");
    background-size: 100% 100%;
    text-align: center;
    padding: .4rem 1rem .4rem 1rem;
  }
  .dc-val{
    width: 7rem;
    text-align: center;
  }
  .dc-cash{
    color: #F95860;
    font-size: 1.2rem;
  }
  .dc-tips{
    color: #FF8400;
    font-size: 1.2rem;
    margin-top: .4rem;
    margin-left: 3rem;
  }
  .step-word{
    font-size: 1.1rem;
    color: #333333;
    margin-top: .6rem;
  }
  .step-img{
    width: 8rem;
  }
  .step-img img {
    width: 65%;
  }
  .my-bt-sheet{
    text-align: center;
  }
</style>
