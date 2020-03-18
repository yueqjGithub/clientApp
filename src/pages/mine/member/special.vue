<template>
  <div class="special-item flex-column flex-just-start flex-align-center">
    <img :src="img" alt="" class="special-img">
    <div class="flex-column flex-space-around flex-align-center special-bot-div q-pa-sm">
      <div class="special-tit">{{tit}}</div>
      <div class="special-cont">{{content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'special',
  props: ['img', 'tit', 'content']
}
</script>

<style scoped>
.special-item{
  width: 31%;
  box-shadow:0px 5px 13px 0px rgba(0, 0, 0, 0.12);
  border-radius: .5rem;
}
.special-img{
  width: 100%;
  height: auto;
  display: inline-block;
}
.special-bot-div{background: #F4A367;width: 100%;border-radius: 0 0 .5rem .5rem;}
  .special-tit{width: 100%;text-align: center;font-size: 1.4rem;color: #ffffff;}
  .special-cont{width: 100%;text-align: center;font-size: 1.2rem;color: #ffffff;font-weight: bold;}
</style>
