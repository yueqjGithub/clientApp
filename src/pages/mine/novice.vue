<template>
  <div class="novice bg-white">
    <div class="novice-tit q-pa-sm">
      新手任务
    </div>
    <n-item v-for="k in list" :key="k.item_code" :item="k"></n-item>
  </div>
</template>

<script>
import nItem from './noviceItem'
export default {
  name: 'novice',
  props: ['list'],
  components: {
    nItem
  }
}
</script>

<style scoped>
.novice{}
.novice-tit{color: #454C58; font-size: 1.4rem;border-bottom: 1px solid #FAFAFA;font-weight: bold;}
</style>
