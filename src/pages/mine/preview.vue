<template>
  <div class="q-pa-md flex-row flex-space-between flex-align-center">
    <div class="preview-item dc-item" @click="toDCenter">
      <div class="item-tit">我的贝</div>
      <div class="item-cont">{{dc || 0}}</div>
    </div>
    <div class="preview-item mine-item"  @click="toMember">
      <div class="item-tit">我的会员</div>
      <div class="item-cont">{{memberStataus}}</div>
    </div>
    <div class="preview-item mine-item" @click="toFavorite">
      <div class="item-tit">我的美食</div>
      <div class="item-cont">喜欢的优惠菜品</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'preview',
  props: ['dc', 'memberCountent', 'memeberStatus'],
  computed: {
    memberStataus () {
      let vm = this
      let str = ''
      switch (this.memberCountent) {
        case 1:
          if (vm.memeberStatus === 0) {
            str = `立即续费》`
          } else {
            str = `续费会员》`
          }
          break
        case 0:
          str = `VIP首月1元`
          break
        default:
          str = `VIP首月1元`
          break
      }
      return str
    }
  },
  methods: {
    toDCenter () {
      this.$router.push({ name: 'Bill' })
    },
    toFavorite () {
      this.$router.push({ name: 'Favorite' })
    },
    toMember () {
      this.$router.push({ name: 'Member' })
    }
  }
}
</script>

<style scoped>
.preview-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 28.8vw;
  height: 16.7vw;
  background-size: 100% 100%;
  box-shadow:0px 0px 8px 0px rgba(0, 0, 0, 0.1);
}
  .item-tit{color: #333333;font-size: 1.4rem}
  .item-cont{color: #FF7E00;font-size: 1.2rem}
  .dc-item{
    background-image: url("https://pic.iidingyun.com/8696123/wxImg/my/bg2.png");
  }
  .mine-item{
    background-image: url("https://pic.iidingyun.com/8696123/wxImg/my/bg1.png");
  }
</style>
