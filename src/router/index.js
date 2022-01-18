import Vue from 'vue'
import VueRouter from 'vue-router'
import FormsDaacs from '@/components/FormsDaacs'
import FormsQuestions from '@/components/FormsQuestions'
import PageNotFound from '@/components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/questions/:group/:formId/:requestId',
    name: 'saved',
    component: FormsQuestions
  },
  {
    path: '/questions/:group',
    name: 'edit',
    component: FormsQuestions
  },
  {
    path: '/daacs/:group',
    name: 'daacs',
    component: FormsDaacs,
    alias: '/daacs/selection',
  },
  {
    path: '/*',
    name: 'default',
    component: FormsDaacs,
    alias: '/daacs/selection'
  },
  {
    path: '/404*',
    name: '404',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
