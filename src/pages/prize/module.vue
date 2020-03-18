<template>
  <div class="md-div">
    <div class="md-bd-bg" :class="bgStatus ? 'md-bd-bg1' : 'md-bd-bg2'">
      <div class="item-out">
        <div class="prize-item flex-column flex-just-center flex-align-center" v-for="k in prizeList" :key="k.prizeid"
             :class="k.prizeid === cur ? 'prize-y' : 'prize-n'"
        >
          <div class="prize-img flex-row flex-just-end flex-align-center">
            <img :src="`https://${k.photo}`" alt="">
          </div>
<!--          <div class="prize-word">{{k.prize_name}}</div>-->
        </div>
        <!-----------抽奖按钮------------->
        <div class="prize-btn" @click="doPrize" :class="couldClick ? '' : 'refuse-click'"></div>
      </div>
    </div>
  </div>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'module',
  data () {
    return {
      bgStatus: true,
      bgInterval: '',
      prizeList: [], // 奖品列表
      idList: [],
      cur: undefined, // 当前帧对应的项
      speed: 100,
      couldClick: true // 抽奖按钮可点击
    }
  },
  created () {
    let vm = this
    vm.controlBg() // 开启背景变换
    vm.queryList() // 请求奖项
  },
  methods: {
    controlBg () { // 背景变换函数
      let vm = this
      vm.bgInterval = setInterval(() => {
        vm.bgStatus = !vm.bgStatus
      }, 500)
    },
    queryList () {
      let vm = this
      vm.$axios(urls.getPrizeList, {}).then(res => {
        let code = res.code
        if (code === 'success') {
          // console.log(res)
          for (let k in res.lottery_prize) {
            vm.idList.push(res.lottery_prize[k].prizeid)
          }
          vm.prizeList = res.lottery_prize
          vm.$emit('subNotice', res)
        } else {
          vm.$router.go(-1)
        }
      })
    },
    doPrize () {
      let vm = this
      if (vm.couldClick) {
        vm.couldClick = false // 禁止下次立即执行
        vm.$axios(urls.doPrize, {}).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.prizeAnimate(res)
          } else {
            vm.$q.notify({ message: res.msg })
          }
        })
      }
    },
    prizeAnimate (result) {
      let vm = this
      vm.cur = undefined
      let num = vm.idList.indexOf(Number(result.prizeid))
      let len = vm.idList.length
      let allStamps = Math.floor(Math.random() * 3 + 2) * len + num // 总共要走的步数 2~5圈
      let a = 0
      function myInt () {
        setTimeout(() => {
          if (a <= allStamps) {
            if (allStamps - a < len * 2 && allStamps - a >= len) {
              vm.speed = 200
            } else if (allStamps - a < len) {
              vm.speed = 400
            }
            vm.cur = vm.idList[a % vm.idList.length]
            a++
            myInt()
          } else {
            vm.couldClick = true
            vm.$emit('subDc', result)
            vm.speed = 100
          }
        }, vm.speed)
      }
      myInt()
    }
  }
}
</script>

<style scoped>
.md-div{
  width: 94vw;
  height: 94vw;
  position: relative;
  margin: 3vw;
}
.md-bd-bg1{background-image: url("../../statics/tbIcon/shine1.png")}
.md-bd-bg2{background-image: url("../../statics/tbIcon/shine2.png")}
.md-bd-bg{
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  padding: 6vw;
}
.item-out{width: 100%;height: 100%;position: relative;}
.prize-item{
  width: 27vw;
  height: 27vw;
  background-size: 100% 100%;
  position: absolute;
}
.prize-btn{width: 27vw;height: 27vw;background-size: 100% 100%;position: absolute;background-image: url("../../statics/tbIcon/prize-btn.png");top:27.35vw;left:27.35vw;}
.prize-img{width: 70%;height: 40%;}
.prize-img img{width: 100%;height: auto;}
.prize-word{color: #832909;font-size: 1.4rem;}
.prize-y{background-image: url("../../statics/tbIcon/prize_y.png");}
.prize-n{background-image: url("../../statics/tbIcon/prize_n.png")}
.prize-item:nth-of-type(1){top: .1vw;left: .1vw;}
.prize-item:nth-of-type(2){top: .1vw;left: 27.35vw;}
.prize-item:nth-of-type(3){top: .1vw;left: 54.6vw;}
.prize-item:nth-of-type(4){top: 27.35vw;left: 54.6vw;}
.prize-item:nth-of-type(5){top: 54.6vw;left: 54.6vw;}
.prize-item:nth-of-type(6){top: 54.6vw;left: 27.35vw;}
.prize-item:nth-of-type(7){top: 54.6vw;left: .1vw;}
.prize-item:nth-of-type(8){top: 27.35vw;left: .1vw;}
  /*------------------禁止点击-------------*/
.refuse-click{filter: grayscale(10%);}
</style>
