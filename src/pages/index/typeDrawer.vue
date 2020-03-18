<template>
  <div>
    <div class="type-tit flex-row flex-just-start flex-align-end q-pa-sm">
      <span>筛选类别</span>
    </div>
    <div class="type-list q-pa-sm">
      <div class="type-list-tit">筛选类型</div>
      <div class="type-list-item flex-row flex-space-between flex-align-start flex-wrap">
        <div class="type-item" v-for="k in list" :key="k.type_name"
          :class="checkedList.indexOf(k.typeid) === -1 ? 'type-not' : 'type-yes'"
           @click="changeType(k.typeid)"
        >
          {{k.type_name}}
        </div>
      </div>
    </div>
    <div class="type-btn-group q-pa-lg flex-column flex-just-center flex-space-between">
      <q-btn label="确认" color="primary" text-color="white" class="full-width type-btn" unelevated
      @click="doFilter"
      ></q-btn>
      <q-btn label="重置" class="full-width type-btn" unelevated
      style="background:#ededed; color: #666666"
      @click="clearFilter"
      ></q-btn>
    </div>
  </div>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'typeDrawer',
  data () {
    return {
      list: [],
      checkedList: []
    }
  },
  mounted () {
    let vm = this
    this.$axios(urls.getTypeList, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        vm.list = [...res.list]
      } else {
        vm.$q.notify({ message: res.msg })
      }
    }, err => {
      vm.$q.notify({ message: `获取类型失败${JSON.stringify(err)}` })
    })
  },
  methods: {
    changeType (id) {
      if (this.checkedList.indexOf(id) === -1) {
        this.checkedList.push(id)
      } else {
        let num = this.checkedList.indexOf(id)
        this.checkedList.splice(num, 1)
      }
    },
    doFilter () {
      this.$emit('filterList', this.checkedList)
    },
    clearFilter () {
      this.checkedList = []
      this.$emit('filterList', this.checkedList)
    }
  }
}
</script>

<style scoped>
.type-tit{
  background: #F0F1F5;
  height: 10vh;
  color: #000000;
  font-size: 1.2rem;
  font-weight: bold;
}
.type-list-tit{
  color: #666666;
  font-size: 1.2rem;
}
.type-item{
  width: 48%;
  text-align: center;
  font-size: 1.2rem;
  margin-top: .8rem;
  border-radius: .5rem;
  padding: .5rem;
  overflow: hidden;
}
.type-not{
  background: #F0F1F5;
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
.type-btn + .type-btn{
  margin-top: .8rem;
}
</style>
