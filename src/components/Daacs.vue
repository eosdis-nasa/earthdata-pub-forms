<template>
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
                :id="item.short_name.replace(' ', '_') + '_' + index"
                :value="item.long_name"
                @click="setSelectedValues(item.url, item.short_name, item.long_name, item.description)"
                v-model="selected"
              >{{ item.short_name }}</b-form-radio>
            </div>
          </div>
          <!-- End of Radio Div with Description -->
          <!-- Selected Info -->
          <div style="clear:both">
            <div class="mt-3" v-if="selected">
              You have selected:
              <br />
              <strong>{{ selected }}</strong>
            </div>
            <div class="mt-3" v-if="selected">
              For more information, visit
              <a href="#" id="selected_daac_link" target="_blank">
                <span id="selected_daac"></span>'s website
                <font-awesome-icon icon="external-link-alt">external link</font-awesome-icon>
              </a>
            </div>
            <!-- Submit Button -->
            <div v-if="selected" class="button_div mt-3">
              <b-button class="button eui-btn--green" @click="submitForm()">Select</b-button>
            </div>
            <!-- End of Submit Button -->
          </div>
          <!-- End of Selected Info -->
        </b-form-group>
      </div>
    </b-container>
  </b-form>
  <!-- End of Form -->
</template>
<script>
// Jquery javascript
import $ from "jquery";
import mixin from "../mixins/mixin";

// This Daacs component gets DAAC data and displays abbreviations as a radio selection
// On selection displays a link to the selected DAAC website, description and a 'Select
// Button' is displayed to allow users more info and to move on.
export default {
  name: "Daacs",
  mixins: [mixin],
  data() {
    return {
      selected: "",
      loaded: false,
      daacs: []
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
    this.daacs = this.fetchDaacs();
    this.GetCurrentDaacAndUpdate();
  },
  methods: {
    // @vuese
    // Fetchs the DAAC data
    fetchDaacs() {
      // Gets DAAC data for template
      var items = [];
      $.getJSON("../daacs.json", daacs => {
        for (var dict in daacs["data"]) {
          items.push(daacs["data"][dict]);
        }
        this.loaded = true;
      });
      return items;
    },
    // @vuese
    // Fetchs DAAC specific data
    getDaac(daac_specific) {
      // Gets DAAC data for template
      if (typeof daac_specific === "undefined") {
        return { short_name: "", long_name: "", url: "", description: "" };
      }
      for (var dict in this.daacs) {
        let long_name = this.daacs[dict]["long_name"];
        let short_name = this.daacs[dict]["short_name"];
        if (
          daac_specific.toLowerCase() === long_name.toLowerCase() ||
          daac_specific.toLowerCase() === short_name.toLowerCase()
        ) {
          let url = this.daacs[dict]["url"];
          let description = this.daacs[dict]["description"];
          return {
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
      short_name,
      long_name,
      description
    ) {
      //console.log('set current daac objects')
      var daac_specific_data;
      if (
        typeof url == "undefined" ||
        typeof short_name == "undefined" ||
        typeof long_name == "undefined" ||
        typeof description == "undefined"
      ) {
        daac_specific_data = this.getDaac(current_daac);
      }
      if (typeof url == "undefined") {
        url = daac_specific_data["url"];
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
      return short_name;
    },
    // @vuese
    // On selected, builds dynamic text and sets html dynamically with the link
    setSelectedValues(url, short_name, long_name, description) {
      short_name = this.setCurrentDaacObjects(
        this.selected,
        url,
        short_name,
        long_name,
        description
      ).toLowerCase();
      if (
        typeof this.$route != "undefined" &&
        typeof this.$route.params.default != "undefined" &&
        this.$route.params.default != null
      ) {
        if (
          this.$route.params.default.replace(/ /g, "_").toLowerCase() !=
          short_name.replace(/ /g, "_").toLowerCase()
        ) {
          short_name = this.setCurrentDaacObjects(
            short_name,
            url,
            short_name,
            long_name,
            description
          );
          this.$route.params.default = short_name
            .replace(/ /g, "_")
            .toLowerCase();
        }
      }
      this.setActiveLocationWithoutReload(location.href, short_name);
      window.headerComponent.daac = short_name.toLowerCase();
      this.setSaveObject(short_name);
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
      if (this.selected != "") {
        this.$router.push({
          name: "Questions",
          params: { default: this.data.toLowerCase() }
        });
      } else {
        this.$router.push({ name: "Daacs", params: { default: "selection" } });
      }
    },
    // @vuese
    // Used to save file
    setSaveObject(short_name) {
      // Saves file to localStorage
      if (this.selected != "") {
        window.localStorage.setItem(
          "DAAC",
          short_name.replace(/ /g, "_").toUpperCase()
        );
        window.headerComponent.daac = short_name
          .replace(/ /g, "_")
          .toLowerCase();
      }
    },
    // @vuese
    // Gets the current daac selected and updates
    GetCurrentDaacAndUpdate() {
      if (
        this.selected == "" &&
        !window.location.href.match(/daacs\/selection/g) &&
        (typeof this.$route == "undefined" ||
          typeof this.$route.params.default == "undefined" ||
          this.$route.params.default == "")
      ) {
        history.replaceState(
          "updating href",
          window.document.title,
          window.location.href.toLowerCase() + "daacs/selection"
        );
      }
      if (
        (typeof this.$route != "undefined" &&
          typeof this.$route.params.default != "undefined" &&
          this.$route.params.default != null &&
          this.$route.params.default != "" &&
          this.$route.params.default != "selection") ||
        this.selected != "" ||
        window.localStorage.getItem("DAAC") != null
      ) {
        let default_daac;
        let selected;
        if (this.selected != "") {
          selected = this.getDaac(this.selected);
        } else if (typeof this.$route.params.default != "undefined") {
          selected = this.getDaac(
            this.$route.params.default.replace(/_/g, " ").toUpperCase()
          );
        } else if (window.localStorage.getItem("DAAC") != null) {
          selected = this.getDaac(window.localStorage.getItem("DAAC"));
        }
        if (typeof selected != "undefined") {
          let selected_short = selected["short_name"];
          default_daac = selected_short.replace(/ /g, "_").toUpperCase();
          if (
            typeof default_daac != "undefined" &&
            default_daac != "" &&
            default_daac != "SELECTION"
          ) {
            if ($("label[for^='" + default_daac + "']")) {
              $("label[for^='" + default_daac + "']").click();
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