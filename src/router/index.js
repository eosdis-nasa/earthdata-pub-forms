import Vue from 'vue'
import VueRouter from 'vue-router'
import FormsDaacs from '@/components/FormsDaacs'
import FormsQuestions from '@/components/FormsQuestions'
import PageNotFound from '@/components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/questions/:requestId',
    name: 'edit',
    alias: '/questions/:requestId/',
    component: FormsQuestions
  },
  {
    path: '/questions/:requestId/:formId',
    name: 'saved',
    alias: '/questions/:requestId/:formId/',
    component: FormsQuestions
  },
  {
    path: '/daacs/selection',
    name: 'daacs',
    alias: '/daacs/selection/',
    component: FormsDaacs
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
