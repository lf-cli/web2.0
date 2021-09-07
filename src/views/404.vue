<!-- 404页面 -->
<template>
  <div class="not-found-page">
    <div class="box flex-c">
      <span>系统正在升级，请勿着急~</span>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {},
  beforeDestroy() {},
  activated() {}
}
</script>
<style lang="scss" scoped>
.not-found-page {
  width: 100%;
  height: 100%;
  .box {
    margin: 0 auto;
    padding-top: 100px;
    img {
      width: 600px;
    }
    span {
      font-size: 0.14rem;
    }
  }
}
</style>