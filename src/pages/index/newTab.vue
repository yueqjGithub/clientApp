<template>
  <div class="bg-white flex-row flex-space-between flex-align-center q-pa-sm">
    <div v-for="(item, index) in tabs" :key="index" class="tab-item flex-column flex-just-center flex-align-center" @click="doRoute(index)">
      <div class="tab-img-div">
        <img :src="`https:${item.photo}`" alt="" class="tab-img">
        <div class="tab-tips" v-if="item.status">{{item.status}}</div>
      </div>
      <div class="tab-name">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import urls from '../../api/urls'
export default {
  name: 'newTab',
  props: ['tabs'],
  methods: {
    doRoute (index) {
      let vm = this
      switch (index) {
        case 0:
          vm.toLimit()
          break
        case 1:
          vm.toPrize()
          break
        case 2:
          vm.toCarve()
          break
        case 3:
          vm.toMemeber()
          break
      }
    },
    toLimit () {
      this.$router.push({ name: 'LimitBuy' })
    },
    toPrize () {
      this.$router.push({ name: 'Prize' })
    },
    toCarve () {
      this.$router.push({ name: 'Carve' })
    },
    toMemeber () {
      let vm = this
      vm.$axios(urls.queryMyInfo, {}).then(res => {
        let code = res.code
        if (code === 'success') {
          // console.log(res)
          vm.$store.commit('common/saveMineInfo', res)
          this.$router.push({ name: 'Member' })
        }
      }, err => {
        vm.$q.notify({ message: `获取个人信息失败:${JSON.stringify(err)}` })
      })
    }
  }
}
</script>

<style scoped>
.tab-item{
  flex: 1;
}
.tab-tips{
  position: absolute;
  right: 0;
  top: 0;
  font-size: 1rem;
  width: 130%;
  height: 2rem;
  line-height: 1.4rem;
  background-size: 100% 100%;
  background-image: url(https://pic.iidingyun.com/8696123/wxImg/index/tubiao_47.png);
  color: white;
  text-align: center;
  transform: translate(80%, -30%);
}
.tab-img-div{width: 11.4vw;margin-bottom: .6rem;position: relative;}
  .tab-img{width: 100%;}
  .tab-name{font-size: 1.3rem;color: #333333}
</style>
