<template>
  <!-- FormsHeader with eui class -->
  <div class="doc-mast header" role="banner">
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo" role="heading" aria-level="2">
        <h1>
          <img alt="NASA logo" class="logo" src="../assets/nasa-logo.svg"/>
          <span id="title">{{$store.state.global_params['formTitle']}}&nbsp;<span v-if="this.$testing">(TESTING MODE)</span>
          </span>
        </h1>
        <div id="nav">
          <span v-if="this.$route.path.match(/daacs/g)" @click="compareDataAskLeave('daacs')">
            <a id="daacs_nav_link" alt="go EDPub DAAC Selection" title="go EDPub DAAC Selection">DAAC Selection</a> |
          </span>
          <span v-if="this.$route.path.match(/questions/g)">
            <a id="questions_nav_link" alt="go EDPub Questions" title="go EDPub Questions">Questions</a>  | 
          </span>
          <span v-if="this.$route.path.match(/questions/g)"><a @click="compareDataAskLeave('dashboard')" alt="go EDPub Dashboard" title="go EDPub Dashboard">Dashboard</a>  | </span>
          <span v-else><a :href=dashboardRoot alt="go EDPub Dashboard" title="go EDPub Dashboard">Dashboard</a>  | </span>
          <span v-if="this.$route.path.match(/questions/g)"><a @click="compareDataAskLeave('overview')" alt="go EDPub Overview Pages" title="go EDPub Overview Pages">Overview</a></span>
          <span v-else><a :href=overviewRoot alt="go EDPub Overview Pages" title="go EDPub Overview Pages">Overview</a></span>
        </div>
        <!-- End of Logo and menu -->
      </div>
    </div>
  </div>
  <!-- end of FormsHeader with eui class -->
</template>
<script>
import mixin from "@/mixins/mixin.js";

// This is the header component that displays navigation links
// for the user and remains the same across all components.
export default {
  mixins: [mixin],
  name: "FormsHeader",
  data() {
    return {
      daac: "",
      formId:'',
      requestId: ''
    };
  },
  props: {
    
  },
  computed: {
    dashboardRoot () {
      return process.env.VUE_APP_DASHBOARD_ROOT
    },
    overviewRoot () {
      return process.env.VUE_APP_OVERVIEW_ROOT
    }
  },
  watch: {
    
  },
  created() {
   
  },
  mounted() {
    // @vuese
    // Sets the main route based on incoming query string, then saves them to the store.
    // This then sets local variables from the global_params
    window.headerComponent = this;
    if (!window.location.href.match(/daacs/g)) {
      this.getIDs().then(() => {
        this.setLocalVars()
      })
    } else {
      this.setLocalVars()
    }
  },
  methods: {
    setLocalVars(){
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
  }
};
</script>
<style scoped>
  #nav {
    padding: 5px;
    text-align:right;
    padding-bottom: 1.75rem;
    margin-right: 5px;
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