<template>
  <!-- header with eui class -->
  <header class="doc-mast header" role="banner">
  <div id="earthdata-tophat2"></div>
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo">
        <h1>
          <img alt="NASA logo" class="logo" src="../assets/nasa-logo.svg" />
          <span id="title" v-if="formTitle">{{formTitle}}</span>
          <span id="title" v-else-if="showDaacs && getTitleFromLocation().toLowerCase().match(/interest/g)">Data Publication Request Form</span>
          <span id="title" v-else-if="getTitleFromLocation().toLowerCase().match(/questionnaire/g)">Data Product Information</span>
          <span id="title" v-else>Earthdata Publication</span>
        </h1>
        <div id="nav">
          <!-- if show daacs -->
          <span v-if="showDaacs">
            <!-------------------- DAACS ---------------------->
            <!-- if daac is set -->
            <router-link
              id="daacs_nav_link"
              v-if="daac !=='selection' && daac !== ''"
              :to="{ name: 'Data Publication Request - Daacs', path: '/interest/daacs', params: { group: daac }}"
            >DAACS</router-link>
            <!-- if daac is not set and not 'selection' -->
            <router-link
              id="daacs_nav_link"
              v-else-if="daac !=='selection'"
              :to="{ name: 'Data Publication Request - Daacs', path: '/interest/daacs', params: { group: 'selection' }}"
            >DAACS</router-link>
            <!-- if daac is 'selection' -->
            <router-link
              id="daacs_nav_link"
              v-else
              :to="{ name: 'Data Publication Request - Daacs', path: '/interest/daacs/selection', params: { group: 'selection' } }"
            >DAACS</router-link>
            <!-- daac divider -->
            <div class="inline">  |  </div>
            <!-------------------- QUESTIONS ---------------------->
            <!-- if daac is set -->
            <router-link
              id="questions_nav_link"
              v-if="daac !=='selection' && daac !== ''"
              :to="{ name: 'Data Publication Request - Questions', path: '/interest/questions', params: { group: daac }}"
            >Questions</router-link>
            <!-- if daac is not set -->
            <a
              id="questions_nav_link"
              v-else-if="daac =='selection' || daac == ''"
              href="#"
              @click="requireDaacSelection($event)"
            >Questions</a>
            <div class="inline" v-if="daac =='selection' || daac ==''" @click="requireDaacSelection()">  |  </div>
            <!-- question divider divider -->
            <div class="inline" v-else>  |  </div>
            <!-------------------- HELP ---------------------->
            <router-link id="help_nav_link" :to="{ name: 'Data Publication Request - Help', path: '/interest/help' }">Help</router-link>
          </span>
          <!-- if daacs hidden -->
          <span v-else>
            <!-- if questionnaire and daac known -->
            <router-link
              id="questions_nav_link"
              v-if="daac !== ''"
              :to="{ name: 'Data Product Information - Questions', path: '/questionnaire/questions', params: { group: daac }}"
            >Questions</router-link>
            <!-- if questionnaire and daac unknown --> 
            <router-link
              id="questions_nav_link"
              v-else-if="daac =='selection' || daac == ''"
              :to="{ name: 'Data Product Information - Questions', path: '/questionnaire/questions'}"
            >Questions</router-link>
            <div class="inline" >  |  </div>
            <!-- from questionnaire help -->
            <router-link id="help_nav_link" :to="{ name: 'Data Product Information - Help', path: '/questionnaire/help' }">Help</router-link>
          </span>
        </div>
        <!-- End of Logo and menu -->
      </div>
    </div>
  </header>
  <!-- end of header with eui class -->
</template>
<script>
// Jquery javascript
//import $ from 'jquery'

// Exports the header as a component
export default {
  name: "Header",
  data() {
    return {
      daac: "selection",
      showDaacs: ''
    };
  },
  // The property to be set by questions.vue
  props: {
    // The form title parsed from questions.vue
    formTitle: { default: "", type: String },
  },
  computed: {
    
  },
  // Here we are watching showDaacs for changes to then perform show hide on daac link and redirect to questions
  watch: {
    showDaacs: function(val) {
      if (val == "false" || val == false) {
        let form_components = this.getPath()
        let form = form_components[0]
        let form_name_prefix = form_components[1]
        if (form.toLowerCase().match(/interest/g)){
          this.$router.push({
            name: `${form_name_prefix}Questions`,
            params: { group: this.daac.toLowerCase() }
          });
        }
      }
    }
  },
  created() {
   
  },
  methods: {
    // @vuese
    // Get title of form from address bar location
    getTitleFromLocation(){
      let form_components = this.getPath()
      let form = form_components[0]
      return form
    },
    // @vuese
    // Re-applies the data entry values from values from the store for on undo and redo
    requireDaacSelection() {
      if (!location.href.match(/help/g)) {
        if(Object.keys(this.values).length > 0){
          this.$bvModal.msgBoxOk('Please select a daac to continue.', {
            title: 'No DAAC',
            size: 'sm',
            buttonSize: 'sm',
            okTitle: 'OK',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
          })
        }
        event.preventDefault();
        return false;
      } else {
        let form_components = this.getPath()
        let form = form_components[0] 
        window.location.href = `/${form}/daacs/selection`;
      }
      return true;
    }
  },
  mounted() {
    window.headerComponent = this;
    this.setShowDaacs()
    this.daac = this.setDaacs()
    this.resetRoute()
  }
};
</script>
<style scoped>
body {
  border-top: unset;
  padding: 0 0 0 0;
}
h1 {
  margin: 0.67em 0;
}
a {
  cursor: pointer;
}
a:hover {
  text-decoration: underline !important;
}
.inline {
  display: inline;
}
img {
  border: unset !important;
}
img.logo {
  margin-top: 1rem;
}
h1 {
  border-bottom: 1px solid #cbcbcb;
  padding-bottom: 0.2em;
  font-weight: 100;
  font-size: 2em;
}
.header {
  width: 100%;
  background: #2276ac;
  box-shadow: 0 5px 5px rgba(189, 195, 199, 0.15);
  display: flex;
  color: white;
}

#title {
  line-height: 90px;
  vertical-align: bottom;
}

@media screen and (max-width: 950px) {
  #title {
    line-height: inherit;
  }
  .eui-masthead-logo {
    width: 300px;
  }
  .eui-masthead-logo.eui-application-logo a:link,
  .eui-masthead-logo.eui-application-logo a:visited {
    height: inherit;
    overflow: inherit;
    padding: 23px 0 5px 70px;
    color: white;
    font-weight: 100;
    font-size: 0.8em;
  }

  .eui-masthead-logo h1 a:link {
    overflow: hidden;
    -webkit-transition: background-image 0.1s linear;
    -moz-transition: background-image 0.1s linear;
    transition: background-image 0.1s linear;
    width: 215px;
    height: 50px;
    display: inline-block;
    background-repeat: no-repeat;
  }
  .eui-masthead-logo {
    width: 350px;
    padding: 15px 0;
  }
  .eui-masthead-logo {
    padding: 0.5em 0;
  }
  .eui-masthead-logo {
    float: left;
    display: block;
    margin-right: 2.35765%;
    width: 65.88078%;
  }
  .eui-application-logo .logo {
    padding-top: 1rem;
    height: 100px;
  }
}
</style>