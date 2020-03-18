<template>
  <div class="flex-row flex-just-start flex-align-center q-pa-sm">
    <div class="photo-item" v-for="k in imgList" :key="k">
      <img :src="`https://${k}`" alt="" class="product-pic">
      <q-inner-loading :showing="k === 'no'">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <div class="remove-pic" @click="removePhoto(k)">
        <div class="remove-icon"></div>
      </div>
    </div>
    <!---------上传按钮------------------->
    <div class="upload-btn" @click="chooseUpload" v-if="imgList.length < 3">
    </div>
    <!---------上传控件---------------->
    <div style="display: none;">
      <input type="file" accept="image/*"  v-if="$q.platform.is.android" capture="camera" multiple="multiple" ref="upload"
             @change="changeAvator($event)"/>
      <input type="file" accept="image/*"  multiple="multiple" ref="upload"
             @change="changeAvator($event)"
      />
    </div>
  </div>
</template>

<script>
import { dealImage } from '../../../api/filter'
import urls from 'src/api/urls'
export default {
  name: 'feedImg',
  data () {
    return {
      imgList: []
    }
  },
  methods: {
    subList () {
      this.$emit('subImg', this.imgList)
    },
    chooseUpload () { // 选择是相册还是相机上传
      let vm = this
      // this.$refs['myInput'].click()
      this.$q.bottomSheet({
        message: '',
        actions: [
          {
            label: '相机',
            id: 'camera'
          },
          {
            label: '从相册中选择',
            id: 'photo'
          }
        ]
      }).onOk(action => {
        // this.$q.notify(action.id)
        if (action.id === 'photo') {
          this.$refs['upload'].click()
        } else if (action.id === 'camera') {
          // this.$q.notify(action.id)
          /* eslint-disable */
          navigator.camera.getPicture(
            data => { // on success
              let params = {
                fileName: `${Math.random()}pic`,
                fileData: `data:image/jpeg;base64,${data}`
              }
              vm.product.photo.push('no')
              vm.$axios(urls.uploadImg, params).then(res => {
                if (res.code === 'success') {
                  vm.imgList.pop()
                  vm.imgList.push(res.url)
                } else {
                  setTimeout(() => {
                    vm.imgList.pop()
                    vm.$q.notify(res.message)
                  }, 1000)
                }
              }, () => {
                setTimeout(() => {
                  vm.imgList.pop()
                  this.$q.notify('上传出错，请检查网络是否通畅')
                }, 1000)
              })
            },
            () => { // on fail
              // this.$q.notify('Could not access device camera.')
            },
            {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL, // 返回Base64编码字符串
            }
          )
          /* eslint-disable */
        }
      }).onCancel(() => {

      })
    },
    changeAvator (e) { // 从相册选择
      let vm = this
      // console.log(e)
      let file = e.target.files[0]
      let params = {}
      let reader = new FileReader()
      vm.imgList.push('no')
      reader.readAsDataURL(file)
      // 一定要在文件读取 成功完成时 再进行相应的操作：上传使用formdata上传
      reader.onload = function () {
        // vm.storeInfo.imgUrl = reader.result
        // console.log(reader.result.length)
        let newImg = ''
        dealImage(reader.result, 800, function (data) {
          newImg = data
          params = {
            fileName: file.name,
            fileData: newImg
          }
          vm.$axios(urls.uploadImg, params).then(res => {
            if (res.code === 'success') {
              // vm.form.imgUrl = res.url
              vm.imgList.pop()
              vm.imgList.push(res.url)
            } else {
              vm.$q.notify(res.message)
              vm.imgList.pop()
            }
          }, () => {
            // console.log(err)
            vm.$q.notify('操作失败，请检查网络是否通畅')
            vm.imgList.pop()
          })
        })
      }
    },
    removePhoto (k) { // 删除某一张
      let vm = this
      let num = vm.imgList.indexOf(k)
      if (k !== -1) {
        vm.imgList.splice(num, 1)
      }
    }
  }
}
</script>

<style scoped>
.upload-btn{
  background-image: url("https://pic.iidingyun.com/8696123/commonImg/c/upload-ctrl.png");
  background-size: 100% 100%;
  width: 26vw;
  height: 26vw;
  margin-left: 1rem;
}
.photo-item{
  width: 26vw;
  height: 26vw;
  border-radius: .5rem;
  overflow: hidden;
  position: relative;
  margin-left: 1rem;
}
.remove-pic{
  padding: .5rem 1rem;
  background: #FF3535;
  color: white;
  position: absolute;
  top: 0;
  right: -.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: .6rem;
}
.remove-icon{
  width: 1rem;
  border: 1px solid #ffffff;
}
.product-pic{
  width: 100%;
  height: 100%;
}
</style>
