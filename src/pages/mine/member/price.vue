<template>
  <div class="q-pa-sm flex-row flex-space-between flex-wrap flex-align-center">
    <div v-for="k in list" :key="k.member_typeid" :class="k.member_typeid === choose ? 'choose-type-y' : 'choose-type-n'"
         class="choose-type flex-column"
    @click="chooseCharge(k)">
      <div class="charge-name q-pa-sm">{{k.type_name}}</div>
      <div class="charge-price q-pa-md flex-row flex-just-center flex-align-center" v-if="type==='cash'">
        <div v-if="userType === 1" class="flex-row flex-just-center flex-align-center">
          <span class="charge-icon">￥</span>
          <span class="charge-num">{{k.original_price}}</span>
        </div>
        <div v-if="userType === 0 && k.display_order !== 1" class="flex-row flex-just-center flex-align-center">
          <span class="charge-icon">￥</span>
          <span class="charge-num">{{k.original_price}}</span>
        </div>
        <div v-if="userType === 0 && k.member_typeid === 1">
          <div class="flex-column flex-just-center flex-align-center">
            <div class="new-vip-tit">首月体验价</div>
            <div class="flex-row flex-just-center flex-align-center">
              <span class="charge-icon">￥</span>
              <span class="charge-num">{{k.price}}</span>
            </div>
            <div class="new-vip-origin-price">原价￥3</div>
          </div>
        </div>
      </div>
      <div class="charge-price q-pa-md flex-row flex-just-center flex-align-center" v-if="type==='dc'">
        <span class="charge-dc">{{k.dc}}贝</span>
      </div>
    </div>
  </div>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'price',
  props: {
    type: {},
    isPrize: { // 是否从抽奖进入
      default: false
    }
  },
  data () {
    return {
      list: [],
      choose: undefined,
      userType: 0 // 用户状态 0 - 可首月购买优惠，1-原价购买
    }
  },
  created () {
    let vm = this
    vm.userType = vm.$q.localStorage.getItem('loginInfo').type
    this.$axios(urls.getChargeType, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        let obj = {
          type: res.type,
          status: res.status
        }
        if (!vm.isPrize) {
          vm.$store.commit('common/setVipStatus', obj)
        }
        vm.list = res.member_type
      } else {
        vm.$q.notify({ message: res.msg })
      }
    }, err => {
      vm.$q.notify({ message: JSON.stringify(err) })
    })
  },
  methods: {
    chooseCharge (obj) {
      let vm = this
      vm.choose = obj.member_typeid
      vm.$emit('subChargeType', obj)
    }
  }
}
</script>

<style scoped>
.choose-type{
  width: 26.4vw;
  height: 34.7vw;
  /*box-shadow:0px 5px 13px 0px rgba(0, 0, 0, 0.12);*/
  border-radius: .5rem;
  overflow: hidden;
}
.charge-name{font-size: 1.4rem; text-align: center}
.charge-price{background: white;border-radius: 0 0 .5rem .5rem;flex:2;}
  .charge-icon{font-size: 1.2rem;color: #000000;font-weight: bold;}
  .charge-num{font-size: 3.3rem;font-weight: bold;color: #000000;line-height: 3.3rem;}
  .choose-type-y{
    border: 1px solid #F9575F;
    overflow: hidden;
    box-shadow:0px 5px 13px 0px rgba(0, 0, 0, 0.12);
  }
  .choose-type-y .charge-name{background: #F9575F;color: #ffffff;border-bottom: 1px solid #F9575F;}
  .choose-type-n {
    border: 1px solid #e6e6e6;
  }
  .choose-type-n .charge-name{background: #ffffff;color: #000000;border-bottom: 1px solid #e6e6e6;}
  .charge-dc{font-size: 1.8rem;color: #000000;}
  .new-vip-tit{color: #ffffff;font-size: 1rem;background: #FF935E;padding: .2rem .4rem;border-radius: .2rem;}
  .new-vip-origin-price{color: #A8A8A8; font-size: 1rem;}
</style>
