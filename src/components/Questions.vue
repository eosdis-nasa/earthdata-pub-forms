<template>
<div role="main">
  <!-- Form -->
  <b-form ref="form" name="questions_form" v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="cancelForm" @invalid.capture.prevent="handleInvalid" @change="handleChange">
    <b-container>
        <fixed-header :fixed.sync="isFixed" :threshold="168" style="z-index:2">
          <div class="navbar">
              <!-- Button Options -->
              <div class="button_bar">
                  <div align=left v-if="!readonly" class="left_button_bar">
                      <b-button class="button" type="redo" id="redo_button" v-if="canRedo" @click="redoToPreviousState()" aria-label="redo button">
                        <font-awesome-icon v-bind:icon="redoLabel"/>
                        {{ redoLabel }}
                      </b-button>
                      <b-button class="button" type="redo" id="redo_button" v-else disabled aria-label="redo button">
                        <font-awesome-icon v-bind:icon="redoLabel"/>
                        {{ redoLabel }}
                      </b-button>
                      <b-button class="button" type="undo" id="undo_button" v-if="canUndo" @click="undoToPreviousState()" aria-label="undo button">
                        <font-awesome-icon v-bind:icon="undoLabel"/>
                        {{ undoLabel }}
                      </b-button>
                      <b-button class="button" type="undo" id="undo_button" v-else disabled aria-label="undo button">
                        <font-awesome-icon v-bind:icon="undoLabel"/>
                        {{ undoLabel }}
                      </b-button>
                  </div>
                  <div align=right v-if="!readonly" class="right_button_bar">
                      <b-button class="eui-btn--blue" type="draft" id="draft_data" @click="draftFile(true)" aria-label="draft button">{{ draftLabel }}</b-button>
                      <b-button class="eui-btn--blue" type="save" id="save_data" @click="saveFile(true)" aria-label="save button">{{ saveLabel }}</b-button>
                      <b-button class="eui-btn--green" type="submit" id="submit_data" @click="submitForm" aria-label="submit button">{{ submitLabel }}</b-button>
                      <b-button class="eui-btn--red" type="reset" id="reset_data" v-if="showCancelButton" aria-label="cancel button">{{ cancelLabel }}</b-button>
                  </div>
              </div>
          </div>
          <div align=right v-if="!readonly" class="right_button_bar">
            <b-button class="eui-btn--blue" type="draft" id="draft_data" @click=draftFile(true)>{{ draftLabel }}</b-button>
            <b-button class="eui-btn--blue" type="save" id="save_data" @click=saveFile(true)>{{ saveLabel }}</b-button>
            <b-button class="eui-btn--green" type="submit" id="submit_data" @click=submitForm>{{ submitLabel }}</b-button>
            <b-button class="eui-btn--red" type="reset" id="reset_data" v-if="showCancelButton">{{ cancelLabel }}</b-button>
          </div>
      </fixed-header>
    </b-container>
    <b-container style="margin-top:2rem;">
      <p v-if="$v.$anyError" class="eui-banner--danger" id="eui-banner">
        <b><strong>Please correct the following error(s):</strong></b>
        <a href="javascript:void(0)" class="eui-banner__dismiss float_right" title="Dismiss banner"><i class="eui-icon eui-fa-times-circle" @click="dismiss('eui-banner');"></i></a>
      <ul class="eui_banner__message">
        <template v-for="(heading, a_key) in questions">
          <li v-bind:key="a_key" v-if="($v.values[`section_${a_key}`] || {}).$error">Section {{ heading.heading }} is required</li>
          <template v-for="(question, b_key) in heading">
            <li v-bind:key="`${a_key}_${b_key}`" v-if="($v.values[`question_${a_key}_${b_key}`] || {}).$error">{{ heading.heading }} - {{ question.title }} section is required</li>
            <template v-for="(input, c_key) in question.inputs">
              <li v-bind:key="`${a_key}_${b_key}_${c_key}`" v-if="($v.values[input.id] || {}).$error">
                <template v-if="typeof input.required_if != 'undefined'">
                  <template v-for="(req_if, d_key) in input.required_if">
                    <span v-bind:key="`${a_key}_${b_key}_${c_key}_${d_key}`" v-if="values[req_if.field] == req_if.value">
                      <template v-if="typeof req_if.message != 'undefined'">{{ heading.heading }} - {{ question.title }} - {{ input.label }}: {{ req_if.message }}</template>
                      <template v-else-if="typeof input.validation_error_msg != 'undefined'">{{ heading.heading }} - {{ question.title }} - {{ input.label }}: {{ input.validation_error_msg }}</template>
                      <template v-else>{{ heading.heading }} - {{ question.title }} - {{ input.label }} is required</template>
                    </span>
                  </template>
                </template>
                <template v-else-if="typeof input.validation_error_msg != 'undefined'">{{ heading.heading }} - {{ question.title }} - {{ input.label }}: {{ input.validation_error_msg }}</template>
                <template v-else>
                  {{ heading.heading }} - {{ question.title }} - {{ input.label }}
                  <template v-if="typeof $v.values[input.id].required != 'undefined' && !$v.values[input.id].required">is required</template>
                  <template v-else-if="typeof $v.values[input.id].patternMatch != 'undefined' && !$v.values[input.id].patternMatch">does not match pattern {{ input.attributes.pattern }}</template>
                  <template v-else-if="typeof $v.values[input.id].minLength != 'undefined' && !$v.values[input.id].minLength">requires a minimum length of {{ input.attributes.minlength }}</template>
                  <template v-else-if="typeof $v.values[input.id].maxLength != 'undefined' && !$v.values[input.id].maxLength">is over the maximum length of {{ input.attributes.maxlength }}</template>
                  <template v-else-if="typeof $v.values[input.id].min != 'undefined' && !$v.values[input.id].min">the value must be {{ input.attributes.min }} or greater.</template>
                  <template v-else-if="typeof $v.values[input.id].max != 'undefined' && !$v.values[input.id].max">the value must be less than {{ input.attributes.max }}</template>
                </template>
              </li>
            </template>
          </template>
        </template>
      </ul>
      </p>
    </b-container>
    <b-container name="questions_container" id="questions_container">
        <h2 v-if="warning" class="warning">{{warning}}</h2>
        <!-- Section -->
        <section>
            <b-row v-for="(heading, a_key) in questions" :key="a_key">
            <div :class="{ 'form-section-error': ($v.values[`section_${a_key}`] || {}).$error }" v-if="showIf(heading.heading_show_if)">
                <input type="hidden" :id="`section_${a_key}`" v-if="heading.heading_required" />
                <h2>{{heading.heading}}</h2>
                <div :id="a_key" class="question_section">
                    <!-- Question -->
                    <b-form-group v-for="(question, b_key) in heading" 
                    :class="{ 'form-group-error': ($v.values[`question_${a_key}_${b_key}`] || {}).$error }"
                    :key="b_key" 
                    size="lg" lg=12
                    :disabled="disabled"
                    :readonly="readonly">
                      <div v-if="showIf(question.show_if)">
                        <input type="hidden" :id="`question_${a_key}_${b_key}`" v-if="question.required" />
                        <label :for="question.id" class="eui-label">{{question.title}}:</label>
                        <span class="required" v-if="question.required == true">* required</span>
                        <p :id="question.id || a_key">{{question.text}}</p>
                        <!-- Input -->
                        <b-row>
                          <b-col :lg="question.size || 12" class="question_size">
                            <b-col class="w-25 help">
                              <a href="#" @click.prevent="" :id="`help_${question.id}`" v-if="question.help != ''" v-b-modal="`modal_${question.id}`">
                              <font-awesome-icon icon="info-circle" name="info icon"/>
                                Help</a>
                              <b-modal :id="`modal_${question.id}`" :title="`${question.title} - Help`" ok-only centered>
                                <p class="my-4">{{question.help}}</p>
                              </b-modal>
                            </b-col>
                            <b-row v-for="(input, c_key) in question.inputs" :key="c_key">
                              <span v-if="showIf(input.show_if)">
                                <label :for="input.id || `${input}_${c_key}`" class="eui-label">{{input.label}}: </label>
                                <span class="required" v-if="input.required == true && input.type!='checkbox'">* required</span>
                                <span v-if="input.type == 'textarea' && parseInt(charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))) > 0" style="padding-left:300px;">
                                  {{charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))}} characters left
                                </span>
                                <span v-else-if="input.type == 'text' && parseInt(charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))) > 0" style="padding-left:5px;">
                                  ({{charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))}} characters left)
                                </span>
                                <span v-for="(contact,contact_key) in contacts" :key="contact_key">
                                  <span v-if="contact != values[input.id]">
                                    <label 
                                      :id="`same_as_${input.id}_label`"
                                      :for="`same_as_${input.id}`" 
                                      v-if="input.contact == true" 
                                      @click="setContact(input.id, contact)"
                                      class="eui-label">
                                      Same as {{contact}} </label>
                                      <b-form-checkbox 
                                        class="eui-checkbox"
                                        v-if="input.contact == true"
                                        :id="`same_as_${input.id}`"
                                        value="true"
                                        unchecked-value="false"
                                        @click="setContact(input.id, contact)"
                                        @keyup.space.native="setContact(input.id, contact)">
                                      </b-form-checkbox>
                                  </span>
                                </span>
                                <!-- Text Type of Input -->
                                <b-form-input 
                                    :class="{ 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    v-if="input.type == 'text' || 
                                    input.type == 'password' || 
                                    input.type == 'number' || 
                                    input.type == 'url' || 
                                    input.type == 'email' || 
                                    input.type == 'search' || 
                                    input.type == 'range' || 
                                    input.type == 'date' || 
                                    input.type == 'tel' || 
                                    input.type == 'time'"
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                    :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                    :pattern="getAttribute('pattern', question.inputs[c_key])"
                                    :maxLength="getAttribute('maxlength', question.inputs[c_key])"
                                    :minLength="getAttribute('minlength', question.inputs[c_key])"
                                    :max="getAttribute('max', question.inputs[c_key])"
                                    :min="getAttribute('min', question.inputs[c_key])"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                    >
                                </b-form-input>
                                <!-- End of Text Type of Input -->
                                <!-- Textarea Type of Input -->
                                <b-form-textarea 
                                    :class="{ 'form-textarea-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                    :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                    :cols="getAttribute('cols', question.inputs[c_key])"
                                    :rows="getAttribute('rows', question.inputs[c_key])"
                                    :maxlength="getAttribute('maxlength', question.inputs[c_key])"
                                    :minlength="getAttribute('minlength', question.inputs[c_key])"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                    v-if="input.type == 'textarea'">
                                </b-form-textarea>
                                <!-- End of Textarea Type of Input -->
                                <!-- Radio Group Type of Input -->
                                <b-form-radio-group
                                    :class="{ 'form-radio-group-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    value="true"
                                    unchecked-value="false"
                                    v-if="input.type == 'radio'" 
                                    :options="input.options"
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))">
                                </b-form-radio-group>
                                <!-- End of Radio Group Type of Input -->
                                <!-- Checkbox Type of Input -->
                                <b-form-checkbox 
                                    :class="{ 'form-checkbox-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.id] || {}).$error, 'checkboxes':true }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    value="true"
                                    unchecked-value="false"
                                    v-if="input.type == 'checkbox'"
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))">
                                </b-form-checkbox>
                                <span :id="input.id" class="required" v-if="input.required == true && input.type == 'checkbox'">* required </span>
                                <!-- End of Checkbox Type of Input -->
                                <!-- Select Type of Input -->
                                <b-form-select
                                    :class="{ 'form-select-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    v-if="input.type == 'select'" 
                                    :options="input.options"
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                    :multiple="Boolean(getAttribute('multiple', question.inputs[c_key]))">
                                </b-form-select>
                                <!-- End of Select Type of Input -->
                                <!-- File Type of Input -->
                                <b-form-file
                                    :class="{ 'form-file-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :scope="Boolean(values[input.id])"
                                    :name="input.id" 
                                    v-model="values[input.id]" 
                                    size="lg" 
                                    v-if="input.type == 'file'"
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                    :multiple="Boolean(getAttribute('multiple', question.inputs[c_key]))">
                                </b-form-file>
                                <!-- End of File Type of Input -->
                                <!-- Selected Input File Name -->
                                <div class="mt-3" v-if="input.type == 'file' && values[input.id] != ''">Selected file: {{ values[input.id] ? values[input.id].name : '' }}</div>
                                <!-- End of Selected Input File Name -->
                                <p :id="`${input.id}_invalid`" class="eui-banner eui-banner--danger hidden validation"></p>
                              </span>
                            </b-row>
                          </b-col>
                        </b-row>
                        <!-- End of Input -->
                        </div>
                    </b-form-group>
                    <!-- End of Question -->
                </div>
                </div>
            </b-row>
        </section>
        <!-- End of Section -->
    </b-container>
    <!-- End of Button Options -->
  </b-form>
  <!-- End of Form -->
</div>
</template>
<script>
// Basic html5 validation
import { required, requiredIf, minLength, maxLength } from 'vuelidate/lib/validators'
// Jquery javascript
import $ from 'jquery'
import FixedHeader from 'vue-fixed-header'

// This questions component gets the questions data for the selected daac and
// sets the above template properties, methods, and custom validation used.
export default {
  name: 'Questions',
  data() {
    return {
      values: {},
      questions: [],
      contacts: [],
      dirty:false,
      formTitle: '',
      saveTimeout: 0,
      daac:'',
      warning:'',
      isFixed:true,
      confirm:false,
      validation_errors:{}
    }
  },
  props: {
    // The cancel label and type
    cancelLabel: { default: 'Cancel', type: String },
    // The draft label and type
    draftLabel: { default: 'Save as draft', type: String },
    // The save label and type
    saveLabel: { default: 'Save and continue editing', type: String },
    // The undo label and type
    undoLabel: { default: 'undo', type: String },
    // The redo label and type
    redoLabel: { default: 'redo', type: String },
    // The submit label and type
    submitLabel: { default: 'Submit', type: String },
    // The enter submit conditional to allow for submittal
    enterSubmit: { default: false, type: Boolean },
    // The readonly attribute to pass in
    readonly: { default: false, type: Boolean },
    // The disabled attribute to pass in
    disabled: { default: false, type: Boolean },
    // The show cancel button conditional to allow for cancel
    showCancelButton: { default: true, type: Boolean }
  },
  computed: {
    
  },
  watch: {
    values: {
      handler() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout)
        }
        this.saveTimeout = setTimeout(() => {
          if (!this.values.fromUndo) {
            this.setContacts(this.values)
            this.$store.commit('pushQuestionsState', Object.assign({}, this.values))
            this.$log.debug('pushQuestionsState', Object.assign({}, this.values))
            var string_logging_object = this.$log.debug('pushQuestionsState')
            this.$logging_object[Date(Date.now()).toString()] = {
              "log_string":string_logging_object,
              "answers": Object.assign({}, this.values)
            }
          }
          delete this.values.fromUndo
          if (this.$v.$anyError) {
            console.log('touch348')
            this.$v.$touch()
          }
        }, 250);
      },
      deep: true
    }
  },
  created () {

  },
  components: {
    FixedHeader
  },
  validations() {
    let val_fields = {
        values: {}
    }
    var obj = []
    if(typeof this.questions.inputs !='undefined'){
        obj = this.questions.inputs
    } else if (typeof this.questions !='undefined'){
        obj = this.questions
    }
    // Gather required elements
    for (let [group_index, group] of obj.entries()) {
        if (typeof group.heading_required != 'undefined' && group.heading_required) {
          val_fields.values[`section_${group_index}`] = {
            required: requiredIf(() => {
              for (let question of group) {
                for (let input of question.inputs) {
                  if (typeof this.values[input.id] != 'undefined' && this.values[input.id] != '' && this.values[input.id] != null) {
                    if (input.type != 'checkbox' || this.values[input.id].toString() != 'false') {
                      return false
                    }
                  }
                }
              }
              return true
            })
          }
        }
        for (let [question_index, question] of group.entries()) {
            if (typeof question.required != 'undefined' && question.required) {
              val_fields.values[`question_${group_index}_${question_index}`] = {
                required: requiredIf(() => {
                  for (let input of question.inputs) {
                    if (typeof this.values[input.id] != 'undefined' && this.values[input.id] != '' && this.values[input.id] != null) {
                      if (input.type != 'checkbox' || this.values[input.id].toString() != 'false') {
                        return false
                      }
                    }
                  }
                  return true
                })
              }
            }
            if (typeof question.inputs != 'undefined'){
                for (let fld of question.inputs){
                    if (typeof fld.required != 'undefined' && fld.required) {
                        if(fld.type != 'checkbox'){
                            val_fields.values[fld.id] = {
                                required
                            }
                        }
                    } else if (typeof fld.required_if != 'undefined') {
                      val_fields.values[fld.id] = {
                        required: requiredIf(() => {
                          for (let req_fld of fld.required_if) {
                            try {
                              if (typeof this.values[req_fld.field] != 'undefined' && this.values[req_fld.field].toString() === req_fld.value.toString()) {
                                return true
                              }
                            } catch(e) {
                              // test
                            }
                          }
                          return false
                        })
                      }
                    }
                    if (typeof fld.attributes != 'undefined' && typeof fld.attributes.pattern != 'undefined') {
                      val_fields.values[fld.id] = val_fields.values[fld.id] || {}
                      val_fields.values[fld.id].patternMatch = () => {
                        if (typeof this.values[fld.id] != 'undefined') {
                          return new RegExp(fld.attributes.pattern).test(this.values[fld.id])
                        }
                        return false
                      }
                    }

                    if (typeof fld.attributes != 'undefined' && typeof fld.attributes.minlength != 'undefined') {
                      val_fields.values[fld.id] = val_fields.values[fld.id] || {}
                      val_fields.values[fld.id].minLength = minLength(fld.attributes.minlength)
                    }

                    if (typeof fld.attributes != 'undefined' && typeof fld.attributes.maxlength != 'undefined') {
                      val_fields.values[fld.id] = val_fields.values[fld.id] || {}
                      val_fields.values[fld.id].maxLength = maxLength(fld.attributes.maxlength)
                    }
                    
                }
            }
        }
    }
    let DAAC_SET = window.localStorage.getItem('DAAC')
    if(DAAC_SET !== null){
        //window.localStorage.setItem(`${DAAC_SET}_questions`, JSON.stringify(val_fields.values))
        this.$required = JSON.stringify(val_fields.values)
    }
    return val_fields
  },
  methods: {
    // @vuese
    // Shows and Hides based of json show_if
    showIf(config) {
      if (typeof config == 'undefined' || config.length == 0) {
        return true
      }
      for (let fld of config) {
        if (typeof this.values[fld.field] != 'undefined' && this.values[fld.field] != '' && this.values[fld.field] != null) {
          if (this.values[fld.field].toString() == fld.value.toString()) {
            return true
          }
        }
      }
      return false
    },
    // @vuese
    // Copies over contact information from the 'same as' checkbox for contact
    setContact: function (id_to, contact) {
      let inputs = $('#questions_container input')
      for (let i in inputs){
        if(typeof inputs[i].id != 'undefined' && inputs[i].id.toLowerCase().match(/name/g)){
          if (typeof $(`#same_as_${inputs[i].id}_label`) != 'undefined' && this.values[inputs[i].id]=== contact){
            let unchecked = $(`#same_as_${id_to}`).is(":checked")
            let get_id_from = inputs[i].id
            let from_name = get_id_from.toLowerCase()
            let to_name = id_to.toLowerCase()
            let from_org_id = get_id_from.toLowerCase().replace(/name/g,"organization")
            let to_org_id = id_to.toLowerCase().replace(/name/g,"organization")
            let from_email_id = get_id_from.toLowerCase().replace(/name/g,"email")
            let to_email_id = id_to.toLowerCase().replace(/name/g,"email")
            let from_orcid_id = get_id_from.toLowerCase().replace(/name/g,"orcid")
            let to_orcid_id = id_to.toLowerCase().replace(/name/g,"orcid")
            if(unchecked){
              if (typeof $(`#${to_name}`) != 'undefined'){
                $(`#${to_name}`).val('')
              }
              if (typeof $(`#${to_org_id}`) != 'undefined'){
                $(`#${to_org_id}`).val('')
              }
              if (typeof $(`#${to_email_id}`) != 'undefined'){
                $(`#${to_email_id}`).val('')
              }
              if (typeof $(`#${to_orcid_id}`) != 'undefined'){
                $(`#${to_orcid_id}`).val('')
              }
            } else {
              if (typeof $(`#${from_name}`) != 'undefined' && typeof $(`#${to_name}`) != 'undefined'){
                $(`#${to_name}`).val(this.values[from_name])
              }
              if (typeof $(`#${from_org_id}`) != 'undefined' && typeof $(`#${to_org_id}`) != 'undefined'){
                $(`#${to_org_id}`).val(this.values[from_org_id])
              }
              if (typeof $(`#${from_email_id}`) != 'undefined' && typeof $(`#${to_email_id}`) != 'undefined'){
                $(`#${to_email_id}`).val(this.values[from_email_id])
              }
              if (typeof $(`#${from_orcid_id}`) != 'undefined' && typeof $(`#${to_orcid_id}`) != 'undefined'){
                $(`#${to_orcid_id}`).val(this.values[from_orcid_id])
              }
            }
            this.$v.$touch()
          }
        }
      }
    },
    // @vuese
    // Gets contacts and builds options for checkbox
   setContacts: function (values) {
      this.contacts = []
      let questions = this.questions[0]
      for (var ea in values){
        if (!ea.toLowerCase().match(/name/g)){continue}
        for(let section of questions) {
          let inputs = section['inputs']
          let text = section['text']
          let title =section['title']
          let help = section['help']
          for (let i in inputs){
            let inp = inputs[i]
            let label = inp['label']
            if(ea === inp['id']){
              if(
                  ((typeof text != 'undefined' && text.toLowerCase().match(/person/g)) || 
                  (typeof text != 'undefined' && text.toLowerCase().match(/contact/g)) || 
                  (typeof title != 'undefined' && title.toLowerCase().match(/person/g)) ||
                  (typeof title != 'undefined' && title.toLowerCase().match(/contact/g)) || 
                  (typeof help != 'undefined' && help.toLowerCase().match(/person/g)) || 
                  (typeof help != 'undefined' && help.toLowerCase().match(/contact/g))) &&
                  label.toLowerCase().match(/name/g)
                ) {
                this.contacts.push(this.values[inputs[i]['id']])
              }
            }
          }
        }
      }
    },
    // @vuese
    // Gets characters remaining from textarea
    charactersRemaining: function (value, maxlength) {
      let left = maxlength
      let chars = 0
      if (typeof value == 'string' && value != ''){
        chars = value.length
      } 
      if (typeof maxlength != 'undefined' && parseInt(maxlength) > 0){
        left = parseInt(maxlength - chars)
      }
      return left
    },
    // @vuese
    // Gets input attributes or returns false if none or if pattern *
    getAttribute(attr, input){
      let attribute_value = ''
      let attributes_that_need_false_if_none = ['readonly', 'disabled']
      if(typeof input.attributes != 'undefined' && typeof input.attributes[attr] !='undefined'){
        attribute_value = input.attributes[attr]
      }
      if (attr.match(/pattern/g) && attribute_value == ''){
        return '.*'
      } else if (attributes_that_need_false_if_none.includes(attr) && attribute_value == ''){
        return false
      }
      return attribute_value
    },
    // @vuese
    // Handle html5 invalidity on change
    handleChange(evt) {
        console.log('handleChange :: ', evt.target.name);
        $(`#${evt.target.name}_invalid`).text(evt.target.validationMessage)
        if(evt.target.validationMessage!=''){
            this.validation_errors = {
                ...this.validation_errors,
                [evt.target.name]: evt.target.validationMessage
            }
        } else {
            if(evt.target.name in this.validation_errors){
                delete this.validation_errors[evt.target.name]
            }
        }
    },
    // @vuese
    // Handle html5 invalidity on form
    handleInvalid(evt) {
        console.log('handleInvalid :: ', evt.target.name);
        $(`#${evt.target.name}_invalid`).text(evt.target.validationMessage)
        if(evt.target.validationMessage!=''){
            this.validation_errors = {
                ...this.validation_errors,
                [evt.target.name]: evt.target.validationMessage
            }
        } else {
            if(evt.target.name in this.validation_errors){
                delete this.validation_errors[evt.target.name]
            }
        }
    },
    // @vuese
    // Hides errors banner
    dismiss(id){
      document.getElementById(id).style.display='none';
    },
    // @vuese
    // Fetchs the questions data
    fetchQuestions(){
      // Fires on load when building the form content
      console.log('FETCH QUESTIONS')
      var question = []
      this.contacts = []
      let contact = false
      // TODO - TESTING ONLY /////////////////////////////////////////////////////////////////////////////////////
      let form = this.getPath()[0]
      let json_name = ''
      if(form.match(/interest/g)){
        json_name = 'submission_request' 
      } else {
        json_name = `${form}/data_product_questionnaire`
      }
      $.getJSON( `../${json_name}.json`, ( questions ) => {
      // TODO - TESTING ONLY /////////////////////////////////////////////////////////////////////////////////////

      // $.getJSON(`${process.env.VUE_APP_API_ROOT}/data/form/6c544723-241c-4896-a38c-adbc0a364293`, ( questions ) => {
        //The below line looks for custom css and applies it to the head (eui is done first)
        this.formTitle = questions.form_title
        $('head link[data-eui="yes"]').remove()
        if(questions.style){
          $('head link[data-custom="yes"]').remove()
        }
        var head = window.document.head;
        var link = window.document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        $(link).attr('data-eui', 'yes');
        link.href = 'https://cdn.earthdata.nasa.gov/eui/1.1.7/stylesheets/application.css';
        head.appendChild(link);
        if (questions.style){
          head = window.document.head;
          link = window.document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          $(link).attr('data-custom', 'yes');
          link.href = questions.style
          head.appendChild(link);
        }
        for(var section in questions['sections']) {
          var heading = questions['sections'][section]['heading']
          var heading_required = questions['sections'][section]['required'] || false
          var heading_show_if = questions['sections'][section]['show_if'] || []
          var questions_section = questions['sections'][section]['questions']
          questions_section['heading'] = heading
          questions_section['heading_required'] = heading_required
          questions_section['heading_show_if'] = heading_show_if
          for (var q in questions_section){
            if (typeof questions_section[q].title != 'undefined'){
              let text = questions_section[q].text
              let title = questions_section[q].title
              let help = questions_section[q].help
              if(
                (typeof text != 'undefined' && text.toLowerCase().match(/person/g)) || 
                (typeof text != 'undefined' && text.toLowerCase().match(/contact/g)) || 
                (typeof title != 'undefined' && title.toLowerCase().match(/person/g)) ||
                (typeof title != 'undefined' && title.toLowerCase().match(/contact/g)) || 
                (typeof help != 'undefined' && help.toLowerCase().match(/person/g)) || 
                (typeof help != 'undefined' && help.toLowerCase().match(/contact/g))
              ) {
                contact = true
              }
            }
            if(typeof questions_section[q].inputs != 'undefined'){
              for(var input in questions_section[q].inputs){
                var options = []
                if(contact && questions_section[q].inputs[input].label.toLowerCase()=='name'){
                  questions_section[q].inputs[input].contact = true
                  contact = false
                }
                if(typeof questions_section[q].inputs[input].enums !='undefined'){
                  for (var e in questions_section[q].inputs[input].enums){
                    var option = questions_section[q].inputs[input].enums[e]
                    if(Array.isArray(questions_section[q].inputs[input].enums)){
                      options.push({ value: option, text: option })
                    } else if (typeof questions_section[q].inputs[input].enums.value !='undefined' && typeof questions_section[q].inputs[input].enums.text !='undefined'){
                      var text = questions_section[q].inputs[input].enums.text
                      var value = questions_section[q].inputs[input].enums.value
                      options.push({ value: value, text: text })
                    }
                  }
                }
                if(options.length>0){
                  questions_section[q].inputs[input]['options'] = options
                }
              }
            }
          }
          question.push(questions_section)
        }
      })
      return question
    },
    // @vuese
    // Validation of input data
    status(validation) {
      // console.log('Getting status ...')
      // Returns error and if dirty
      return {
        error: validation.$error,
        dirty: validation.$dirty
      }
    },
    // @vuese
    // @arg The event
    enterSubmitForm(evt) {
      //console.log('Entering submit ...')
      evt.preventDefault()
      if (this.enterSubmit) {
        this.submitForm()
      }
    },
    // @vuese
    // Used to submit the form data if valid
    submitForm(str) {
      // Submit form (this.data) if valid
      //console.log('Executing Submit ...')
      this.saveFile(str)
      let form_components = this.getPath()
      let form = form_components[0] 
      console.log(this.$v.$anyError)
      if (!this.$v.$anyError) {
        this.$emit('submit-form', window.localStorage.getItem(`${form}_questions`))
      }
    },
    // @vuese
    // Used to save file
    // TODO - API call will go here
    /* eslint-disable */
    saveFile(with_msg) {
      //console.log('Executing save file ...')
      // Saves file to localStorage
      const data = JSON.stringify(this.values)
      var DAAC
      if(this.daac == null){
        DAAC = window.localStorage.getItem('DAAC')
      } else {
        DAAC = this.daac
      }
      this.$v.$touch()
      console.log(this.$v.$anyError)
      if (!this.$v.$anyError) {
        console.log('HERE')
        if(typeof DAAC != 'undefined' && DAAC !== null && data !== JSON.stringify({})){
          console.log('THERE')
          if (this.$refs.form.checkValidity()) {
            //console.log('checking validity')
            this.submitForm('from save');
          } else {
            //console.log('reporting validity')
            this.$refs.form.reportValidity();
          }
          //window.localStorage.setItem(`${this.DAAC}_questions`, data);
          this.$values = data
          this.$output_object[DAAC] =  {
            "values": this.$values,
            "log":this.$logging_object
          }
          this.$input_object[DAAC] = {
            "questions":this.questions[0],
            "required":this.$required
          }
          window.localStorage.setItem('form_inputs', JSON.stringify(this.$input_object))
          window.localStorage.setItem('form_outputs', JSON.stringify(this.$output_object))
          // @vuese
          // Example log messages, this.$log.debug|info|warn|error|fatal('test', property|function, 'some error') -> see https://github.com/justinkames/vuejs-logger
          // If production level set (see main.js), will be at different level automatically.
          // Additonal options (can be set in main.js), stringifyArguments|showLogLevel|showMethodName|separator|showConsoleColors
          if(with_msg){
            alert('Your data has been saved.  Click submit to send the data.')
          }
        }
      } else {
        if($('.vue-go-top__content').is(":visible")){
          $('.vue-go-top__content').click()
        }
      }
      /* eslint-enable */
    },
    // @vuese
    // Save as draft and exit form
    draftFile(with_msg) {
      this.saveFile(with_msg)
      if (!this.$v.$anyError) {
        this.exitForm()
      }
    },
    // @vuese
    // Cancel and exit form
    okToCancel(){
      this.$refs.form.reset()
      $('#reset_data').focus()
      $('#eui-banner').addClass('hidden')
      window.localStorage.removeItem('form_outputs')
      window.localStorage.removeItem('form_inputs')
      this.$values = {}
    },
    // @vuese
    // Cancel and exit form
    cancelForm(evt) {
      if(!this.confirm){
        evt.preventDefault()
      }
      //console.log('Resetting form ...')
      // Resets form to blank entries
      if(Object.keys(this.values).length > 0){
        if(this.confirm == false){
          this.confirm = ''
          this.$bvModal.msgBoxConfirm('Are you sure?',{
            title: 'Please Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
          })
            .then(value => {
              this.confirm = value
              this.okToCancel()
            })
            .catch(err => {
              console.log(err) // An error occurred
            })
        } else {
          this.confirm = false;
          this.okToCancel()
        }
      } else {
        this.confirm = true
        this.okToCancel()
      }
    },
    // @vuese
    // Exit form to home page
    exitForm(){
      // exit form here
      //alert('Form will exit.')
    },
    // @vuese
    // Undos the form and reverts it to its previous state.
    undoToPreviousState(){
      this.undo();
    },
    // @vuese
    // Redo the form and to its previous state.
    redoToPreviousState(){
      this.redo();
    }

  },
  // This is equivalent to js document.ready
  mounted() {
    window.questionsComponent = this;
    this.setActiveNav("questions");
    let form_components = this.getPath()
    let form = form_components[0] 
    let form_name_prefix = form_components[1]
    this.setShowDaacs()
    if(form.toLowerCase().match(/questionnaire/g)){
        this.daac = null
    } else {
        if(typeof this.$route != 'undefined' && typeof this.$route.params.default != 'undefined'){
          this.daac = this.$route.params.default
        } else if(window.localStorage.getItem('DAAC')!=null){
          this.daac = window.localStorage.getItem('DAAC')
        }
        if(this.daac == null){
          this.$router.push({ name: `${form_name_prefix}Daacs`, path: '/selection', default: 'selection' })
        }

        let set_loc = location.href
        let re = `/${form}/questions/`
        if(!set_loc.match(re, 'g')){
          set_loc += `/${form}/questions/`
        }
        if(set_loc.match(/selection/g)){
          this.warning = 'No daac has been selected'
        }
        if(typeof window.headerComponent != 'undefined'){
          window.headerComponent.daac = this.daac.replace(/ /g,'_').toLowerCase()
        }
        this.setActiveLocationWithoutReload(set_loc, this.daac)
    }
    this.questions = this.fetchQuestions()
  }
}
</script>
<style scoped>
  .eui-checkbox {
    display:inherit;
  }
  span span label {
    margin-left:2rem;
    font-weight:normal;
  }
  .question_size {
    padding-left:0px;
    padding-right:0px;
  }
  .eui-btn--green:hover {
    background-color: #12713d;
  }
  .question_section {
    margin-bottom: 2rem;
  }
  h2 {
    text-decoration: underline;
    border-bottom:unset;
  }
  .eui-btn--green {
    background-color: #158749;
  }
  .eui-btn--green:hover {
    background-color: #12713d;
  }
  .eui-btn--blue {
    background-color: #2275AA;
  }
  .eui-btn--blue:hover {
    background-color: #2c3e50;
  }
  .eui-btn--red, #reset_data{
    background-color: #DB1400;
  }
  .eui-btn--red:hover {
    background-color: #c21200!important;
  }
  .eui-banner--danger {
    text-align:left;
    margin-bottom: 2rem;
  }
  .eui-banner--danger.validation {
    margin-top: -8px;
  }
  .hidden {
    display:none
  }
  .float_right{
    float:right;
  }
  .warning {
    color:red;
    font-weight:bold;
    text-decoration: None
  }
  .col-form-label {
    font-weight:bold;
  }
  .radio_div{
    width:25%;
    float:left;
  }
  .desc_div{
    width:75%;
    float:right;
  }
  .required{
    color:red!important;
    padding-top:7px
  }
  label{
    margin-right: 1rem;
    cursor:pointer;
  }
  p{
    margin-bottom:unset;
  }
  button {
    margin-left:1rem;
    margin-right:1rem;
    margin-bottom:1rem;
  }
  .left_button_bar button:first-child {
    margin-left:0!important;
  }
  .right_button_bar button:last-child {
    margin-right:0!important;
  }
  .help {
    text-align:right;
    float:right;
    padding-right:0px;
    padding-top:7px;
  }
  .form-file-error,
  .form-select-error,
  .form-radio-group-error,
  .form-textarea-error,
  .form-checkbox-error,
  .form-input-error,
  .form-group-error,
  .form-section-error {
    border-color: red;
  }
  .form-group-error,
  .form-radio-group-error,
  .form-section-error {
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 8px;
    padding-bottom: 5px;
  }
  .radio_checkbox_group_error {
    border-color: red;
    border-radius: 5px;
  }
  fieldset {
    border-left: unset
  }
  .button_bar{
    display:inline;
  }
  .left_button_bar {
    display:inline;
    float:left;
    margin-top:0px;
    height:55px;
  }
  .right_button_bar {
    display:inline;
    float:right;
    margin-top:0px;
    height:55px;
  }
  div.container{
    padding-top:0px;
  }
  .navbar{
    position: relative;
    display: -ms-flexbox;
    /* display: -webkit-box; */
    /* display: flex; */
    display:flow-root!important;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: center;
    -webkit-box-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 0rem 0rem;
    padding-top:1rem;
  }
  .console_container {
    height: 1em;
  }
  .console_bar {
    float:right
  }

  @media (min-width: 1200px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      left: 20;
      top: 1rem;
      min-width: 1110px;
      max-width: 1110px;
    }
  }
  @media (max-width: 1200px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      left: 20;
      top: 1rem;
      min-width: 929px;
      max-width: 929px;
    }
  }
  @media (max-width: 992px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      left: 20;
      top: 1rem;
      min-width: 929px;
      max-width: 929px;
    }
  }
  @media (max-width: 768px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      left: 20;
      top: 1rem;
      min-width: 690px;
      max-width: 690px;
    }
  }
  @media (max-width: 576px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 509px;
      min-width: 509px;
    }
  }
  @media (max-width: 441px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 380px;
      min-width: 380px;
    }
  }
  @media (max-width: 414px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 385px;
      min-width: 385px;
    }
  }
  @media (max-width: 411px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 380px;
      min-width: 380px;
    }
  }
  @media (max-width: 375px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 345px;
      min-width: 345px;
    }
  }
  @media (max-width: 360px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 330px;
      min-width: 330px;
    }
  }
  @media (max-width: 320px){
    .navbar.vue-fixed-header--isFixed {
      position: fixed;
      top: 1rem;
      max-width: 290px;
      min-width: 290px;
    }
  }
  /*@media screen and (max-width: 900px) and (min-width: 600px) {*/
</style>
