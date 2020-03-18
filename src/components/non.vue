<template>
  <div class="text-center non-info-div q-pa-lg">
    <img src="https://pic.iidingyun.com/8696123/wxImg/image/order-empty.png" alt="">
    <p class="text-center">{{message}}</p>
  </div>
</template>

<script>
export default {
  name: 'non',
  props: ['message']
}
</script>

<style scoped>
.non-info-div{
  width: 100vw;
}
.non-info-div img {
  width: 42%;
}
</style>
