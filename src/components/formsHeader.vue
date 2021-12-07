<template>
  <!-- formsHeader with eui class -->
  <formsHeader class="doc-mast header" role="banner">
  <div id="earthdata-tophat2"></div>
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo">
        <h1>
          <img alt="NASA logo" class="logo" src="../assets/nasa-logo.svg"/>
          <span id="title" v-if="formTitle">{{formTitle}}</span>
          <span id="title" v-else-if="this.$route.path.match(/daacs/g)">Earthdata Publication Forms</span>
          <span id="title" v-else-if="this.$route.path.match(/interest/g)">Data Accession Request&nbsp;<span v-if="this.$testing">(TESTING MODE)</span></span>
          <span id="title" v-else-if="this.$route.path.match(/questions/g)">Data Publication Request&nbsp;<span v-if="this.$testing">(TESTING MODE)</span></span>
        </h1>
        <div id="nav">
          <span v-if="this.$route.path.match(/daacs/g)" @click="compareDataAskLeave('daacs')">
            <a id="daacs_nav_link" alt="go the EDPub Group Selection" title="go the EDPub Group Selection">DAACS</a> |
          </span>
          <span v-if="this.$route.path.match(/questions/g)">
            <a @click="goToComponent('formsQuestions')" id="questions_nav_link" alt="go the EDPub Questions" title="go the EDPub Questions">Questions</a>  | 
          </span>
          <span><a @click="compareDataAskLeave('dashboard')" alt="go the EDPub Dashboard" title="go the EDPub Dashboard">Dashboard</a>  | </span>
          <span><a @click="compareDataAskLeave('overview')" alt="go the EDPub Overview Pages" title="go the EDPub Overview Pages">Overview</a>  | </span>
          <span><a href="https://app.smartsheet.com/b/form/4978cb9677ad4198a96afd40102e9f2d" target="_blank" alt="go the EDPub Overview Pages" title="go the EDPub Feedback Page">Feedback</a></span>
        </div>
        <!-- End of Logo and menu -->
      </div>
    </div>
  </formsHeader>
  <!-- end of formsHeader with eui class -->
</template>
<script>
// Jquery javascript
import $ from "jquery";
// Exports the formsHeader as a component
export default {
  name: "formsHeader",
  data() {
    return {
      daac: "",
      showDaacs: '',
      formId:'',
      requestId: ''
    };
  },
  // The property to be set by formsQuestions.vue
  props: {
    // The formsHeader
    formTitle: { default: "", type: String },
  },
  computed: {
    
  },
  // Here we are watching showDaacs for changes to then perform show hide on daac link and redirect to questions
  watch: {
    showDaacs: function(val) {
      if (val == "false" || val == false) {
        let form = this.getForm()
        let form_name_prefix = this.getFormNamePrefix();
        let params = {}
        if(typeof this.formId != "undefined"){
          params['formId'] = this.formId
        }
        if(typeof this.requestId != "undefined"){
          params['requestId'] = this.requestId
        }
        if(typeof this.group != "undefined"){
          params['group'] = this.daac
        }
        if(typeof this.showDaacs != "undefined"){
          params['showDaacs'] = this.showDaacs
        }
        if (form.toLowerCase().match(/interest/g)){
          this.$router.push({
            name: `${form_name_prefix}Questions`,
            params: params
          });
        }
      }
    }
  },
  created() {
   
  },
  methods: {
    // @vuese
    // Changes location 
    changeLocation(comp) {
      if (comp.match(/help/g) || comp.match(/daacs/g)){
          this.goToComponent(comp)
        } else if (comp.match(/dashboard/g)){
          location.href=`${process.env.VUE_APP_DASHBOARD_ROOT}`
        } else if (comp.match(/overview/g)){
          location.href=`${process.env.VUE_APP_OVERVIEW_ROOT}`
        } else if (comp.match(/feedback/g)){
          location.href=`${process.env.VUE_APP_OVERVIEW_ROOT}/feedback`
        }
    },
    // @vuese
    // Sorts the current value data and saved data, compares for any differences.  If there are differences, ask user to save before continuing to switch components or leaving
    compareDataAskLeave(comp){
      if((typeof window.questionsComponent != 'undefined' && typeof window.questionsComponent.values != 'undefined' && Object.keys(window.questionsComponent.values).length > 0)) {
        if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "" && 
          (this.$store.state.global_params['requestId'] != '' && typeof this.$store.state.global_params['requestId'] !== 'undefined')) {
          $.getJSON(
          `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_REQUEST_URL}/${this.$store.state.global_params['requestId']}`,
          (answers) => {
            if(!answers.error){
                if(!this.object_equals(answers.form_data, window.questionsComponent.values)){
                this.$bvModal
                  .msgBoxConfirm(
                    `You are navigating away from this form. You will lose any unsaved data. Are you sure you want to continue?`,
                    {
                      title: "Please Confirm",
                      size: "lg",
                      buttonSize: "sm",
                      okVariant: "danger",
                      okTitle: "YES",
                      cancelTitle: "NO",
                      footerClass: "p-2",
                      hideformsHeaderClose: false,
                      centered: true,
                    }
                  )
                  .then((value) => {
                    if (value){
                      this.changeLocation(comp)
                    }
                  });
              } else {
                this.changeLocation(comp)
              }
            }
          })
        } 
        else if ((typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "") && 
          (typeof window.questionsComponent != 'undefined' && typeof window.questionsComponent.values != 'undefined' && Object.keys(window.questionsComponent.values).length > 0)){
          this.$bvModal
          .msgBoxConfirm(
            `You are navigating away from this form. You will lose any unsaved data. Are you you sure you want to continue?`,
            {
              title: "Please Confirm",
              size: "lg",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "YES",
              cancelTitle: "NO",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            }
          )
          .then((value) => {
            if (value){
              this.changeLocation(comp)
            }
          });
        }  
        else {
          this.changeLocation(comp)
        }
      } else {
        this.changeLocation(comp)
      }
    },
    // @vuese
    // Go the component page specified with all the params needed
    // @comp - component to switch too (string)
    goToComponent(comp){
      let form, prefix, formId, requestId, group, showDaacs;
      form = this.getForm();
      if(typeof this.$store === 'undefined'){
        prefix = this.getFormNamePrefix();
        formId = undefined;
        requestId = undefined;
        group = undefined;
        showDaacs = undefined;
      } else {
        prefix = this.$store.state.global_params['form_name_prefix'];
        if(typeof this.$store.state.global_params['form'] == 'undefined'){
          form = this.getForm();
          this.$store.commit("pushGlobalParams", ['form',`${form}`]);
        }
        if(typeof prefix == 'undefined'){
          prefix = this.getFormNamePrefix();
          this.$store.commit("pushGlobalParams", ['form_name_prefix',`${prefix}`]);
        }
        group = this.$store.state.global_params['group'];
        if(typeof group == 'undefined' && form.match(/interest/g)){
          group = 'selection'
          this.$store.commit("pushGlobalParams", ['group',`${group}`]);
        }
        showDaacs = this.$store.state.global_params['showDaacs'];
        if(typeof showDaacs == 'undefined' && form.match(/interest/g)){
          showDaacs = true
          this.$store.commit("pushGlobalParams", ['showDaacs',`${showDaacs}`]);
        }
        formId = this.$store.state.global_params['formId'];
        if(typeof formId == 'undefined'){
          // console.error('formID is undefined (formsHeader)')
        }
        requestId = this.$store.state.global_params['requestId'];
      }
      this.setActiveNav(comp.toLowerCase());
      if(this.$router.history.current.path != `/${form}/${comp.toLowerCase()}/${group}`){
        this.$router.push({
          name: `${prefix}${this.titleCase(comp)}`,
          path: `/${form}/${comp.toLowerCase()}/${group}`,
          params: {
            formId: formId,
            requestId: requestId,
            group: group,
            showDaacs: showDaacs
          }
        });
      }
    }
  },
  // This is equivalent to document.ready
  mounted() {
    window.headerComponent = this;
    this.daac = this.setDaacs()
    this.setRoute()
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['formId'] != 'undefined'){
      this.formId = this.$store.state.global_params['formId']
    }
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['requestId'] != 'undefined'){
      this.requestId = this.$store.state.global_params['requestId']
    }
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['group'] != 'undefined'){
      this.daac = this.$store.state.global_params['group']
    }
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['showDaacs'] != 'undefined'){
      this.showDaacs = this.$store.state.global_params['showDaacs']
    }
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
  .formsHeader {
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