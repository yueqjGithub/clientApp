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
  </q-layout>
</template>

<script>
export default {
  name: 'cusLayout'
}
</script>

<style scoped>

</style>
