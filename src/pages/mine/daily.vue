<template>
  <div class="daily-cont bg-white">
    <div class="novice-tit q-pa-sm">
      每日任务
    </div>
    <d-item v-for="k in list" :key="k.item_code" :item="k"></d-item>
  </div>
</template>

<script>
import dItem from './dailyItem'
export default {
  name: 'daily',
  props: ['list'],
  components: {
    dItem
  }
}
</script>

<style scoped>
  .daily-cont{margin-top: 1.6rem}
  .novice-tit{color: #454C58; font-size: 1.4rem;border-bottom: 1px solid #FAFAFA;font-weight: bold;}
</style>
