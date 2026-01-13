import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'journal', component: () => import('../views/Journal.vue') },
      { path: 'map', component: () => import('../views/Map.vue') },
      { path: 'memoir', component: () => import('../views/Memoir.vue') },
      { path: 'profile', component: () => import('../views/Profile.vue') },
      { path: 'store', component: () => import('../views/Store.vue') },
      { path: 'webview', component: () => import('../views/Webview.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
