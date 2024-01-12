<template>
  <!-- FormsHeader with eui class -->
  <div class="doc-mast header" role="banner">
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo" role="heading" aria-level="2">
        <h1>
          <img alt="NASA logo" class="logo" src="../assets/nasa-logo.svg" />
          <span id="title">{{ $store.state.global_params['formTitle'] }}&nbsp;<span v-if="this.$testing">(TESTING
              MODE)</span>
          </span>
        </h1>
        <div id="nav">
          <span v-if="this.$route.path.match(/daacs/g)" @click="compareDataAskLeave('daacs')">
            <a id="daacs_nav_link" alt="go EDPub DAAC Selection" title="go EDPub DAAC Selection">DAAC Selection</a> |
          </span>
          <span v-if="this.$route.path.match(/questions/g)">
            <a id="questions_nav_link" alt="go EDPub Questions" title="go EDPub Questions">Questions</a> |
          </span>
          <span v-if="this.$route.path.match(/questions/g)"><a @click="compareDataAskLeave('dashboard')"
              alt="go EDPub Dashboard" title="go EDPub Dashboard">Dashboard</a> | </span>
          <span v-else><a :href=dashboardRoot alt="go EDPub Dashboard" title="go EDPub Dashboard">Dashboard</a> | </span>
          <span v-if="this.$route.path.match(/questions/g)"><a @click="compareDataAskLeave('overview')"
              alt="go EDPub Overview Pages" title="go EDPub Overview Pages">Overview</a></span>
          <span v-else><a :href=overviewRoot alt="go EDPub Overview Pages"
              title="go EDPub Overview Pages">Overview</a></span>
        </div>
        <!-- End of Logo and menu -->
      </div>
    </div>
  </div>
  <!-- end of FormsHeader with eui class -->
</template>
<script src="../assets/js/FormsHeader.js"></script>
<style scoped src="../assets/css/FormsHeader.css"></style>