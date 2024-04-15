<!-- eslint-disable max-len -->
<template>
  <div role="main">
    <!-- Form -->
    <b-form name="daacs_form" @submit="enterSubmitForm" id="daac-selection">
      <b-container name="daacs-container" id="daacs-container">
        <div class="daac-div">
          <b-form-group name="form-group" id="form-group" label="Select a DAAC.">
            <div class="mt-3 disabled-daacs">
              Some DAACs are not selectable on the form because they are not yet using Earthdata Pub for data
              publication. To publish data with one of those DAACs, please contact them directly. DAAC websites can be
              found in the <a :href="overviewRootPublicationDaacs" alt="go to NASA Daac Section"
                title="go NASA Daac Section">NASA DAACs</a> section of Earthdata Pub.
            </div>
            <!-- Radio Div with Description -->
            <div>
              <div class="radio_div table">
                <div class="radio_head_div font-weight-bold"><span>DAAC</span><span>Discipline</span></div>
                <b-form-radio v-for="(item, index) in daacs" :key="index" :name="item.short_name.replace(' ', '_')"
                  :id="`${item.id}`" :value="item.long_name"
                  @click="setSelectedValues(item.url, item.id, item.short_name, item.long_name, item.description)"
                  v-model="selected" :disabled="item.hidden"><span>{{ item.short_name
                    }}</span><span>{{ item.discipline }}</span></b-form-radio>
              </div>
            </div>
            <!-- End of Radio Div with Description -->
            <!-- Selected Info -->
            <div class="info_section">
              <div class="mt-3" v-if="selected && selected !== 'Unknown DAAC'">
                <strong>{{ selected }}</strong>
                <div v-if="selected" id="selected_description"></div>
              </div>
              <div class="mt-3 link-to-daac" v-if="selected">
                For more information, visit
                <a href="#" id="selected_daac_link" target="_blank" aria-label="Link to selected DAAC">
                  <span id="selected_daac"></span>'s website
                  <font-awesome-icon icon="external-link-alt" name="external link">external link</font-awesome-icon>
                </a>
              </div>
              <!-- Submit Button -->
              <div v-if="selected" class="button_bar">
                <div align=left class="left_button_bar">
                  <b-button class="eui-btn--secondary" @click="cancelForm()" aria-label="cancel button"
                    id="daac_cancel_button">Cancel</b-button>
                </div>
                <div align=left class="right_button_bar">
                  <b-button class="eui-btn--green" @click="submitForm()" aria-label="select button"
                    id="daac_select_button">Select</b-button>
                </div>
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
import mixin from '../mixins/mixin.js';

// This Daacs component gets DAAC data and displays abbreviations as a radio selection.
// On selection, it displays a link to the selected DAAC website, description and a 'Select
// Button' is displayed to allow users to move on.
export default {
  mixins: [mixin],
  name: 'FormsDaacs',
  data() {
    return {
      selected: '',
      loaded: false,
      daacs: [],
      formId: '',
      requestId: ''
    };
  },
  props: {},
  computed: {
    overviewRootPublicationDaacs() {
      return `${process.env.VUE_APP_OVERVIEW_ROOT}/data_publication_guidelines#daacs`;
    },
    notHidden() {
      return this.daacs.filter((i) => i.hidden === false);
    },
    hidden() {
      return this.daacs.filter((i) => i.hidden === true);
    }
  },
  validations: {},
  watch: {
    loaded(val) {
      setTimeout(() => {
        if (val) {
          this.getCurrentDaacAndUpdate();
        }
      }, 1);
    },
    selected() {
      setTimeout(() => {
        this.setSelectedValues();
      }, 1);
    }
  },
  mounted() {
    // @vuese
    // Sets local variables from the global_params in store
    window.daacsComponent = this;
    this.setActiveNav('daacs');
    this.setLocalVars();
    this.fetchDaacs().then(() => {
      if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params.group !== 'undefined') {
        const daacData = this.getDaac(this.$store.state.global_params.group);
        if (typeof daacData !== 'undefined') {
          this.selected = daacData.long_name;
        }
      }
      this.showHideForms('show');
    });
  },
  methods: {
    setLocalVars() {
      if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params.formId !== 'undefined') {
        this.formId = this.$store.state.global_params.formId;
      }
      if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params.requestId !== 'undefined') {
        this.requestId = this.$store.state.global_params.requestId;
      }
    },
    // @vuese
    // On selected, sets current daac objects from values
    // @arg currentDaac [String] hash,
    // @arg url [String],
    // @arg id [String] hash,
    // @arg shortName [String],
    // @arg longName [String],
    // @arg description [String]
    setCurrentDaacObjects(
      currentDaac,
      url,
      id,
      shortName,
      longName,
      description
    ) {
      let daacSpecificData;
      if (
        typeof url === 'undefined'
        || typeof id === 'undefined'
        || typeof shortName === 'undefined'
        || typeof longName === 'undefined'
        || typeof description === 'undefined'
      ) {
        daacSpecificData = this.getDaac(currentDaac);
      }
      if (typeof url === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        url = daacSpecificData.url;
      }
      if (typeof id === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        id = daacSpecificData.id;
      }
      if (typeof shortName === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        shortName = daacSpecificData.short_name;
      }
      if (typeof longName === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        longName = daacSpecificData.long_name;
      }
      if (typeof description === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        description = daacSpecificData.description;
      }
      if (shortName.match(/Unknown/g)) {
        // eslint-disable-next-line no-param-reassign
        shortName = `${process.env.VUE_APP_UNKNOWN_WEBSITE_LINK_SINGULAR}`;
      }
      if (document.getElementById('selected_daac') != null) {
        document.getElementById('selected_daac').innerHTML = shortName;
      }
      if (document.getElementById('selected_daac_link') != null) {
        document.getElementById('selected_daac_link').href = url;
      }
      if (document.getElementById('selected_description') != null) {
        document.getElementById('selected_description').innerHTML = description;
      }
      this.setActiveNav('daacs');
      this.selected = longName;
      return [shortName, id];
    },
    // @vuese
    // On selected, builds dynamic text and sets html dynamically with the link
    // @arg daac url [String],
    // @arg id [String] hash,
    // @arg shortName [String],
    // @arg longName [String],
    // @arg description [String]
    setSelectedValues(url, id, shortName, longName, description) {
      const current = this.setCurrentDaacObjects(
        this.selected,
        url,
        id,
        shortName,
        longName,
        description
      );
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      id = current[1];
      this.$store.state.global_params.group = id;
      window.headerComponent.daac = id;
      return shortName;
    },
    // @vuese
    // Calls submit form via enter key
    enterSubmitForm() {
      if (this.enterSubmit) {
        this.submitForm();
      }
    },
    // @vuese
    // Used to submit the form data and move on
    cancelForm() {
      // eslint-disable-next-line no-restricted-globals
      history.back();
    },
    // @vuese
    // Used to submit the form data and move on
    submitForm() {
      this.$v.$touch();
      const args = {};
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params.formId !== '') {
        args.formId = this.$store.state.global_params.formId;
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params.requestId !== '') {
        args.requestId = this.$store.state.global_params.requestId;
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params.group !== '') {
        args.group = this.$store.state.global_params.group;
        this.initializeSubmission();
      }
    },
    // @vuese
    // Gets the current daac selected from the store and updates
    getCurrentDaacAndUpdate() {
      if (
        (typeof this.$store !== 'undefined'
          && this.$store.state.global_params.group !== 'undefined'
          && this.$store.state.global_params.group !== null
          && this.$store.state.global_params.group !== ''
          && this.$store.state.global_params.group !== 'selection')
      ) {
        let defaultDaac;
        let selected;
        if (typeof this.$store !== 'undefined'
          && (this.$store.state.global_params.group !== ''
            || typeof this.$store.state.global_params.group !== 'undefined')) {
          selected = this.getDaac(this.$store.state.global_params.group);
        }
        if (typeof selected !== 'undefined') {
          const { id } = selected;
          defaultDaac = id;
          if (
            typeof defaultDaac !== 'undefined'
            && defaultDaac !== ''
            && defaultDaac !== 'SELECTION'
          ) {
            if (document.querySelectorAll(`label[for^='${defaultDaac}']`)) {
              document.querySelectorAll(`label[for^='${defaultDaac}']`).click();
            }
          }
        }
      }
      this.setActiveNav('daacs');
    }
  }
};
</script>
<style scoped>
.button_bar {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-between;*/
  margin-top: 0;
}

.disabled-daacs {
  margin-bottom: 1rem;
  margin-top: 0.5rem !important;
}

#daac_select_button,
#daac_cancel_button {
  margin-top: 2rem;
  padding: 0.5em 1em;
}

#daac_cancel_button {
  margin-right: 2rem;
}

.form-group {
  margin-top: 2rem;
  margin-left: 8px;
  margin-right: 8px;
}

#selected_daac,
.external-link-alt,
#selected_daac_link {
  color: #2275AA;
}

.radio_head_div {
  padding-left: 24px;
  border-top: none !important;
  border-bottom: 2px solid #dee2e6;
}

.radio_div span,
.radio_div input {
  display: table-cell;
  min-width: 120px;
}

.radio_div div {
  padding-top: 5px;
  padding-bottom: 5px;
  border-top: 1px solid #dee2e6;
}

fieldset#form-group.form-group {
  margin-left: unset;
  margin-right: unset;
  padding-left: unset;
  padding-right: unset;
  /*min-width:1110px;*/
}
</style>
