import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/LoginView.vue')
  },
  {
    path: '/ordersList',
    name: 'ordersList',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderList.vue')
  },
  { 
    path: '/order/create', 
    name: 'OrderCreate',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderForm.vue'),
    meta: { requiresAuth: true } 
  },
  { 
    path: '/order/editar/:id', 
    name: 'OrderEdit',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderForm.vue'),
    meta: { requiresAuth: true } 
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
