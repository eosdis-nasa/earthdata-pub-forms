<template>
  <!-- FormsHeader with eui class -->
  <div class="doc-mast header .header" role="banner">
    <div id="earthdata-tophat2"></div>
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo">
        <h1>
          <img alt="NASA logo" class="logo" src="../assets/nasa-logo.svg"/>
          <span id="title">{{$store.state.global_params['formTitle']}}&nbsp;<span v-if="this.$testing">(TESTING MODE)</span>
          </span>
        </h1>
        <div id="nav">
          <span v-if="this.$route.path.match(/daacs/g)" @click="compareDataAskLeave('daacs')">
            <a id="daacs_nav_link" alt="go the EDPub Group Selection" title="go the EDPub Group Selection">DAACS</a> |
          </span>
          <span v-if="this.$route.path.match(/questions/g)">
            <a @click="goToComponent('FormsQuestions')" id="questions_nav_link" alt="go the EDPub Questions" title="go the EDPub Questions">Questions</a>  | 
          </span>
          <span><a @click="compareDataAskLeave('dashboard')" alt="go the EDPub Dashboard" title="go the EDPub Dashboard">Dashboard</a>  | </span>
          <span><a @click="compareDataAskLeave('overview')" alt="go the EDPub Overview Pages" title="go the EDPub Overview Pages">Overview</a>  | </span>
          <span>
            <a href="https://app.smartsheet.com/b/form/4978cb9677ad4198a96afd40102e9f2d" target="_blank" alt="go the EDPub Overview Pages" title="go the EDPub Feedback Page">Feedback
            <font-awesome-icon icon="external-link-alt" name="external link">external link</font-awesome-icon></a>&nbsp;
          </span>
        </div>
        <!-- End of Logo and menu -->
      </div>
    </div>
  </div>
  <!-- end of FormsHeader with eui class -->
</template>
<script>
// Jquery javascript
import $ from "jquery";
// Exports the FormsHeader as a component
export default {
  name: "FormsHeader",
  data() {
    return {
      daac: "",
      formId:'',
      requestId: ''
    };
  },
  // The property to be set by FormsQuestions.vue
  props: {
    
  },
  computed: {

  },
  // Here we are watching showDaacs for changes to then perform show hide on daac link and redirect to questions
  watch: {
    
  },
  created() {
   
  },
  methods: {
    
  },
  // This is equivalent to document.ready
  mounted() {
    window.headerComponent = this;
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
  }
};
</script>
<style scoped>
  #nav {
    padding: 5px;
    text-align:right;
    padding-bottom: 1.75rem;
  }
  #nav a {
    color:white;
  }
  #nav a.router-link-exact-active {
    font-weight: bold;
    text-decoration:underline;
  }
  img.logo {
    margin-top: 1rem;
    border:unset;
    padding:unset!important;
  }
  h1 {
    margin: 0.25em 0 0.67em 0;
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
</style>