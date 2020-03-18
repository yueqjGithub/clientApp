<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            我的饮食喜好
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <!---------------content------------------->
    <div class="bg-white fav-all-tit q-pa-sm">选择您的喜好，一秒就有靠谱推荐</div>
    <div v-for="k in list" :key="k.type.typeid" class="tag-div bg-white">
      <div class="type-name q-pa-sm">{{k.type.type_name}}</div>
      <div class="q-pa-md flex-space-between flex-row flex-align-start flex-wrap">
        <div class="type-item" v-for="j in k.tag" :key="j.index"
        :class="j.checked ? 'type-yes' : 'type-not'"
             @click="changeChecked(j)"
        >{{j.tag_name}}</div>
      </div>
    </div>
    <!----------btn----------------->
    <div class="q-pa-lg text-center">
      <div class="btn-out">
        <q-btn class="cus-btn-primary full-width" label="保存喜好" unelevated @click="saveFavorite" :loading="btnLoading" :disable="btnLoading"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'hobby',
  data () {
    return {
      list: {},
      choose: [],
      btnLoading: false,
      lat: 0,
      lng: 0
    }
  },
  created () {
    let vm = this
    vm.$axios(urls.favoriteList, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        vm.list = res.data
      } else {
        vm.$q.notify({ message: res.msg })
      }
    }, err => {
      vm.$q.notify({ message: `获取标签失败${JSON.stringify(err)}` })
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    changeChecked (obj) {
      let vm = this
      if (obj.checked) {
        let num = vm.choose.indexOf(obj.tag_name)
        vm.choose.splice(num, 1)
        obj.checked = false
      } else {
        vm.choose.push(obj.tag_name)
        obj.checked = true
      }
    },
    saveFavorite () {
      let vm = this
      // console.log(this.choose.join(','))
      vm.btnLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let params = {
          'lat': vm.lat,
          'lng': vm.lng,
          'tags': vm.choose.join(',')
        }
        vm.$axios(urls.saveFavorite, params).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.$q.notify({ message: '保存成功' })
            setTimeout(() => {
              vm.$router.go(-1)
            }, 2000)
            vm.btnLoading = false
          } else {
            vm.$q.notify(res.msg)
          }
        })
      }, () => {
        vm.lat = 30.546561
        vm.lng = 104.066529
        let params = {
          'lat': vm.lat,
          'lng': vm.lng,
          'tags': vm.choose.join(',')
        }
        vm.$axios(urls.saveFavorite, params).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.$q.notify({ message: '保存成功' })
            setTimeout(() => {
              vm.$router.go(-1)
            }, 2000)
            vm.btnLoading = false
          } else {
            vm.$q.notify(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: .6rem;
    padding-bottom: .6rem;
  }
  .tag-div{
    margin-top: 1rem;
  }
  .fav-all-tit{
    font-size: 1.3rem;
    color: #000000;
    font-weight: bold;
  }
  .type-name{color: #454C58;font-size: 1.2rem;border-bottom: .2rem solid #f5f5f5;}
  .btn-out{
    width: 50%;
    margin: 0 auto;
  }
  /*------------------标签样式----------------------*/
  .type-item{
    width: 30%;
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
