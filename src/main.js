import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss' // global css
import element from './utils/element'

import './icons'

Vue.config.productionTip = false
Vue.use(element)


//注册一些全局组件 不用每次都再引入
// import titleBox from '@/components/common/title/title.vue'
// Vue.component('titleBox', titleBox)

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
  }
}).$mount('#app')
