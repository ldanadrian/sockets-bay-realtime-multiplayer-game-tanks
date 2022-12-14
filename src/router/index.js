import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  { path: '/server', name: 'server', component: () => import('../views/Server.vue') },
  { path: '/client', name: 'client', component: () => import('../views/Client.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
