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
      requestId: '',
      showDaacs: ''
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
  // This is equivalent to document.ready
  mounted() {
    window.daacsComponent = this;
    this.setActiveNav("daacs");
    this.fetchDaacs().then(() => {
      if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['group'] != 'undefined'){
        let daacData = this.getDaac(this.$store.state.global_params['group'])
        if(typeof daacData!= 'undefined'){
          this.selected = daacData.long_name;
        }
      }
    });
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['formId'] != 'undefined'){
      this.formId = this.$store.state.global_params['formId']
    }
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['requestId'] != 'undefined'){
      this.requestId = this.$store.state.global_params['requestId']
    }
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['showDaacs'] != 'undefined'){
      this.showDaacs = this.$store.state.global_params['showDaacs']
    }
  },
  methods: {
    // @vuese
    // On selected, sets current daac objects from values
    // @current_daac - currently a hash
    // @url - daac url
    // @id - currently a hash
    // @short_name - string
    // @long_name - string
    // @description - string
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
    // @url - daac url
    // @id - currently a hash
    // @short_name - string
    // @long_name - string
    // @description - string
    setSelectedValues(url, id, short_name, long_name, description) {
      if (
        typeof this.$store !== 'undefined' && 
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
      this.setActiveLocationWithoutReload(id);
      window.headerComponent.daac = id
      return short_name;
    },
    // @vuese
    // @arg The event to prevent for checking validity first
    enterSubmitForm() {
      // Calls submit form via enter key
      if (this.enterSubmit) {
        this.submitForm();
      }
    },
    // @vuese
    // Used to submit the form data and move on to questions, if daac valid
    submitForm() {
      this.$v.$touch();
      let args = {}
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != ''){
        args['formId'] = this.$store.state.global_params['formId']
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['requestId'] != ''){
        args['requestId'] = this.$store.state.global_params['requestId']
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['group'] != "") {
        args['group'] = this.$store.state.global_params['group']
        this.$router.push({
          name: `${this.getFormNamePrefix()}Questions`,
          params: { args }
        });
      } else {
        args['group'] = 'selection'
        this.$router.push({ name: `${this.getFormNamePrefix()}Daacs`, params: args });
      }
    },
    // @vuese
    // Gets the current daac selected and updates
    GetCurrentDaacAndUpdate() {
      if (
        (typeof this.$store !== 'undefined' && 
        this.$store.state.global_params['group'] == "") &&
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
        (typeof this.$store !== 'undefined' && 
          this.$store.state.global_params['group'] != "undefined" &&
          this.$store.state.global_params['group'] != null &&
          this.$store.state.global_params['group'] != "" &&
          this.$store.state.global_params['group'] != "selection")
      ) {
        let default_daac;
        let selected;
        if (typeof this.$store !== 'undefined' && 
          (this.$store.state.global_params['group'] != "" ||
          typeof this.$store.state.global_params['group'] !== "undefined")) {
          selected = this.getDaac(this.$store.state.global_params['group']);
        } 
        if (typeof selected !== "undefined") {
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