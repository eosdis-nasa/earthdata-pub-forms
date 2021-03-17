import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import Vuelidate from 'vuelidate'
import VueLogger from 'vuejs-logger';
import GoTop from '@inotom/vue-go-top';
import mixin from "./mixins/mixin";

const isProduction = process.env.NODE_ENV === 'production';

const logOptions = {
  isEnabled: true,
  logLevel : isProduction ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '-',
  showConsoleColors: true
};

// global prototypes for input
// Vue.prototype.$questions = {}
Vue.prototype.$required = {}
// Collection object of input prototypes
Vue.prototype.$input_object = {}

// global prototypes for output
Vue.prototype.$values = {}
Vue.prototype.$logging_object = {}
// Collection object of output prototypes
Vue.prototype.$output_object = {}

// Use simple logger
Vue.use(VueLogger, logOptions);
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(BootstrapVueIcons)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Optionally install vuelidatejs plugin
Vue.use(Vuelidate)
Vue.use(GoTop);

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
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

// Custom components
import Daacs from '@/components/Daacs.vue'
import Questions from '@/components/Questions.vue'
import Help from '@/components/Help.vue'
import PageNotFound from '@/components/PageNotFound.vue'

Vue.component('Daacs', Daacs);
Vue.component('PageNotFound', PageNotFound);
Vue.component('Questions', Questions);
Vue.component('Help', Help);

Vue.config.productionTip = false

Vue.mixin(mixin)

new Vue({
  router,
  store,

  created(){
  },

  mounted(){
  },

  render: h => h(App)
}).$mount('#app')
