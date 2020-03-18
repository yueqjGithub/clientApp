<template>
  <div class="q-pa-sm bg-white flex-row flex-space-around flex-align-center">
    <div class="link-l link-div">
      <img src="https://pic.iidingyun.com/8696123/commonImg/c/activeL.png" alt="" class="link-img" @click="toCarve">
    </div>
    <div class="link-r link-div flex-column flex-space-around flex-align-center">
      <img src="https://pic.iidingyun.com/8696123/commonImg/c/activeR1.png" alt="" class="link-img" @click="toPrize">
      <img src="https://pic.iidingyun.com/8696123/commonImg/c/activeR2.png" alt="" class="link-img" @click="toMemeber">
    </div>
  </div>
</template>

<script>
import urls from '../../api/urls'

export default {
  name: 'linkPart',
  methods: {
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
.link-div{
  width: 48%;
}
.link-img{
  width: 100%;
}
.link-r .link-img {
  margin-top: .9rem;
}
</style>
