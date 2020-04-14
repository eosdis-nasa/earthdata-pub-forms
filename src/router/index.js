import Vue from 'vue'
import VueRouter from 'vue-router'
import Daacs from '../views/DAACS.vue'
import Questions from '../views/Questions.vue'
import Help from '../views/Help.vue'
import Home from '../views/Home.vue'
import PageNotFound from '../views/PageNotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/daacs',
    name: 'Daacs',
    component: Daacs
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/404',
    name: '404',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
