<template>
  <div role="main">
    <!-- Form -->
    <b-form name="daacs_form" @submit="enterSubmitForm" id="daac-selection">
      <b-container name="daacs-container" id="daacs-container">
        <div class="daac-div">
          <b-form-group name="form-group" id="form-group" label="Select a DAAC.">
            <div class="mt-3 disabled-daacs">
              Some DAACs are not selectable on the form because they are not yet using Earthdata Pub for data publication.
              To publish data with one of those DAACs, please contact them directly. DAAC websites can be found in the <a
                :href="overviewRootPublicationDaacs" alt="go to NASA Daac Section" title="go NASA Daac Section">NASA
                DAACs</a> section of Earthdata Pub.
            </div>
            <!-- Radio Div with Description -->
            <div>
              <div class="radio_div table">
                <div class="radio_head_div font-weight-bold"><span>DAAC</span><span>Discipline</span></div>
                <b-form-radio v-for="(item, index) in daacs" :key="index" :name="item.short_name.replace(' ', '_')"
                  :id="`${item.id}`" :value="item.long_name" v-model="selected" :disabled="item.hidden"><span>{{ item.short_name
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
<script src="../assets/js/FormsDaacs.js"></script>
<style scoped src="../assets/css/FormsDaacs.css"></style>