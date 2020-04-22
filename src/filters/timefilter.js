// 导入vue
import Vue from 'vue'
// 导入datjs
import dayjs from 'dayjs'
// 全局注册
Vue.filter('timeDate', function (value) {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
})