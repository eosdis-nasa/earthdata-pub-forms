import Vue from 'vue'
import VueRouter from 'vue-router'
import Daacs from '@/components/Daacs'
import Questions from '@/components/Questions'
import Help from '@/components/Help'
import Home from '@/components/Home'
import PageNotFound from '@/components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/interest/daacs/:default',
    name: 'Data Publication Request - Daacs',
    component: Daacs,
    alias: '/interest/daacs/selection'
  },
  {
    path: '/interest/questions/:default',
    name: 'Data Publication Request - Questions',
    component: Questions
  },
  {
    path: '/interest/help',
    name: 'Data Publication Request - Help',
    component: Help
  },
  {
    path: '/questionnaire/questions',
    name: 'Questionnaire - Questions',
    component: Questions
  },
  {
    path: '/questionnaire/help',
    name: 'Questionnaire - Help',
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