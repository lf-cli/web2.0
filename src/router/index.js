import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index'
import Layout from '../views/layout/index'
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
VueRouter.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/demo',
    name: 'demo',
    component: Layout,
    redirect: '/demo/index',
    children: [

    ],
    meta: { title: '' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404')
  },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
