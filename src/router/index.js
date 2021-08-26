import Vue from 'vue'
import VueRouter from 'vue-router'
import Daacs from '@/components/Daacs'
import Questions from '@/components/Questions'
import Help from '@/components/Help'
import PageNotFound from '@/components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/interest/daacs/:group',
    name: 'Data Accession Request - Daacs',
    component: Daacs,
    alias: '/interest/daacs/selection'
  },
  {
    path: '/interest/questions/:group/:formId',
    name: 'Data Accession Request - Questions with FormId',
    component: Questions
  },
  {
    path: '/interest/questions/:group/:formId/:requestId',
    name: 'Data Accession Request - Questions with formId and requestId',
    component: Questions
  },
  {
    path: '/interest/questions/:group',
    name: 'Data Accession Request - Questions',
    component: Questions
  },
  {
    path: '/interest/help',
    name: 'Data Accession Request - Help',
    component: Help
  },
  {
    path: '/questionnaire/questions',
    name: 'Data Publication Request - Questions',
    component: Questions
  },
  {
    path: '/questionnaire/questions/:formId',
    name: 'Data Publication Request - Questions with FormId',
    component: Questions
  },
  {
    path: '/questionnaire/questions/:formId/:requestId',
    name: 'Data Publication Request - Questions with formId and requestId',
    component: Questions
  },
  {
    path: '/questionnaire/help',
    name: 'Data Publication Request - Help',
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
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
