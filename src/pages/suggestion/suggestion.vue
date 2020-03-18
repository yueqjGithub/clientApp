<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent" ref="comHeader">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round disable></q-btn>
          </div>
          <div class="cus-header-m text-center">
            知了推荐
          </div>
          <div class="cus-header-r">
          </div>
        </div>
        <div class="index-search q-pa-sm">
          <q-input
            dense
            borderless
            :bottom-slots="false"
            :hide-bottom-space="true"
            placeholder="请输入菜品/门店关键字"
            class="cus-search-input"
            input-class="text-white"
            @focus="toSearch"
          >
            <template v-slot:prepend>
              <q-icon name="img:https://pic.iidingyun.com/8696123/commonImg/c/search_icon.png" />
            </template>
          </q-input>
        </div>
      </div>
<!--      <type-list :list="typeList" v-if="typeList.length > 1" @filterList="chooseid"></type-list>-->
    </q-header>
    <div class="full-width">
      <product-list :opt="listOpt" :finalPosition="finalPosition"></product-list>
    </div>
  </q-page>
</template>

<script>
import productList from './productList'
// import typeList from 'src/pages/suggestion/newType'
export default {
  name: 'suggestion',
  data () {
    return {
      showDrawer: false,
      listOpt: {},
      slide: 1,
      showSkeleton: true,
      finalPosition: 0
      // showSkeleton: true,
      // typeList: [],
      // typeid: undefined
    }
  },
  components: {
    productList
  },
  mounted () {
    this.finalPosition = this.$refs['comHeader'].size
  },
  methods: {
    toSearch () {
      this.$router.push({ name: 'Search' })
    }
    // chooseid (obj) { // 点击标签
    //   this.typeid = obj
    //   this.listOpt = {
    //     'typeid': obj
    //   }
    // },
    // getTypeList (list) { // 从list获取标签
    //   this.typeList = [...list]
    // }
  }
}
</script>

<style scoped>
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: 2rem;
  }
</style>
