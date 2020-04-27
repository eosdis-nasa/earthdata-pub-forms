import Vue from 'vue'
import VueRouter from 'vue-router'
//import Daacs from '../views/Daacs.vue'
import Daacs from '@/components/Daacs'
//import Questions from '../views/Questions.vue'
import Questions from '@/components/Questions'
//import Help from '../views/Help.vue'
import Help from '@/components/Help'
//import Home from '../views/Home.vue'
import Home from '@/components/Home'
//import PageNotFound from '../views/PageNotFound.vue'
import PageNotFound from '@/components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/daacs/:default',
    name: 'Daacs',
    component: Daacs,
    alias: '/daacs/selection'
  },
  {
    path: '/questions/:default',
    name: 'Questions',
    component: Questions
  },
  {
    path: '/help/:default',
    name: 'Help',
    component: Help
  },
  {
    path: '/404*',
    name: '404',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
