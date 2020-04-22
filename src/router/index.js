import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/index.vue'
import home from '../views/home/index.vue'
// 导入主页右边的组件
import welcome from '../views/welcome/index.vue'
import categories from '../views/categories/index.vue'
import goods from '../views/goods/index.vue'
import addgoods from '../views/goods/components/addgoods.vue'
import orders from '../views/orders/index.vue'
import params from '../views/params/index.vue'
import rights from '../views/rights/index.vue'
import roles from '../views/roles/index.vue'
import users from '../views/users/index.vue'
import reports from '../views/reports/index.vue'
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
    // 只要访问home页面  就定向到welcome页面
    redirect: '/welcome',
    component: home,
    children: [{
        path: '/welcome',
        component: welcome
      },
      {
        path: '/categories',
        component: categories
      },
      {
        path: '/goods',
        component: goods
      },
      {
        path: '/goods/add',
        component: addgoods
      },
      {
        path: '/orders',
        component: orders
      },
      {
        path: '/params',
        component: params
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/users',
        component: users
      },
      {
        path: '/reports',
        component: reports
      }
    ]
  }
]

// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
    // 开启进度条
    NProgress.start();
    next()
  }

})
router.afterEach(() => {
  NProgress.done();
})
export default router