import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/index.vue'
import home from '../views/home/index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    component: login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: home
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to  将要访问的路径
  // form 代表从哪个路径跳转而来
  // next 是一个函数   表示放行    next()   无参数表示放行       next('/login')   有参数表示强制跳转     
  if (to.path === '/login') {
    //login页面直接放行   不需要token
    return next()
  }
  // 拿到token
  let token = window.sessionStorage.getItem('token')
  if (!token) {
    //如果没有 token则强制返回到登录页面
    return next('/login')
  } else {
    // 如果有则直接放行
    next()
  }

})
export default router