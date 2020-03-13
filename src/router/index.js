import Vue from 'vue'
import VueRouter from 'vue-router'
import DAACS from '../views/DAACS.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'DAACS',
    component: DAACS
  }
]

const router = new VueRouter({
  routes
})

export default router
