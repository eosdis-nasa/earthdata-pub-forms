import Vue from 'vue'
import VueRouter from 'vue-router'
import DAACS from '../views/DAACS.vue'
import Questions from '../views/Questions.vue'
import Help from '../views/Help.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/', 
    redirect: '/daacs' 
  },
  {
    path: '/daacs',
    name: 'DAACS',
    component: DAACS
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
  }
]

const router = new VueRouter({
  routes
})

export default router
