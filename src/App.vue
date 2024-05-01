<!-- eslint-disable max-len -->
<template>
  <!-- Main App -->
  <div id="app">
    <div class="loading" id="loading">
      <div class="spinner"></div>
    </div>
    <TimeoutWarning />
    <FormsHeader ref="header" />
    <router-view ref="content" />
    <go-top id="go_top" bg-color="#ebebeb" fg-color="#323232" :has-outline="true" radius="3%"
      aria-label="go to top button" role="contentinfo"></go-top>
    <noscript>
      <strong>We're sorry but earthdata-pub-forms pages will not work properly without JavaScript enabled. Please enable
        it to continue.</strong>
    </noscript>
    <FormsFooter ref="footer" />
  </div>
</template>
<!-- End of Main App -->
<script>
// Imports FormsHeader and FormsFooter as components.
// Vue files that are not routes should go in components.
// Add this to know how to import as such
import GoTop from '@inotom/vue-go-top';
import FormsFooter from '@/components/FormsFooter';
import FormsHeader from '@/components/FormsHeader';
import TimeoutWarning from '@/components/TimeoutWarning';

export default {
  name: 'app',
  metaInfo: {
    title: 'Earthdata Pub Forms',
    htmlAttrs: {
      reptilian: 'gator'
    },
    headAttrs: {
      nest: 'eggs'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'gator' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  computed: {

  },
  data() {
    return {
    };
  },
  props: {

  },
  components: {
    FormsFooter,
    FormsHeader,
    GoTop,
    TimeoutWarning
  },
  beforeMount() {
    this.checkAuth();
    if (!window.location.href.match(/daacs/g)) {
      if (this.$route.params.requestId || this.$testing) {
        if (this.$testing) {
          // The Data Publication Form has a third contact person
          const jsonName = 'data_accession_request';
          // const jsonName = 'data_publication_request'
          this.$store.commit('pushGlobalParams', ['formTitle', 'Testing Title']);
          this.$store.commit('pushGlobalParams', ['formShortName', jsonName]);
          this.$store.commit('pushGlobalParams', ['requestId', '20e78804-c171-4549-bdab-6c7cf8e0fc72']);
          this.$store.commit('pushGlobalParams', ['group', '15df4fda-ed0d-417f-9124-558fb5e5b561']);
        } else {
          this.$store.commit('pushGlobalParams', ['requestId', `${this.$route.params.requestId}`]);
        }
      } else if (typeof this.$route.query.token === 'undefined') {
        this.showHideForms('hide');
        this.redirectNotification(this.$bvModal, '', 'submit', false, 'Forms require a Request Id');
      }
    } else if (this.$route.query.requestId) {
      this.$store.commit('pushGlobalParams', ['formTitle', 'Earthdata Publication Forms ']);
      this.$store.commit('pushGlobalParams', ['requestId', `${this.$route.query.requestId}`]);
      this.getIDs();
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  }
};
</script>
<style>
/* loader */
.spinner {
  width: 40px;
  height: 40px;
  background-color: #8C8C8C;
  -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
  animation: sk-rotateplane 1.2s infinite ease-in-out;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading {
  background-color: #fff;
  height: 100%;
  width: 100%;
  z-index: 1000;
  position: absolute;
}

@-webkit-keyframes sk-rotateplane {
  0% {
    -webkit-transform: perspective(120px)
  }

  50% {
    -webkit-transform: perspective(120px) rotateY(180deg)
  }

  100% {
    -webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg)
  }
}

@keyframes sk-rotateplane {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
  }

  50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
  }

  100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}

h1.header {
  /*width:1073px!important;*/
  margin-left: 5px;
}

.nav,
.header,
div#nav,
.eui-application-logo {
  /* padding-left: 8px; */
}

.vue-fixed-header {
  background-color: rgb(235, 235, 235);
  border: 1px solid darkgrey;
}

.form-group,
.form-section {
  border-color: white;
  border-radius: 5px !important;
  border-style: solid !important;
  border-width: 1px !important;
  padding-top: 8px !important;
  padding-left: 5px !important;
  padding-bottom: 5px !important;
  padding-right: 5px !important;
}

.form-section {
  /*min-width: 1115px;*/
}

.hidden {
  display: none;
}

.custom-control-label {
  margin-top: 5.5px;
}

.editable-table {
  margin-top: 3rem;
}

footer {
  background-color: #2276ac;
}

.editable-table .data-cell {
  min-height: 2rem;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #cac8c8;
}

.single-column td,
.single-column th:first-child {
  width: 80%
}

a {
  cursor: pointer;
}

.form-control {
  border-radius: 5px;
  height: unset;
}

.same-as-html5 {
  border-radius: 5px !important;
  list-style-type: none;
}

input,
textarea {
  margin: unset !important;
}

textarea {
  padding-left: 8px !important;
}

#go_top {
  max-width: 50px;
  max-height: 50px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

.form-group {
  margin-top: .5rem;
  /*min-width: 1110px;*/
  margin-left: -10px
}

a:hover {
  text-decoration: underline !important;
}

div.row {
  margin: 0rem;
}

.checkboxes {
  display: -webkit-box;
  display: inline-flex !important;
  margin-right: -8px !important;
}

.custom-radio.b-custom-control-lg,
.input-group-lg .custom-radio {
  font-size: unset !important;
}

.custom-checkbox.b-custom-control-lg,
.input-group-lg .custom-checkbox {
  min-height: 1.75rem;
}

h2 {
  border-bottom: 1px solid #cbcbcb;
  padding-bottom: 0.2em;
  font-size: 1.6em;
  font-weight: normal;
  /*min-width: 1109px;
        max-width: 1109px; */
  padding-left: 6px;
  margin-left: -10px;
}

input[type=radio]:not(old)+label {
  cursor: pointer;
  padding-top: 4px;
}

.custom-file-label,
.custom-file-input~.custom-file-label[data-browse]::after {
  height: unset;
}

/* eui overrides  */
.eui-link {
  cursor: pointer;
}

.eui-btn--green,
.eui-btn--green:disabled:hover {
  background-color: #158749 !important;
}

.eui-btn--green:hover,
footer button.btn-primary:hover {
  background-color: #12713d !important;
}

.eui-btn--red,
.eui-btn--red:disabled:hover {
  background-color: #DB1400;
}

.eui-btn--red:hover {
  background-color: #c21200 !important;
}

.btn:disabled,
.btn.disabled {
  cursor: not-allowed;
}

.eui-btn--blue,
.eui-btn--blue.disabled:hover {
  background-color: #2275AA;
}

.eui-btn--blue:hover {
  background-color: #2c3e50;
}

.modal-footer,
.modal-header {
  background-color: #ebebeb !important;
}

.eui-btn--green,
.eui-btn--green:disabled:hover {
  background-color: #158749 !important;
}

.eui-btn--green:hover,
footer button.btn-primary:hover {
  background-color: #12713d !important;
}

footer button.btn-primary {
  background-color: #158749;
  color: white;
}

#undo_button.disabled,
#redo_button.disabled {
  background-color: #6c757d;
}

.btn.eui-btn--red.btn-secondary:hover,
.btn.eui-btn--red.btn-secondary:active,
.btn.eui-btn--red.btn-secondary:focus,
.btn.eui-btn--red.btn-secondary:visited,
.eui-btn--red.btn-secondary:disabled {
  background-color: #d62c1a;
}

.btn.eui-btn--blue.btn-secondary:hover,
.btn.eui-btn--blue.btn-secondary:active,
.btn.eui-btn--blue.btn-secondary:focus,
.btn.eui-btn--blue.btn-secondary:visited,
.eui-btn--blue.btn-secondary:disabled {
  background-color: #1a5981;
}

.btn.eui-btn--green.btn-secondary:hover,
.btn.eui-btn--green.btn-secondary:active,
.btn.eui-btn--green.btn-secondary:focus,
.btn.eui-btn--green.btn-secondary:visited,
.eui-btn--green.btn-secondary:disabled {
  background-color: #1baf5e;
}

/* ******************* */
/* footer styling */
footer {
  background: #2276ac;
  color: white;
  padding: 1em 2em;
  /* box-shadow: 0 50vh 0 50vh #000; */
}

footer a:link,
footer a:visited {
  color: white;
}

footer ul {
  margin: 0.25em 0;
  padding: 0;
}

footer ul li {
  display: inline;
}

footer ul li:not(:first-child):before {
  content: "\b7";
  margin: 0 0.5em;
}

footer .badge {
  background-color: #2c3e50;
  position: relative;
  top: -2px;
}

#daacs-container,
#questions_form {
  min-height: 1240px;
}

.modal-open {
  padding-right: unset !important;
  overflow: unset !important;
}

@media (max-width: 767px) {

  .bbox {
    min-width: unset !important;
    max-width: unset !important;
  }

  button {
    font-size: larger !important;
  }

  #draft_data,
  #save_data {
    width: 213px;
  }

  #title {
    vertical-align: unset !important;
    line-height: unset !important;
    font-size: calc(1.5rem + 1vw);
  }

  #earthdata-tophat2 .th-fbm-link-container {
    margin: 0px 0 0;
  }

  img.logo {
    max-width: 25% !important;
  }

  #product_temporal_coverage_start_button,
  #product_temporal_coverage_end_button {
    display: none
  }

  #product_temporal_coverage_start,
  #product_temporal_coverage_end {
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
  }
}

@media (max-width: 767px) {
  button {
    font-size: unset !important;
  }

  #draft_data,
  #save_data {
    width: unset !important;
  }

  #undo_button,
  #redo_button {
    width: unset !important;
  }
}

@media (max-width: 333px) {

  #draft_data,
  #save_data {
    width: 213px !important;
  }
}

@media (min-width: 500px) {
  .bbox {
    min-width: 80px !important;
    max-width: 80px !important;
  }
}

@media (min-width: 768px) {
  #title {
    line-height: 90px;
    vertical-align: bottom !important;
  }
}

@media (min-width: 390px) {

  #product_temporal_coverage_start_button,
  #product_temporal_coverage_end_button {
    display: unset !important
  }

  #product_temporal_coverage_start,
  #product_temporal_coverage_end {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }
}

@media (max-width: 684px) {

  #undo_button,
  #redo_button {
    width: 85px !important;
  }
}

#earthdata-tophat2 .th-status-link-container,
#earthdata-tophat2 .th-help-link-container,
#earthdata-tophat2 .th-fbm-link-container {
  height: unset !important
}

#undo_button,
#redo_button {
  width: 85px;
}
</style>
