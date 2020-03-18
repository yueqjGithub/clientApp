<template>
  <q-layout view="lHh Lpr lFf">
    <transition
      appear
      mode="out-in"
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutLeft"
    >
      <q-page-container>
        <router-view></router-view>
      </q-page-container>
    </transition>
    <q-footer>
      <common-footer></common-footer>
    </q-footer>
  </q-layout>
</template>

<script>
import commonFooter from '../components/commonFooter'
export default {
  name: 'FooterLayout',
  components: {
    commonFooter
  }
}
</script>

<style scoped>

</style>
