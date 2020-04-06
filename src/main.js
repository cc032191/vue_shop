import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

// 导入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入vue-table-with-tree-grid
import treetable from 'vue-table-with-tree-grid'

Vue.component('tree-table', treetable)
// 导入全局样式
import './style/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
//  配置axios
import axios from 'axios'
// 请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置axios请求拦截器挂载 `Authorization` 字段
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return
  return config
})
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')