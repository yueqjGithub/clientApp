<template>
  <div class="rule-div q-pa-md">
    <p>1、每位用户每天有{{times}}次抽奖机会</p>
    <p>2、消耗200知了贝可启动一次抽奖,不足抽奖启动贝可先去赚贝</p>
    <p>3、特别说明：已成为会员者中奖“一个月会员”或“一年会员”会自动续期会员截止时间</p>
    <div class="rule-tit shadow-3">抽奖规则</div>
    <q-btn icon="close" round size="sm" class="rule-close" unelevated @click="close"></q-btn>
  </div>
</template>

<script>
export default {
  name: 'rule',
  props: ['times'],
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .rule-div{width: 90vw;background: #ffffff;border-radius: .5rem;position: relative;overflow: visible;padding-top: 1.8rem;padding-bottom: 0;}
  .rule-tit{
    border: 1px solid #FFDE00;
    text-align: justify;
    padding: .4rem 1rem;
    background: #DB1B0F;
    border-radius: .5rem;
    color: #ffffff;
    font-weight: bold;
    font-size: 1.4rem;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(0, -50%);
  }
  .rule-close{background: #999999;color: #ffffff;position: absolute;right: .2rem;top: .2rem;}
</style>
