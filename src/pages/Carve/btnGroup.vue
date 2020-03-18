<template>
  <div class="flex-column flex-just-center flex-align-center" >
    <div class="btn-bg btn-font" v-if="status === 0" @click="join">我要参与</div>
    <div class="btn-bg btn-font btn-bg-y" v-if="status === 1">未完成</div>
    <div class="btn-bg btn-font-opa" v-if="status === 2">待开奖</div>
    <div class="btn-bg btn-font" v-if="status === 3" @click="share">立即瓜分</div>
<!--    <div class="btn-bg btn-font" v-if="status === 4" @click="joinNext">参与下一期</div>-->
    <div class="tips-font">{{tipName}}</div>
  </div>
</template>

<script>
export default {
  name: 'btnGroup',
  props: ['status', 'tipName'],
  created () {
    if (this.status === 1) {
    }
  },
  computed: {
  },
  methods: {
    join () {
      this.$emit('join')
    },
    share () {
      this.$emit('share')
    },
    joinNext () {
      this.$emit('joinNext')
    }
  }
}
</script>

<style scoped>
.btn-font{
  font-size: 1.8rem;color: #ffffff;font-weight: bold;
}
.btn-font-opa{color: rgba(255,255,255,0.7);font-size: 1.8rem;font-weight: bold;}
.btn-bg{
  width: 14rem;
  text-align: center;
  background-image: url("https://pic.iidingyun.com/8696123/wxImg/index/gf_img5.png");
  background-size: 100% 100%;
  padding: 1rem 2.2rem;
}
.btn-bg-y{
  filter: opacity(30%);
}
.tips-font{font-size: 1.2rem;color: #666666;margin-top: 1rem;}
</style>
