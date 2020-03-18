<template>
  <div class="q-pa-md flex-row flex-wrap flex-juse-start flex-align-center type-list">
    <div class="type-item" v-for="j in list" :key="j.id"
         :class="j.id === choose ? 'type-yes' : 'type-not'"
         @click="changeChecked(j)"
    >{{j.type_name}}</div>
  </div>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'feedType',
  data () {
    return {
      choose: undefined,
      list: []
    }
  },
  created () {
    let vm = this
    vm.$axios(urls.getFeedType, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        vm.list = res.list
      } else {
        vm.$q.notify({ message: res.msg })
      }
    }, err => {
      vm.$q.notify({ message: JSON.stringify(err) })
    })
  },
  methods: {
    changeChecked (obj) {
      let vm = this
      vm.choose = obj.id
      vm.$emit('subId', obj)
    }
  }
}
</script>

<style scoped>
  /*------------------标签样式----------------------*/
  .type-item{
    width: 23%;
    text-align: center;
    font-size: 1.2rem;
    margin-top: .8rem;
    border-radius: .5rem;
    padding: .5rem;
    overflow: hidden;
  }
  .type-item:nth-of-type(1){margin-left: 0 !important;}
  .type-item:not(:nth-of-type(5n)){
    margin-left: 1.8%;
  }
  .type-not{
    /*background: #F0F1F5;*/
    border: 1px solid #F0F1F5;
    color: #838D94;
  }
  .type-yes{
    border: 1px solid #F6535C;
    color: #F6535C;
    position: relative;
  }
  .type-yes::after{
    /*font-family: 'iconfont';*/
    content: '';
    display: inline-block;
    border-top: 1.5rem solid #F6535C;
    border-right: 2rem solid #F6535C;
    border-bottom: 1.5rem solid transparent;
    border-left: 2rem solid transparent;
    position: absolute;
    right: 0;
    top: -1.2rem;
  }
  .type-yes::before{
    font-family: 'iconfont';
    content: "\e681";
    font-size: 1.2rem;
    color: white;
    position: absolute;
    right: 0;
    top: -.3rem;
    z-index: 1;
  }
  .type-list{border-top: 1px solid #EDEDED}
</style>
