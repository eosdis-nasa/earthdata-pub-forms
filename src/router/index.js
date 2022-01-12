import Vue from 'vue'
import VueRouter from 'vue-router'
import formsDaacs from '@/components/formsDaacs'
import formsQuestions from '@/components/formsQuestions'
import PageNotFound from '@/components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/interest/daacs/:group',
    name: 'Data Accession Request - Daacs',
    component: formsDaacs,
    alias: '/interest/daacs/selection'
  },
  {
    path: '/interest/questions/:group/:formId',
    name: 'Data Accession Request - Questions with FormId',
    component: formsQuestions
  },
  {
    path: '/interest/questions/:group/:formId/:requestId',
    name: 'Data Accession Request - Questions with formId and requestId',
    component: formsQuestions
  },
  {
    path: '/interest/questions/:group',
    name: 'Data Accession Request - Questions',
    component: formsQuestions
  },
  {
    path: '/questionnaire/questions',
    name: 'Data Publication Request - Questions',
    component: formsQuestions
  },
  {
    path: '/questionnaire/questions/:formId',
    name: 'Data Publication Request - Questions with FormId',
    component: formsQuestions
  },
  {
    path: '/questionnaire/questions/:formId/:requestId',
    name: 'Data Publication Request - Questions with formId and requestId',
    component: formsQuestions
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
