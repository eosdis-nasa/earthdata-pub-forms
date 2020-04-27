import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vuelidate from 'vuelidate'
import $ from 'jquery'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(BootstrapVueIcons)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Optionally install vuelidatejs plugin
Vue.use(Vuelidate)

//Vue.use(OverlayPlugin)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// This imports all the layout components such as <b-container>, <b-row>, <b-col>:
import { LayoutPlugin } from 'bootstrap-vue'
Vue.use(LayoutPlugin)

// This imports <b-modal> as well as the v-b-modal directive as a plugin:
import { ModalPlugin } from 'bootstrap-vue'
Vue.use(ModalPlugin)

// This imports <b-card> along with all the <b-card-*> sub-components as a plugin:
import { CardPlugin } from 'bootstrap-vue'
Vue.use(CardPlugin)

// This imports directive v-b-scrollspy as a plugin:
import { VBScrollspyPlugin } from 'bootstrap-vue'
Vue.use(VBScrollspyPlugin)

// This imports the dropdown and table plugins
import { DropdownPlugin, TablePlugin } from 'bootstrap-vue'
Vue.use(DropdownPlugin)
Vue.use(TablePlugin)

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Custom components
import Home from '@/components/Home.vue'
import Daacs from '@/components/Daacs.vue'
import Questions from '@/components/Questions.vue'
import Help from '@/components/Help.vue'
import PageNotFound from '@/components/PageNotFound.vue'

Vue.component('Daacs', Daacs);
Vue.component('Home', Home);
Vue.component('PageNotFound', PageNotFound);
Vue.component('Questions', Questions);
Vue.component('Help', Help);

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    // @vuese
    // Set active nav element
    setActiveNav(activeElement, navs = ['daacs', 'help', 'questions'], activeClass = 'router-link-exact-active router-link-active'){
      setTimeout(() => {
        for(var n in navs){
          if(document.getElementById(activeElement + '_nav_link') != null){
            var prevClassname
            if (navs[n] == activeElement){
              prevClassname = document.getElementById(activeElement + '_nav_link').className
              document.getElementById(activeElement + '_nav_link').className = activeClass
            } else {
              prevClassname = document.getElementById(navs[n] + '_nav_link').className
              document.getElementById(navs[n] + '_nav_link').className = prevClassname.replace(activeClass,'') 
            }
          }
        }
      }, 10)
    },
    // @vuese
    // Get active nav element according to class of nav elements
    getActiveNavViaClass(navs = ['daacs', 'help', 'questions'], activeClass = 'router-link-exact-active.router-link-active'){
      for(var n in navs){
        if ($('#' + navs[n] + '_nav_link').hasClass(activeClass)){
          return navs[n]
        }
      }
    },
    // @vuese
    // Set active nav element according to location.href value
    setActiveNavViaLocation(navs = ['daacs', 'help', 'questions']){
        var match_found = false
        for(var n in navs){
          var reg = '/' + navs[n] + '/'
          var re = new RegExp(reg, "g")
          if(location.href.match(re)){
            this.setActiveNav(navs[n])
            match_found = true
          }
        }
        return match_found
    },
    // @vuese
    // Set / Resets active location.href value without updating state
    setActiveLocationWithoutReload(lctn = location.href, shortName){
      if(typeof shortName !='undefined' && shortName != null && (lctn.match(/questions/g) || lctn.match(/daacs/g))){
        var current_href = lctn.substr(0, lctn.lastIndexOf("/"))
        let to_href = decodeURIComponent(shortName).replace(/ /g,'_').toLowerCase()
        let next_hash = current_href + '/' + to_href
        history.replaceState('updating daac in href', window.document.title, next_hash);
        if(typeof window.location.pathname.split('/')[1] !='undefined' && window.location.pathname != null){
          let daacs_nav_link = window.location.pathname.replace(/questions/g,'daacs').replace(/ /g,'_').toLowerCase()
          let questions_nav_link = window.location.pathname.replace(/daacs/g,'questions').replace(/ /g,'_').toLowerCase()
          return { 'daacs_nav_link': daacs_nav_link, 'questions_nav_link': questions_nav_link }
        }
      }
    }
  },
  mounted() {
    
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
