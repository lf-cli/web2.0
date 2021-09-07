<template>
  <div class="container">
    <header-com />
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <router-view />
    <!-- </transition> -->
  </div>
</template>
<script>
import headerCom from '@/components/header/index'
export default {
  name: 'Home',
  components: {
    headerCom,
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
