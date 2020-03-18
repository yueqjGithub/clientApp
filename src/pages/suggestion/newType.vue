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
    <q-tab v-for="k in list" :key="k.typeid" :name="k.typeid" :label="k.type_name" :ripple="false" :class="k.typeid === tab ? 'my-active' : ''"/>
  </q-tabs>
</template>

<script>
export default {
  name: 'newType',
  props: ['list'],
  data () {
    return {
      tab: ''
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
