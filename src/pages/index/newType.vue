<template>
  <q-tabs
    dense
    v-model="tab"
    inline-label
    class="bg-white cus-text"
    narrow-indicator
    align="justify"
    active-color="black"
    indicator-color="primary"
  >
    <q-tab v-for="k in list" :key="k.id" :name="k.id" :label="k.type_name" :ripple="false" :class="k.id === tab ? 'my-active' : ''"/>
  </q-tabs>
</template>

<script>
export default {
  name: 'newType',
  props: ['list'],
  data () {
    return {
      tab: undefined
    }
  },
  watch: {
    tab (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('filterList', this.tab)
      }
    }
  }
}
</script>

<style scoped>
.cus-text{color: #666666;}
</style>
