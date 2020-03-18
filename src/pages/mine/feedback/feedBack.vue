<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            意见与反馈
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="feed-cont bg-white">
      <div class="q-pa-sm feed-tit flex-row flex-just-start flex-align-center">
        <img src="https://pic.iidingyun.com/8696123/wxImg/suggestion/feed1.png" alt="">
        <span>反馈类型</span>
      </div>
      <feed-type @subId="collectId"></feed-type>
    </div>
    <div class="feed-cont bg-white">
      <div class="q-pa-sm feed-tit flex-row flex-just-start flex-align-center">
        <img src="https://pic.iidingyun.com/8696123/wxImg/suggestion/feed2.png" alt="">
        <span>反馈内容</span>
      </div>
      <div class="feed-cont-div">
        <q-input
          v-model="feedText"
          filled
          type="textarea"
          :placeholder="`请填写5个字以上的问题描述以便我们提供更好的帮助~~`"
        />
      </div>
    </div>
    <div class="feed-cont bg-white">
      <div class="q-pa-sm feed-tit flex-row flex-just-start flex-align-center">
        <img src="https://pic.iidingyun.com/8696123/wxImg/suggestion/feed2.png" alt="">
        <span>上传凭证</span>
      </div>
      <feed-img ref="imgList" @subImg="collectImg"></feed-img>
      <div class="upload-tips">
        相关截图（选填）
      </div>
      <div class="q-pa-md">
        <q-input
          dense
          outlined
          v-model="phone"
          placeholder="联系方式"
          :hide-bottom-space="true"
          :no-error-icon="true"
          style="border-color: #EDEDED"
        ></q-input>
      </div>
      <div class="sub-btn q-pa-lg">
        <div class="q-pa-md">
          <q-btn class="cus-btn-primary full-width" label="提交" unelevated @click="subFeed"></q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import feedType from './feedType'
import feedImg from './feedImg'
import urls from 'src/api/urls'
export default {
  name: 'feedBack',
  components: {
    feedType,
    feedImg
  },
  data () {
    return {
      feedid: undefined,
      feedName: '',
      feedText: '',
      phone: '',
      phoneList: []
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    collectId (obj) {
      this.feedid = obj.id
      this.feedName = obj.type_name
    },
    collectImg (list) {
      if (list.length > 0) {
        this.phoneList = [...list]
      }
    },
    subFeed () {
      // "photo":"//pic.iidingyun.com//file/20191125/78543.gif",//相关截图
      //   "content":"内容",//反馈内容（必传）
      //   "typeid":"6",//问题类型ID
      //   "type_name":"其他问题",//问题类型名称
      //   "mobile":12345678912//手机号码、邮箱
      let vm = this
      vm.$refs['imgList'].subList()
      if (vm.feedText.length < 5) {
        vm.$q.notify({ message: '反馈内容至少为5个字噢' })
        return false
      }
      let params = {
        'photo': vm.phoneList.length > 0 ? vm.phoneList.join(',') : '',
        'content': vm.feedText,
        'typeid': vm.feedid,
        'type_name': vm.typeName,
        'mobile': vm.phone
      }
      vm.$axios(urls.subFeed, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.notify({ message: '反馈成功' })
          setTimeout(() => {
            vm.$router.go(-1)
          }, 1500)
        } else {
          vm.$q.notify({ message: res.msg })
        }
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
  .feed-cont + .feed-cont{margin-top: 1rem;}
  .feed-tit img{
    width: 1.6rem;
  }
  .feed-tit span{font-size: 1.4rem; font-weight: bold;color: #000000;margin-left: .6rem;}
  .feed-cont-div{padding: 0 1.6rem 1.6rem 1.6rem}
  .upload-tips{font-size: 1.2rem;color: #838D94;padding: .5rem 1rem;}
</style>
