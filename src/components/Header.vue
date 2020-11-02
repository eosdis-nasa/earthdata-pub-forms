<template>
  <!-- header with eui class -->
  <header class="doc-mast header" role="banner">
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo">
        <h1>
          <img alt="NASA logo" class="logo" src="../assets/nasa-logo.svg" />
          <span id="title" v-if="formTitle">{{formTitle}}</span>
          <span id="title" v-else-if="showDaacs">Earthdata Archive Interest Form</span>
          <span id="title" v-else>Earthdata Publication</span>
        </h1>
        <div id="nav">
          <span v-if="showDaacs">
            <router-link
              id="daacs_nav_link"
              v-if="daac !=='selection'"
              :to="{ name: 'Daacs', path: '/daacs', params: { default: daac }}"
            >DAACS</router-link>
            <div v-if="daac !== 'selection'" class="inline"> | </div>
            <router-link
              id="daacs_nav_link"
              v-if="daac =='selection'"
              :to="{ name: 'Daacs', path: '/daacs/selection' }"
            >DAACS</router-link>
            <div v-if="daac == 'selection'" class="inline"> | </div>
          </span>
          <router-link
            id="questions_nav_link"
            v-if="daac !=='selection'"
            :to="{ name: 'Questions', path: '/questions', params: { default: daac }}"
          >Questions</router-link>
          <div class="inline" v-if="daac !=='selection'"> | </div>
          <a
            id="questions_nav_link"
            v-if="daac =='selection'"
            href="#"
            @click="requireDaacSelection($event)"
          >Questions</a>
          <div class="inline" v-if="daac =='selection'" @click="requireDaacSelection()"> | </div>
          <router-link id="help_nav_link" :to="{ name: 'Help', path: '/help'}">Help</router-link>
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
      showDaacs: true,
      daac: "selection"
    };
  },
  // The property to be set by questions.vue
  props: {
    // The form title parsed from questions.vue
    formTitle: { default: "", type: String }
  },
  computed: {},
  // Here we are watching showDaacs for changes to then perform show hide on daac link and redirect to questions
  watch: {
    showDaacs: function(val) {
      if (val == "false") {
        this.$router.push({
          name: "Questions",
          params: { default: this.daac.toLowerCase() }
        });
      }
    }
  },
  created() {
    if (window.localStorage.getItem("DAAC") != null) {
      this.daac = window.localStorage.getItem("DAAC");
    } else {
      this.daac = "selection";
    }
    let parameters = this.$route;
    let showDaacs;
    if (typeof parameters != "undefined") {
      showDaacs = parameters.query["showDaacs"];
    }
    if (showDaacs) {
      this.showDaacs = showDaacs;
      window.localStorage.setItem("showDaacs", showDaacs);
    } else if (window.localStorage.getItem("showDaacs") != null) {
      this.showDaacs = Boolean(window.localStorage.getItem("showDaacs"));
    } else {
      window.localStorage.setItem("showDaacs", this.showDaacs);
    }
  },
  methods: {
    // @vuese
    // Re-applies the data entry values from values from the store for on undo and redo
    requireDaacSelection() {
      if (!location.href.match(/help/g)) {
        alert("Please select a daac to continue.");
        event.preventDefault();
        return false;
      } else {
        window.location.href = "/daacs/selection";
      }
      return true;
    }
  },
  mounted() {
    window.headerComponent = this;
  }
};
</script>
<style scoped>
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