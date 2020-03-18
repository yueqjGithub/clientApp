<template>
  <q-page class="bg-primary flex-column flex-align-center flex-just-end">
    <img src="https://pic.iidingyun.com/8696123/commonImg/c/logo.png" alt="" class="logo">
    <div class="login-content bg-white flex-column flex-align-center flex-just-start q-pa-md">
      <q-form ref="loginForm" class="login-form q-pa-lg">
        <div class="login-item">
          <q-input
            color="transparent"
             placeholder="请输入手机号"
             ref="input"
             dense
             borderless
             clearable
              no-error-icon
             :bottom-slots="false"
             :hide-bottom-space="true"
             v-model.trim="username"
             :rules="[
             val => !!val || '',
             val => /^1(3|4|5|6|7|8|9)\d{9}$/.test(val) || ''
             ]"
             lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="img:https://pic.iidingyun.com/8696123/commonImg/c/username.png" class="login-icon"/>
            </template>
          </q-input>
        </div>
        <!----------------密码--------------------->
        <div class="login-item">
          <q-input
            color="transparent"
            placeholder="输入验证码"
            ref="input"
            dense
            borderless
            no-error-icon
            :bottom-slots="false"
            :hide-bottom-space="true"
            v-model.trim="password"
            :rules="[
             val => !!val || ''
             ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="img:https://pic.iidingyun.com/8696123/commonImg/c/pwd.png" class="login-icon"/>
            </template>
            <template v-slot:append>
              <q-btn text-color="white" class="qr-btn" rounded v-if="timeLimit === 0" unelevated @click="queryQrcode">获取验证码</q-btn>
              <q-btn text-color="white" class="qr-btn" rounded v-else disable unelevated>{{timeLimit}}秒后获取</q-btn>
            </template>
          </q-input>
        </div>
        <div class="login-btn">
          <q-btn color="primary" class="full-width cus-btn-padding" label="登录" rounded @click="loginByMobile"></q-btn>
        </div>
      </q-form>
      <!--------------微信登录-------------------------->
      <div class="flex-column flex-align-center flex-just-start">
        <div class="other-tips">其他方式登录</div>
        <q-btn icon="img:https://pic.iidingyun.com/8696123/commonImg/wx.png" style="background: #26D645" round flat @click="wxAuth(null)"></q-btn>
      </div>
      <div class="bottom-tips text-center">
        登录即代表您已阅读并同意<a href="javascript:void(0);" class="link-tips">《知了贝使用协议》</a>及<a href="javascript:void(0);" class="link-tips">《相关授权》</a>
      </div>
      <div>{{info}}</div>
    </div>
<!--    <p style="width: 100%">{{res}}</p>-->
  </q-page>
</template>

<script>
import urls from 'src/api/urls.js'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      timeLimit: 0,
      bindPhone: '',
      bindCode: '',
      info: ''
    }
  },
  mounted () {
    let vm = this
    let tok = vm.$q.localStorage.getItem('loginInfo')
    if (tok) { // token存在，直接调用token登录接口
      vm.$q.loading.show()
      vm.$axios(urls.loginByToken, {}).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.localStorage.set('loginInfo', res)
          vm.$q.loading.hide()
          vm.$router.push({ name: 'Index' })
        } else {
          vm.refreshToken()
          vm.$q.loading.hide()
        }
      }, err => {
        vm.$q.notify({ message: JSON.stringify(err) })
        vm.$q.loading.hide()
      })
    }
  },
  methods: {
    refreshToken () { // 刷新token
      let vm = this
      vm.$axios(urls.freshToken, {}).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.localStorage.set('loginInfo', res)
          vm.$router.push({ name: 'Index' })
        } else {
          vm.$q.notify({ message: res.errmsg })
        }
      }, err => {
        vm.$q.notify({ message: JSON.stringify(err) })
      })
    },
    loginByMobile () { // 手机登录
      let vm = this
      vm.$refs['loginForm'].validate().then(suc => {
        if (suc) {
          let param = {
            'mobile': vm.username, //
            'code': vm.password
          }
          vm.$axios(urls.mobileLogin, param).then(res => {
            let code = res.code
            if (code === 'success') {
              vm.$q.localStorage.set('loginInfo', res)
              vm.$q.notify({
                message: '登录成功',
                icon: 'done'
              })
              vm.$router.push({ name: 'Index' })
            } else if (code === 'wx_not_binding') { // 服务端返回未绑定微信，调用获取微信授权
              this.$q.dialog({
                title: '授权提示',
                message: '为了更好的服务，需要您的微信授权',
                cancel: '拒绝',
                ok: '允许',
                persistent: true
              }).onOk(() => {
                vm.wxAuth(vm.username)
              }).onCancel(() => {
              })
            } else {
              vm.$q.notify(res.msg)
            }
          }, err => {
            vm.$q.notify({ message: JSON.stringify(err) })
            vm.$q.loading.hide()
          })
        }
      })
    },
    wxAuth (mobile) { // 获取微信授权
      let vm = this
      /* eslint-disable */
      let scope = 'snsapi_userinfo'
      let state = '_' + (+new Date())
        Wechat.auth(scope, state, function (response) {
        // you may use response.code to get the access token.
        // vm.code = JSON.stringify(response)
          let param = {
            'code': response.code
          }
          if (mobile) {
            param['mobile'] = mobile
          }
          // alert(JSON.stringify(param))
          vm.wxLogin(param)
        }, function (reason) {
          vm.$q.notify({ message: reason })
        })
      /* eslint-disable */
    },
    wxLogin (param) { // 微信登录
      let vm = this
      vm.$q.loading.show()
      this.$axios(urls.wxLogin, param).then(res => {
        let code = res.code
        if (code === 'success') {
          if (res.mobile) { // 有手机号
            vm.$q.localStorage.set('loginInfo', res)
            vm.$q.notify({
              message: '登录成功',
              icon: 'done'
            })
            vm.$router.push({ name: 'Index' })
          } else { // 没有手机号
            vm.$q.localStorage.set('loginInfo', res)
            vm.bindMobile()
          }
        } else {
          vm.$q.notify(res.msg)
        }
        vm.$q.loading.hide()
      }, err => {
        vm.$q.notify({ message: JSON.stringify(err) })
        vm.$q.loading.hide()
      })
    },
    queryQrcode () { // 获取验证码
      let vm = this
      let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!reg.test(vm.username)) {
        vm.$q.notify({message: '手机号码格式错误'})
        return false
      } else {
        vm.timeLimit = 60
        let param = {
          'mobile': vm.username
        }
        vm.$axios(urls.queryQrcode, param).then(res =>{
          let code = res.code
          let interval = setInterval(() => {
            if (vm.timeLimit > 0) {
              vm.timeLimit--
            } else {
              vm.timeLimit = 0
              clearInterval(interval)
            }
          }, 1000)
          if (code === 'success') {
            vm.$q.notify({
              message: '发送中，请注意查收'
            })
          } else {
            vm.$q.notify({
              message: res.errmsg
            })
          }
        }, () => {
          vm.$q.notify({
            message: '发送失败，请稍后重试'
          })
        })
      }
    },
    bindMobile () { // 微信登录未绑定手机号
      let vm = this
      this.$q.dialog({
        title: '绑定手机',
        message: '为了更好的服务，请绑定您的手机号',
        prompt: {
          model: vm.bindPhone,
          type: 'text' // optional
        },
        cancel: '拒绝',
        ok: '确认'
      }).onOk(data => {
        let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if (!reg.test(data)) {
          vm.$q.notify({message: '手机号码格式错误'})
          return false
        } else {
          let param = {
            'mobile': data
          }
          vm.$axios(urls.queryQrcode, param).then(res =>{
            let code = res.code
            if (code === 'success') {
              vm.$q.notify({
                message: '已向您发送验证码，请注意查收'
              })
              vm.$q.dialog({
                title: '绑定手机',
                message: '请输入您收到的验证码',
                prompt: {
                  model: vm.bindCode,
                  type: 'text' // optional
                },
                cancel: false,
                persistent: true,
                ok: '确认'
              }).onOk(qrCode => {
                let param1 = {
                  'mobile': data,
                  'code': qrCode
                }
                vm.$axios(urls.bindMobile, param1).then(res1 => {
                  // alert(JSON.stringify(res1))
                  let code1 = res1.code
                  if (code1 === 'success') {
                    let old = vm.$q.localStorage.getItem('loginInfo')
                    old['mobile'] = res1.mobile
                    vm.$q.localStorage.set('loginInfo', old)
                    vm.$q.notify({
                      message: '登录成功',
                      icon: 'done'
                    })
                    vm.$router.push({ name: 'Index' })
                  } else {
                    vm.$q.notify({message: res1.msg})
                  }
                })
              }).onCancel(() => {})
            } else {
              vm.$q.notify({
                message: res.errmsg
              })
            }
          }, () => {
            vm.$q.notify({
              message: '发送验证码失败，请稍后重试'
            })
          })
        }
      }).onCancel(() => {})
    }
  }
}
</script>

<style scoped>
.logo{
  width: 17.8%;
  margin-bottom: 7.6rem;
}
.login-content{
  width: 100%;
  position: relative;
}
.login-form{
  width: 87.5%;
  background:rgba(255,255,255,1);
  box-shadow:0px .3rem 1.5rem 0px rgba(153,153,153,0.5);
  border-radius:15px;
  position: relative;
  top: -5.5rem;
}
.login-item{
  padding: .5rem 1.5rem .5rem 1.5rem;
  border-radius: 3rem;
  box-shadow: 0px 2px 25px 0px rgba(153,153,153,0.25);
}
.login-item + .login-item{
  margin-top: 1.5rem;
}
.login-icon{
  width: 1.5rem;
  height: 2rem;
}
.qr-btn{
  background: #FF9E0B;
}
.login-btn{
  margin-top: 2.1rem;
}
.cus-btn-padding{
  /*padding-top: .5rem;*/
  /*padding-bottom: .5rem;*/
  font-size: 1.8rem;
}
/*----------------------------*/
.other-tips{
  font-size: 1.3rem;
  color: #aaaaaa;
  /*margin-top: 4.8rem;*/
  margin-bottom: 2.5rem;
}
.bottom-tips{
  margin-top: 5.8rem;
  color: #aaaaaa;
  font-size: 1.1rem;
}
.link-tips{
  color: #FF2F5E;
}
</style>
