<template>
  <div class="q-pa-sm flex-row flex-space-between flex-align-center">
    <div class="n-item-left flex-row flex-just-start flex-align-center">
      <img :src="`https://${item.item_img}`" alt="" class="n-icon">
      <span class="n-name">{{item.item_name}}</span>
    </div>
    <div v-if="item.item_code === 'first_consum'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'" @click="toSug">{{item.status === 0 ? '去消费' : '已完成'}}</div>
    </div>
    <div v-if="item.item_code === 'perfect_favorite'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'" @click="toHobby">{{item.status === 0 ? '去完成' : '已完成'}}</div>
    </div>
    <div v-if="item.item_code === 'user_mobile_auth'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'">{{item.status === 0 ? '去授权' : '已完成'}}</div>
    </div>
    <div v-if="item.item_code === 'sub_user_first_login'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'" @click="share">{{item.status === 0 ? '去邀请' : '已完成'}}</div>
    </div>
    <div v-if="item.item_code === 'first_login'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'">{{item.status === 0 ? '去完成' : '已完成'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'noviceItem',
  props: ['item'],
  methods: {
    toSug () {
      this.$router.push({ name: 'Suggestion' })
    },
    toHobby () {
      if (this.item.status === 0) {
        this.$router.push({ name: 'Hobby' })
      }
    },
    // 邀请
    share () {
      let vm = this
      vm.$store.commit('common/setShareDc', vm.item.dc_value)
      vm.$router.push({ name: 'Share' })
    }
  }
}
</script>

<style scoped>
.n-icon{
  width: 2.4rem;
  height: 2.4rem;
  display: inline-block;
  margin-right: .4rem;
}
  .n-name{font-size: 1.4rem;color: #454C58;}
  .n-btn{border-radius: .2rem;padding: .2rem .8rem;font-size: 1rem;}
  .btn-y{color: #FF847D;border: 1px solid #FF847D; }
  .btn-n{color: #999999;border: 1px solid #999999; background:#F3F3F3;}
</style>
