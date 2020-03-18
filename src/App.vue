<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // StatusBar.hide()
    this.$q.iconMapFn = (iconName) => {
      // iconName is the content of QIcon "name" prop

      // your custom approach, the following
      // is just an example:
      if (iconName.startsWith('app:') === true) {
        // we strip the "app:" part
        const name = iconName.substring(4)

        return {
          cls: 'iconfont ' + name
        }
      }
    }
    /* eslint-disable */
    StatusBar.hide()
    /* eslint-disable */
  },
  mounted () {
    /* eslint-disable */
    cordova.plugins.notification.local.schedule({
      id: 1,
      title: '限时秒杀就要开始啦',
      trigger: { every: { hour: 10, minute: 55 } }
    })
    /* eslint-disable */
  }
}
</script>
