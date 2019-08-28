<template>
  <div id="app">
    <!--https://github.com/creotip/vue-particles-->
    <vue-particles
      class="particles-js"
      color="#dedede"
      :particle-opacity="0.7"
      :particles-number="80"
      shape-type="circle"
      :particle-size="4"
      lines-color="#dedede"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="3"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    />
    <!--https://github.com/houzisbw/vue-matrix-raindrop-->
    <!--<VueMatrixRaindrop class="particles-js" backgroundColor="#454545"></VueMatrixRaindrop>-->
    <!-- Available click modes: "push", "remove", "repulse", "bubble"-->
    <router-view />
  </div>
</template>

<script>
// import VueMatrixRaindrop from 'vue-matrix-digit-rain'
export default {
  name: 'App',
  components: {
    // VueMatrixRaindrop
  }
}
</script>

<style lang="less" scoped>
  .particles-js {
    /*background-image: url('./assets/components_img/appBg.jpg');*/
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
