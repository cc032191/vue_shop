import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './style/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
//  配置axios
import axios from 'axios'
// 请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')