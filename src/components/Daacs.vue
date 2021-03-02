<template>
<div role="main">
  <!-- Form -->
  <b-form name="daacs_form" @submit="enterSubmitForm" id="daac-selection">
    <b-container name="daacs-container">
      <div>
        <b-form-group name="form-group" id="form-group" label="Choose your DAAC:">
          <br />
          <!-- Radio Div with Description -->
          <div>
            <div class="desc_div" v-if="selected" id="selected_description"></div>
            <div class="radio_div">
              <b-form-radio
                v-for="(item, index) in daacs"
                :key="index"
                :name="item.short_name.replace(' ', '_')"
                :id="`${item.id}`"
                :value="item.long_name"
                @click="setSelectedValues(item.url, item.id, item.short_name, item.long_name, item.description)"
                v-model="selected"
              >{{ item.short_name }}</b-form-radio>
            </div>
          </div>
          <!-- End of Radio Div with Description -->
          <!-- Selected Info -->
          <div style="clear:both">
            <div class="mt-3" v-if="selected && selected !== 'I don\'t know'">
              You have selected:
              <br />
              <strong>{{ selected }}</strong>
            </div>
            <div class="mt-3" v-if="selected && selected !== 'I don\'t know'">
              For more information, visit
              <a href="#" id="selected_daac_link" target="_blank">
                <span id="selected_daac"></span>'s website
                <font-awesome-icon icon="external-link-alt" name="external link">external link</font-awesome-icon>
              </a>
            </div>
            <!-- Submit Button -->
            <div v-if="selected">
              <b-button class="eui-btn--green" @click="submitForm()" aria-label="select button" id="daac_select_button">Select</b-button>
            </div>
            <!-- End of Submit Button -->
          </div>
          <!-- End of Selected Info -->
        </b-form-group>
      </div>
    </b-container>
  </b-form>
  <!-- End of Form -->
  </div>
</template>
<script>
// Jquery javascript
import $ from "jquery";

// This Daacs component gets DAAC data and displays abbreviations as a radio selection
// On selection displays a link to the selected DAAC website, description and a 'Select
// Button' is displayed to allow users more info and to move on.
export default {
  name: "Daacs",
  data() {
    return {
      selected: "",
      loaded: false,
      daacs: [],
      formId: '',
      requestId: ''
    };
  },
  props: {},
  computed: {},
  validations: {},
  watch: {
    loaded: function(val) {
      setTimeout(() => {
        if (val) {
          this.GetCurrentDaacAndUpdate();
        }
      }, 1);
    },
    selected: function() {
      setTimeout(() => {
        this.setSelectedValues();
      }, 1);
    }
  },
  mounted() {
    window.daacsComponent = this;
    console.log('DAACS MOUNTED')
    this.setActiveNav("daacs");
    // You are at the point when you are clicking links, you will have to see about setting params for the header clicking -> questions is wrong
    this.fetchDaacs().then(() => {
      if(typeof this.$store.state.global_params['group'] != 'undefined'){
        let daacData = this.getDaac(this.$store.state.global_params['group'])
        if(typeof daacData == 'undefined'){
          console.log(JSON.stringify(daacData))
        }
        this.selected = daacData.long_name;
      }
    });
    if(typeof this.$store.state.global_params['formId'] != 'undefined'){
      this.formId = this.$store.state.global_params['formId']
    }
    if(typeof this.$store.state.global_params['requestId'] != 'undefined'){
      this.requestId = this.$store.state.global_params['requestId']
    }
    //console.log(`DAACS formId: ${this.formId}, requestId: ${this.requestId}, group: ${this.daac}, showDaacs: ${this.showDaacs}`)
  },
  methods: {
    // @vuese
    // Fetchs the DAAC data
    async fetchDaacs() {
      return new Promise((resolve) => {
        // Gets DAAC data for template
        var items = [];
        $.ajaxSetup({
          headers : {
            'Authorization' : `Bearer ${localStorage.getItem('auth-token')}`,
          }
        });
        // TESTING ONLY
        //$.getJSON("../daacs.json", daacs => {
        $.getJSON(`${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_DAACS_URL}`, ( daacs ) => {
          for (var dict in daacs) {
            items.push(daacs[dict]);
          }
          this.daacs = items
          resolve(items);
        });
      })
    },
    // @vuese
    // Fetchs DAAC specific data
    getDaac(daac_specific) {
      // Gets DAAC data for template
      if (typeof daac_specific === "undefined") {
        return { id: "", short_name: "", long_name: "", url: "", description: "" };
      }
      for (var dict in this.daacs) {
        let id = this.daacs[dict]["id"];
        let long_name = this.daacs[dict]["long_name"];
        let short_name = this.daacs[dict]["short_name"];
        if (
          daac_specific.toLowerCase() === long_name.toLowerCase() ||
          daac_specific.toLowerCase() === short_name.toLowerCase() ||
          daac_specific === id
        ) {
          let url = this.daacs[dict]["url"];
          let description = this.daacs[dict]["description"];
          return {
            id:id,
            short_name: short_name,
            long_name: long_name,
            url: url,
            description: description
          };
        }
      }
    },
    // @vuese
    // On selected, sets current daac objects from values
    setCurrentDaacObjects(
      current_daac,
      url,
      id,
      short_name,
      long_name,
      description
    ) {
      var daac_specific_data;
      if (
        typeof url == "undefined" ||
        typeof id == "undefined" ||
        typeof short_name == "undefined" ||
        typeof long_name == "undefined" ||
        typeof description == "undefined"
      ) {
        daac_specific_data = this.getDaac(current_daac);
      }
      if (typeof url == "undefined") {
        url = daac_specific_data["url"];
      }
      if (typeof id == "undefined") {
        id = daac_specific_data["id"];
      }
      if (typeof short_name == "undefined") {
        short_name = daac_specific_data["short_name"];
      }
      if (typeof long_name == "undefined") {
        long_name = daac_specific_data["long_name"];
      }
      if (typeof description == "undefined") {
        description = daac_specific_data["description"];
      }
      $("#selected_daac").html(short_name.toUpperCase());
      $("#selected_daac_link").attr("href", url);
      $("#selected_description").html(description);
      this.setActiveNav("daacs");
      this.selected = long_name;
      this.data = short_name;
      return [short_name, id];
    },
    // @vuese
    // On selected, builds dynamic text and sets html dynamically with the link
    setSelectedValues(url, id, short_name, long_name, description) {
      let current = this.setCurrentDaacObjects(
        this.selected,
        url,
        id,
        short_name,
        long_name,
        description
      );
      short_name = current[0]
      id = current[1]
      if (
        typeof this.$store.state.global_params['group'] != "undefined" &&
        this.$store.state.global_params['group'] != null
      ) {
        let current = this.setCurrentDaacObjects(
          this.selected,
          url,
          id,
          short_name,
          long_name,
          description
        );
        id = current[1]
        this.$store.state.global_params['group'] = id
      }
      this.setActiveLocationWithoutReload(location.href, id);
      this.setSaveObject(short_name, id);
      return short_name;
    },
    // @vuese
    // @arg The event
    enterSubmitForm(evt) {
      // Calls submit form via enter key
      evt.preventDefault();
      if (this.enterSubmit) {
        this.submitForm();
      }
    },
    // @vuese
    // Used to submit the form data if valid
    submitForm() {
      // Submit form (this.selected) if valid
      this.$v.$touch();
      let args = {}
      if (this.$store.state.global_params['formId'] != ''){
        args['formId'] = this.$store.state.global_params['formId']
      }
      if (this.$store.state.global_params['requestId'] != ''){
        args['requestId'] = this.$store.state.global_params['requestId']
      }
      if (this.$store.state.global_params['group'] != "") {
        args['group'] = this.$store.state.global_params['group']
        this.$router.push({
          name: "Data Publication Request - Questions",
          params: { args }
        });
      } else {
        args['group'] = 'selection'
        this.$router.push({ name: "Data Publication Request - Daacs", params: args });
      }
    },
    // @vuese
    // Used to save file
    setSaveObject(short_name, id) {
      // Saves file to localStorage
      if (this.$store.state.global_params['group'] != "") {
        'setting storage'
        window.localStorage.setItem(
          "DAAC",
          `${id}`
        );
        window.headerComponent.daac = id
      }
    },
    // @vuese
    // Gets the current daac selected and updates
    GetCurrentDaacAndUpdate() {
      if (
        this.$store.state.global_params['group'] == "" &&
        !window.location.href.match(/daacs\/selection/g) &&
        (typeof this.$store.state.global_params['group'] == "undefined" ||
          this.$store.state.global_params['group'] == "")
      ) {
        history.replaceState(
          "updating href",
          window.document.title,
          `${window.location.href.toLowerCase()}daacs/selection`
        );
      }
      if (
        (this.$store.state.global_params['group'] != "undefined" &&
          this.$store.state.global_params['group'] != null &&
          this.$store.state.global_params['group'] != "" &&
          this.$store.state.global_params['group'] != "selection") ||
        window.localStorage.getItem("DAAC") != null
      ) {
        let default_daac;
        let selected;
        if (this.$store.state.global_params['group'] != "") {
          selected = this.getDaac(this.$store.state.global_params['group']);
        } else if (typeof this.$store.state.global_params['group'] != "undefined") {
          selected = this.getDaac(
            this.$store.state.global_params['group']
          );
        } else if (window.localStorage.getItem("DAAC") != null) {
          selected = this.getDaac(window.localStorage.getItem("DAAC"));
        }
        if (typeof selected != "undefined") {
          let id = selected["id"];
          default_daac = id;
          if (
            typeof default_daac != "undefined" &&
            default_daac != "" &&
            default_daac != "SELECTION"
          ) {
            if ($(`label[for^='${default_daac}']`)) {
              $(`label[for^='${default_daac}']`).click();
            }
          }
        }
      }
      this.setActiveNav("daacs");
    }
  }
};
</script>
<style scoped>
  #daac_select_button {
    margin-top:2rem;
  }
  .form-group {
    margin-top:2rem;
  }
  #selected_daac, .external-link-alt, #selected_daac_link {
    color: #2275AA;
  }
  .radio_div {
    width: 25%;
    float: left;
    margin-bottom: 1rem;
  }
  .desc_div {
    width: 75%;
    float: right;
  }
  .button_div {
    margin-top: 1rem;
    text-align: left;
    float: left;
  }
  .radio_div {
    width: 25%;
    float: left;
  }
  .desc_div {
    width: 75%;
    float: right;
  }
</style>