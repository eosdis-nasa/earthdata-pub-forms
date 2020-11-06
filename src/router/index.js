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
    name: 'Archival Interest - Daacs',
    component: Daacs,
    alias: '/interest/daacs/selection'
  },
  {
    path: '/interest/questions/:default',
    name: 'Archival Interest - Questions',
    component: Questions
  },
  {
    path: '/interest/help/:default',
    name: 'Archival Interest - Help',
    component: Help
  },
  {
    path: '/questionaire/questions',
    name: 'Questionaire - Questions',
    component: Questions
  },
  {
    path: '/questionaire/help/:default',
    name: 'Questionaire - Help',
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