<template>
<div role="main">
  <!-- Form -->
  <b-form ref="form" name="questions_form" v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="cancelForm" @invalid.capture.prevent="handleInvalid" @change="handleChange">
    <b-container>
        <fixed-header :fixed.sync="isFixed" :threshold="168">
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
      <p v-if="errors.length" class="eui-banner--danger" id="eui-banner">
        <b><strong>Please correct the following error(s):</strong></b>
        <a href="javascript:void(0)" class="eui-banner__dismiss float_right" title="Dismiss banner"><i class="eui-icon eui-fa-times-circle" @click="dismiss('eui-banner');"></i></a>
      <ul class="eui_banner__message">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
      </p>
    </b-container>
    <b-container name="questions_container" id="questions_container">
        <h2 v-if="warning" class="warning">{{warning}}</h2>
        <!-- Section -->
        <section>
            <b-row v-for="(heading, a_key) in questions" :key="a_key">
                <h2>{{heading.heading}}</h2>
                <div :id="a_key" class="question_section">
                    <!-- Question -->
                    <b-form-group v-for="(question, b_key) in heading" 
                    :class="{ 'form-group-error': ($v.values[question.id] || {}).$error }"
                    :key="b_key" 
                    size="lg" lg=12
                    :disabled="readonly">
                        <label :for="question.id" class="eui-label">{{question.title}}:</label>
                        <span class="required" v-if="question.required == true">* required</span>
                        <p :id="question.id || a_key">{{question.text}}</p>
                        <b-col class="w-25 help">
                          <a href="#" @click.prevent="" :id="'help_' + question.id" v-if="question.help != ''" v-b-modal="'modal_' + question.id">
                          <font-awesome-icon icon="info-circle" name="info icon"/>
                            Help</a>
                          <b-modal :id="'modal_' + question.id" :title="question.title + ' - Help'" ok-only centered>
                            <p class="my-4">{{question.help}}</p>
                          </b-modal>
                        </b-col>
                        <!-- Input -->
                        <b-row>
                          <b-col :lg="question.size || 12" class="question_size">
                            <b-row v-for="(input, c_key) in question.inputs" :key="c_key">
                                <label :for="input.id || input + '_' + c_key" class="eui-label">{{input.label}}: </label>
                                <span class="required" v-if="input.required == true && input.type!='checkbox'">* required</span>
                                <span v-if="input.type == 'textarea' && parseInt(charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))) > 0" style="padding-left:300px;">
                                  {{charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))}} characters left
                                </span>
                                <span v-else-if="input.type == 'text' && parseInt(charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))) > 0" style="padding-left:5px;">
                                  ({{charactersRemaining(values[input.id], getAttribute('maxlength', question.inputs[c_key]))}} characters left)
                                </span>
                                <!-- Text Type of Input -->
                                <b-form-input 
                                    :class="{ 'form-input-error': ($v.values[input.id] || {}).$error }"
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
                                    input.type == 'time' || 
                                    input.type == 'color'"
                                    :disabled="disabled || getAttribute('disabled', question.inputs[c_key])"
                                    :readonly="readonly || getAttribute('readonly', question.inputs[c_key])"
                                    :pattern="getAttribute('pattern', question.inputs[c_key])"
                                    :maxlength="getAttribute('maxlength', question.inputs[c_key])"
                                    :max="getAttribute('max', question.inputs[c_key])"
                                    :minlength="getAttribute('minlength', question.inputs[c_key])"
                                    :min="getAttribute('min', question.inputs[c_key])"
                                    :wrap="getAttribute('wrap', question.inputs[c_key])"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                    >
                                </b-form-input>
                                <!-- End of Text Type of Input -->
                                <!-- Textarea Type of Input -->
                                <b-form-textarea 
                                    :class="{ 'form-textarea-error': ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    :disabled="disabled || getAttribute('disabled', question.inputs[c_key])"
                                    :readonly="readonly || getAttribute('readonly', question.inputs[c_key])"
                                    :cols="getAttribute('cols', question.inputs[c_key])"
                                    :rows="getAttribute('rows', question.inputs[c_key])"
                                    :maxlength="getAttribute('maxlength', question.inputs[c_key])"
                                    :wrap="getAttribute('wrap', question.inputs[c_key])"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                    v-if="input.type == 'textarea'">
                                </b-form-textarea>
                                <!-- End of Textarea Type of Input -->
                                <!-- Radio Group Type of Input -->
                                <b-form-radio-group
                                    :class="{ 'form-radio-group-error': ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    value="true"
                                    unchecked-value="false"
                                    v-if="input.type == 'radio'" 
                                    :options="input.options"
                                    :disabled="disabled || getAttribute('disabled', question.inputs[c_key])"
                                    :readonly="readonly || getAttribute('readonly', question.inputs[c_key])"
                                    :checked="getAttribute('checked', question.inputs[c_key])">
                                </b-form-radio-group>
                                <!-- End of Radio Group Type of Input -->
                                <!-- Checkbox Type of Input -->
                                <b-form-checkbox 
                                    :class="{ 'form-checkbox-error': ($v.values[input.id] || {}).$error, 'checkboxes':true }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    value="true"
                                    unchecked-value="false"
                                    v-if="input.type == 'checkbox'"
                                    :disabled="disabled || getAttribute('disabled', question.inputs[c_key])"
                                    :readonly="readonly || getAttribute('readonly', question.inputs[c_key])"
                                    :checked="getAttribute('checked', question.inputs[c_key])">
                                </b-form-checkbox>
                                <span :id="input.id" class="required" v-if="input.required == true && input.type == 'checkbox'">* required </span>
                                <!-- End of Checkbox Type of Input -->
                                <!-- Select Type of Input -->
                                <b-form-select
                                    :class="{ 'form-select-error': ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :name="input.id" 
                                    v-model="values[input.id]"
                                    size="lg" 
                                    v-if="input.type == 'select'" 
                                    :options="input.options"
                                    :disabled="disabled || getAttribute('disabled', question.inputs[c_key])" 
                                    :readonly="readonly || getAttribute('readonly', question.inputs[c_key])" 
                                    :multiple="getAttribute('multiple', question.inputs[c_key])">
                                </b-form-select>
                                <!-- End of Select Type of Input -->
                                <!-- File Type of Input -->
                                <b-form-file
                                    :class="{ 'form-file-error': ($v.values[input.id] || {}).$error }"
                                    :type="input.type" 
                                    :id="input.id" 
                                    :scope="Boolean(values[input.id])"
                                    :name="input.id" 
                                    v-model="values[input.id]" 
                                    size="lg" 
                                    v-if="input.type == 'file'"
                                    :disabled="disabled || getAttribute('disabled', question.inputs[c_key])" 
                                    :readonly="readonly || getAttribute('readonly', question.inputs[c_key])"
                                    :multiple="getAttribute('multiple', question.inputs[c_key])"
                                    :placeholder="getAttribute('placeholder', question.inputs[c_key])">
                                    >
                                </b-form-file>
                                <!-- End of File Type of Input -->
                                <!-- Selected Input File Name -->
                                <div class="mt-3" v-if="input.type == 'file' && values[input.id] != ''">Selected file: {{ values[input.id] ? values[input.id].name : '' }}</div>
                                <!-- End of Selected Input File Name -->
                                <p :id="input.id + '_invalid'" class="eui-banner eui-banner--danger hidden validation"></p>
                            </b-row>
                          </b-col>
                        </b-row>
                        <!-- End of Input -->
                    </b-form-group>
                    <!-- End of Question -->
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
import { required, requiredIf } from 'vuelidate/lib/validators'
// Jquery javascript
import $ from 'jquery'
import FixedHeader from 'vue-fixed-header'

// This questions component gets the questions data for the selected daac and
// sets the above template properties, methods, and custom validation used.
export default {
  name: 'Questions',
  data() {
    return {
      errors:[],
      values: {},
      questions: {},
      dirty:false,
      formTitle: '',
      saveTimeout: 0,
      daac:'',
      warning:'',
      isFixed:true,
      confirm:false,
      conditionals:[],
      one_ofs:[],
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
            this.$store.commit('pushQuestionsState', Object.assign({}, this.values))
            this.$log.debug('pushQuestionsState', Object.assign({}, this.values))
            var string_logging_object = this.$log.debug('pushQuestionsState')
            this.$logging_object[Date(Date.now()).toString()] = {
              "log_string":string_logging_object,
              "answers": Object.assign({}, this.values)
            }
          }
          delete this.values.fromUndo
          this.$v.$touch()
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
    console.log('Validations ...')
    let val_fields = {
        values: {}
    }
    var obj
    if(typeof this.questions.inputs !='undefined'){
        obj = this.questions.inputs
    } else if (typeof this.questions !='undefined'){
        obj = this.questions
    }
    // Gather required elements
    for (let group of obj) {
        for (let question of group) {
            let one_of = ''
            // If the group is required, assume each input within is required
            if (typeof question.inputs != 'undefined'){
                for (let fld of question.inputs){
                    let get_enums = this.checkEnums(obj, fld.id)
                    let has_yes_no = get_enums[0]
                    let has_enums = get_enums[1]
                    if(has_yes_no){
                        this.conditionals.push(fld.id)
                    } else if(!has_enums){
                        let if_other = this.checkIfOther(obj, fld.id)
                        let is_conditional = if_other[0]
                        if(is_conditional){
                            this.conditionals.push(fld.id)
                        }
                    }
                }
            }
            if (typeof question.required != 'undefined' && question.required) {
                if (typeof question.inputs != 'undefined'){
                    for (let fld of question.inputs){
                        if(fld.type!='checkbox'){
                            val_fields.values[fld.id] = {
                                required
                            }
                        } else {
                            one_of+= fld.id + ','
                        }
                    }
                } 
            // If the required attribute is not at the group level, investigates under input level
            } else if (typeof question.inputs != 'undefined'){
                for (let fld of question.inputs){
                    if (typeof fld.required != 'undefined' && fld.required) {
                        if(fld.type != 'checkbox'){
                            val_fields.values[fld.id] = {
                                required
                            }
                        } else {
                            one_of+= fld.id + ','
                        }
                    }
                }
            }
            if(one_of.split(',').length > 1){
                one_of = one_of.substring(0, one_of.length - 1);
                val_fields.values[one_of] = {
                    required
                }
                if(this.one_ofs.includes(one_of)==false){
                    this.one_ofs.push(one_of)
                }
            }
        }
    }
    this.$conditionals = this.conditionals
    this.$one_ofs = this.one_ofs
    let DAAC_SET = window.localStorage.getItem('DAAC')
    if(DAAC_SET !== null){
        //window.localStorage.setItem(DAAC_SET + '_questions', JSON.stringify(val_fields.values))
        this.$required = JSON.stringify(val_fields.values)
    }
    for (let conditional of this.conditionals) {
        for (let group of obj) {
            for (let question of group) {
                if (typeof question.inputs != 'undefined'){
                    let get_next = false
                    //let prev_fld = {}
                    for (let fld of question.inputs){
                        if (get_next) {
                            val_fields.values[fld.id] = {
                                required: requiredIf(() => {
                                    console.log('checking required if:', fld.id)
                                    if (/if yes/i.test(fld.label)) {
                                        //if (/yes/i.test($('input[name="' + conditional + '"]:checked').val())) {
                                        if (/yes/i.test(this.values[conditional])) {
                                            return true
                                        }
                                    } else if (/if no/i.test(fld.label)) {
                                        //if (/no/i.test($('input[name="' + conditional + '"]:checked').val())) {
                                        if (/no/i.test(this.values[conditional])) {
                                            return true
                                        }
                                    }
                                    return false
                                })
                            }
                            break;
                        }
                        if (conditional == fld.id) {
                            get_next = true
                            if(this.checkIfOther(obj, fld.id)[0]){
                                val_fields.values[fld.id] = {
                                    required: requiredIf(() => {
                                        return this.values[conditional.replace(/_[^_]+$/, '')] == 'true'
                                        //return $('#' + conditional.replace(/_[^_]+$/, '')).is(':checked')
                                    })
                                }
                                break;
                            }
                        }
                        //prev_fld = fld
                    }
                }
            }
        }
    }
    return val_fields
  },
  methods: {
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
    // Gets attributes or returns false if none
    getAttribute(attr, input){
      // mitchell says to just send input.attributes[attr]
      let attribute_value = ''
      let attributes_that_need_false_if_none = ['readonly', 'disabled', 'multiple']
      if(typeof input.attributes != 'undefined' && typeof input.attributes[attr] !='undefined'){
        attribute_value = input.attributes[attr]
      }
      if (attributes_that_need_false_if_none.includes(attr) && attribute_value == ''){
        return false
      }
      return attribute_value
    },
    // @vuese
    // Handle html5 invalidity on change
    handleChange(evt) {
        console.log('handleChange :: ', evt.target.name);
        $('#' + evt.target.name + '_invalid').text(evt.target.validationMessage)
        if(evt.target.validationMessage!=''){
            this.validation_errors = {
                ...this.validation_errors,
                [evt.target.name]: evt.target.validationMessage
            }
            $('#' + evt.target.name + '_invalid').removeClass('hidden')
        } else {
            if(evt.target.name in this.validation_errors){
                delete this.validation_errors[evt.target.name]
            }
            $('#' + evt.target.name + '_invalid').addClass('hidden')
        }
        if(this.errors.length > 0){
            //this.$v.$touch()
            this.hasRequiredFields(this.values, JSON.parse(this.$required))
        }
    },
    // @vuese
    // Handle html5 invalidity on form
    handleInvalid(evt) {
        console.log('handleInvalid :: ', evt.target.name);
        $('#' + evt.target.name + '_invalid').text(evt.target.validationMessage)
        if(evt.target.validationMessage!=''){
            console.log('errors being set to []')
            this.validation_errors = {
                ...this.validation_errors,
                [evt.target.name]: evt.target.validationMessage
            }
            $('#' + evt.target.name + '_invalid').removeClass('hidden')
        } else {
            if(evt.target.name in this.validation_errors){
                delete this.validation_errors[evt.target.name]
            }
            $('#' + evt.target.name + '_invalid').addClass('hidden')
        }
    },
    // @vuese
    // Checks for if other conditional requirement
    checkIfOneOfMeets(obj, req){
        if(typeof obj == 'undefined'){
            obj = this.$questions
        }
        let is_one_of = false
        let has_value = false
        if(typeof req != 'undefined'){
            let fld_has_comma = req.split(',')
            if(fld_has_comma.length > 1){
                is_one_of = true
                for(let k in fld_has_comma){
                    if (fld_has_comma[k] in this.values && this.values[fld_has_comma[k]] !='' && this.values[fld_has_comma[k]]!='false'){
                        has_value = true
                    }
                    let other_poss = this.checkIfOther(this.questions, req)
                    if(!is_one_of && typeof other_poss[2] !='undefined' && !has_value){
                        if (other_poss[2] in this.values && this.values[other_poss[2]] !=''){
                            has_value = true
                        }
                    }
                }
            }
        }
        return [is_one_of, has_value]
    },
    // @vuese
    // Checks for if other conditional requirement
    checkIfOther(obj, req){
        if(typeof obj == 'undefined'){
            obj = this.$questions
        }
        let has_corresponding_fld = false
        let has_if_other = false
        let field_type = ''
        let other_check_id = ''
        for (let group of obj) {
            for (let question of group) {
                if (typeof question.inputs != 'undefined'){
                    for (let fld of question.inputs){
                        let id_info = fld['id'].split('_')
                        other_check_id = id_info[0] + '_' + id_info[1] + '_' + id_info[2]
                        if (req !== fld.id && fld.id !== other_check_id){continue}
                        if(fld.id == other_check_id){
                            has_corresponding_fld = true
                            field_type = fld.type
                        }
                        if(fld.id == req){
                            if(!fld['enums']){
                                if(fld['label'].toLowerCase().match(/if other/g) && fld['type']=='text'){
                                    has_if_other = true
                                }
                            }
                        }
                        if(has_if_other && has_corresponding_fld){
                            return [true, field_type, other_check_id]
                        }
                    }
                }
            }
        }
        return [false, '', other_check_id]
    },
    // @vuese
    // Checks and evaluates enums for conditional requirements
    checkEnums(obj, req){
        if(typeof obj == 'undefined'){
            obj = this.$questions
        }
        let has_yes_no = false
        let has_enums = false
        let idx = 0
        for (let group of obj) {
            for (let question of group) {
                if (typeof question.inputs != 'undefined'){
                    for (let fld of question.inputs){
                        if(fld.id == req){
                            has_enums = false
                            if(fld['enums']){
                                has_enums = true
                                let enums = fld['enums']
                                for(let e in enums){
                                    if(enums[e].toLowerCase().match(/yes/g) || enums[e].toLowerCase().match(/no/g)){
                                        has_yes_no = true
                                    } else {
                                        has_yes_no = false
                                    }
                                }
                            }
                            idx = question.inputs.indexOf(fld)
                        }
                    }
                }
            }
        }
        return [has_yes_no, has_enums, idx]
    },
    // @vuese
    // Applies error styles based on input type
    applyErrorStyle(id, type, remove = false){
        if(type == 'radio'){
            if(!remove){
                document.getElementById(id).style.border = '1px solid red'
                document.getElementById(id).style.borderRadius = '5px'
                document.getElementById(id).style.padding = '0.6em'
            } else {
                document.getElementById(id).style.border = 'unset'
                document.getElementById(id).style.padding = 'unset'
            }
        } else if(type == 'checkbox'){
            if(!remove){
                $('#' + id).parent().parent().parent().css('border','1px solid red')
                $('#' + id).parent().parent().parent().css('border-radius','5px')
                $('#' + id).parent().parent().parent().css('padding','0.6em')
            } else {
                $('#' + id).parent().parent().parent().css('border','unset')
                $('#' + id).parent().parent().parent().css('padding','unset')
            }
        } else {
            if(!remove){
                $('#' + id).addClass('form-checkbox-error')
            } else {
                $('#' + id).removeClass('form-checkbox-error')
            }
        }
    },
    // @vuese
    // Hides errors banner
    dismiss(id){
      document.getElementById(id).style.display='none';
    },
    // @vuese
    // Checks for conditionally required elements from questions
    checkForEnumConditional(req, check_only){
        /* eslint-disable */ if (true) { return [false, '', '']; }/* eslint-enable */
        //console.log('conditional check for ' + req)
        console.log('CURRENTLY TURNED OFF',check_only)
        /*let Qs = this.questions
        var options = []
        let conditional_found = false
        let id_added = ''
        let id_removed = ''
        let alt_msg = ''
        for (var q in Qs){
            let section = Qs[q]
            for (let s in section){
                if(typeof section[s].inputs != 'undefined'){
                    let get_next = false
                    for (let l in section[s].inputs){
                        let enums = section[s].inputs[0]['enums']
                        let details = section[s].inputs[l]
                        if (details['id'] !== req && get_next == false){ continue }
                        if(get_next && (details['label'].toLowerCase().match(/if yes/g) || details['label'].toLowerCase().match(/if no/g)) && details['type']=='text'){
                            if(req in this.values){
                                if  (
                                        (details['label'].toLowerCase().match(/if yes/g) && this.values[req].toLowerCase() == 'yes') || 
                                        (details['label'].toLowerCase().match(/if no/g) && this.values[req].toLowerCase() == 'no')
                                    ){
                                    if(typeof check_only == 'undefined'){
                                        id_added = details['id']
                                        this.applyErrorStyle(details['id'], 'text')
                                        this.applyErrorStyle(req, 'text', true)
                                        let conditional_spelled_out = this.titleCase(req.replace(/_/g,' '))
                                        alt_msg = this.titleCase(details['id'].replace(/_/g,' ')) + " is required because " + conditional_spelled_out + ' is "' + this.titleCase(this.values[req]) + '".'
                                        if(this.errors.includes(alt_msg) == false && (typeof this.values[id_added] == 'undefined' || this.values[id_added] ==='')){console.log('pushing error 1 ',alt_msg);this.errors.push(alt_msg);this.errors.sort();}
                                    }
                                    conditional_found = true
                                    break
                                } else {
                                    id_removed = details['id']
                                }
                            } else {
                                id_removed = details['id']
                            }
                        }
                        if(typeof enums !='undefined'){
                            for (var e in enums){
                                var option = enums[e]
                                var text, value
                                if(typeof enums[e] == 'string'){
                                    text = option
                                    value = option
                                    options.push({ value: option, text: option })
                                } else if (typeof enums[e].value !='undefined' && typeof enums[e].text !='undefined'){
                                    text = enums[e].text
                                    value = enums[e].value
                                    options.push({ value: value, text: text })
                                }
                            }
                            get_next = true
                        }
                    }
                }
                if(conditional_found){
                    break
                }
            }
        }*/
        //if (typeof check_only == 'undefined'){
            /* eslint-disable */
        //    if(!conditional_found){
        //        try{
        //            if(id_removed!='' || id_added!=''){
        //                this.applyErrorStyle(id_removed, 'text', true)
        //                this.applyErrorStyle(req, 'text')
        //            }
        //        } catch(e){ }
        //    } else {
        //        this.hasRequiredFields(this.values, JSON.parse(this.$required))
        //    }
            /* eslint-enable */
        //}
        //return [conditional_found, id_added, id_removed]
    },
    // @vuese
    // Checks for messages in a fuzzy way from errors for #eui-banner
    fuzzySearchForErrors(str){
        let has_match = false
        for(let e in this.errors){
            if(typeof this.errors[e] !== 'undefined'){
                if (this.errors[e].toLowerCase().match(str.toLowerCase())){
                    has_match = true
                    break
        
            }}
        }
        return has_match
    },
    // @vuese
    // Checks for 'if other' conditional from questions and cross references values entered
    // Alters the style, required and errors based on current values of if other condition
    checkForIfOtherConditional(req, check_only){
        let Qs = this.questions
        let conditional_found = false
        let id_added = ''
        let id_removed = ''
        //let multi_msg = ''
        //if it is an array you splice, if it is an object you delete
        for (var q in Qs){
            let section = Qs[q]
            for (let s in section){
                if(typeof section[s].inputs != 'undefined'){
                    for (let l in section[s].inputs){
                        let details = section[s].inputs[l]
                        if (details['id'] !== req){ continue }
                        let id_info = details['id'].split('_')
                        let other_check_id = id_info[0] + '_' + id_info[1] + '_' + id_info[2]
                        if(id_added === '' && details['label'].toLowerCase().match(/if other/g) && details['type']=='text'){
                            if(typeof check_only == 'undefined'){
                                if(other_check_id in this.values){
                                    if(details['label'].toLowerCase().match(/if other/g) && Boolean(this.values[other_check_id]) == true && (this.values[req] == '' || typeof this.values[req] == 'undefined')){
                                        //this.applyErrorStyle(req, 'text')
                                        //this.applyErrorStyle(other_check_id, 'checkbox', true)
                                        for(let e in this.one_ofs){
                                            let re = new RegExp(other_check_id, 'g')
                                            if (this.one_ofs[e].match(re)){
                                                /*let multi_key = this.one_ofs[e].split(',')
                                                if (multi_key.length > 1){
                                                    multi_msg = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(this.one_ofs[e].replace(/_/g,' ').replace(/,/g,', ')) + ')'
                                                }
                                                let index = this.errors.indexOf(multi_msg);
                                                if (index > -1) {
                                                    console.log('splicing out of errors 1',multi_msg)
                                                    this.errors.splice(index, 1);
                                                }*/
                                            }
                                        }
                                        /*let msg = this.titleCase(req.replace(/_/g,' ')) + " is required."
                                        let conditional_spelled_out = this.titleCase(other_check_id.replace(/_/g,' '))
                                        let long_msg = this.titleCase(req.replace(/_/g,' ')) + " is required because " + conditional_spelled_out + ' is checked.'
                                        if(this.includes(long_msg) == false){
                                            console.log('pushing error 2 ',long_msg);
                                            this.errors.push(long_msg);
                                            this.errors.sort();
                                            if(this.errors.includes(msg) == true){
                                                let index = this.errors.indexOf(msg);
                                                if (index > -1) {
                                                    console.log('splicing out of errors 2',msg)
                                                    this.errors.splice(index, 1);
                                                }
                                            }
                                        } else if(this.errors.includes(long_msg) == false && this.conditionals.includes(req)){
                                            let if_other_info = this.checkIfOther(this.questions, req)
                                            let if_other = if_other_info[0]
                                            let other_field_type = if_other_info[1]
                                            if(if_other){
                                                let id_info = req.split('_')
                                                let other_check_id = id_info[0] + '_' + id_info[1] + '_' + id_info[2]
                                                if(other_field_type !== ''){
                                                    msg = this.titleCase(other_check_id.replace(/_/g,' ').replace(/other/g, other_field_type)) + " is required."
                                                    let index = this.errors.indexOf(msg);
                                                    if (index > -1) {
                                                        console.log('splicing out of errors 3',msg)
                                                        this.errors.splice(index, 1);
                                                    }
                                                }
                                                msg = this.titleCase(other_check_id.replace(/_/g,' ')) + " is required."
                                                let index = this.errors.indexOf(msg);
                                                if (index > -1) {
                                                    console.log('splicing out of errors 4',msg)
                                                    this.errors.splice(index, 1);
                                                }
                                            }
                                            this.errors.push(long_msg);
                                            this.errors.sort();
                                            console.log('pushing error 3 ',long_msg)
                                        } else if(this.fuzzySearchForErrors(msg) == false){
                                            console.log('pushing error 4 ',msg);
                                            this.errors.push(msg);
                                            this.errors.sort();
                                        }*/
                                        conditional_found = true
                                        break
                                    } else {
                                        id_removed = req
                                    } 
                                } else {
                                    id_removed = req
                                }
                            }
                        }
                    }
                }
                if(conditional_found){
                    break
                }
            }
            if(conditional_found){
                break
            }
        }
        if (this.conditionals.includes(req) && typeof check_only == 'undefined'){
            /* eslint-disable */
            if(!conditional_found){
                try{
                    if(id_removed!=''){
                        //this.applyErrorStyle(id_removed, 'text', true)
                        //this.applyErrorStyle(req, 'text')
                    }
                } catch(e){ }
            }
            //console.log('has required from if other conditionals')
            //this.hasRequiredFields(this.values, JSON.parse(this.$required), req, true)
            /* eslint-enable */
        }
        
        return conditional_found
    },
    /* eslint-disable */
    checkForMessages(args, splice = true){
        let current_messages = this.errors
        let pattern = ''
        for (let ea in args){
            let d = args[ea]
            let msg = ''
            let pattern1_found = false
            let pattern2_found = false
            let pattern3_found = false
            let pattern4_found = false
            let found = false
            pattern = ''
            if(typeof d !='undefined' && typeof d['id'] !='undefined'){
                if(d['conditional_spelled_out']){
                    let conditional_spelled_out = this.titleCase(d['conditional_spelled_out'].replace(/_/g,' '))
                    let pattern1 = this.titleCase(d['id'].replace(/_/g,' ')) + " is required because " + conditional_spelled_out + ' is "' + this.titleCase(this.values[d['conditional_spelled_out']]) + '".'
                    console.log('PATTERN1',pattern1)
                    if(current_messages.includes(pattern1)==true){ 
                        pattern = '1' 
                        if(splice){
                            let index = current_messages.indexOf(pattern1);
                            if (index > -1) {
                                current_messages.splice(index, 1);
                            }
                        }
                    }
                }
                if(d['other_field_type']){
                    let pattern2 = this.titleCase(d['id'].replace(/_/g,' ').replace(/other/g, d['other_field_type'])) + " is required."
                    console.log('PATTERN2',pattern2)
                    if(current_messages.includes(pattern2)==true){ 
                        pattern = '2'
                        if(splice){
                            let index = current_messages.indexOf(pattern2);
                            if (index > -1) {
                                current_messages.splice(index, 1);
                            }
                        }
                    }
                } else if(parseInt(d['id'].split(',').length) > 1){
                    let pattern3 = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(d['id'].replace(/_/g,' ').replace(/,/g,', ')) + ').'
                    console.log('PATTERN3',pattern3)
                    if(current_messages.includes(pattern3)==true){ 
                        pattern = '3'
                        if(splice){
                            let index = current_messages.indexOf(pattern3);
                            if (index > -1) {
                                current_messages.splice(index, 1);
                            }
                        }
                    }
                } else {
                    let pattern4 = this.titleCase(d['id'].replace(/_/g,' ')) + " is required."
                    console.log('PATTERN4',pattern4)
                    if(current_messages.includes(pattern4)==true){
                        pattern = '4' 
                        if(splice){
                            let index = current_messages.indexOf(pattern4);
                            if (index > -1) {
                                current_messages.splice(index, 1);
                            }
                        }
                    }
                }
                if(pattern !== ''){
                    console.log('MESSAGES CHECK',d,pattern)
                }
            }
        }
        return pattern
    },
    /* eslint-disable */
    updateMessages(args){
        let current_messages = this.errors
        for (let ea in args){
            let d = args[ea]
            for(let ea in d){
                if(ea.match(/add_message/g)){
                    if(current_messages.includes(d[ea])==false){
                        current_messages.push(d[ea])
                    }    
                } else if (ea.match(/splice_out/g)){
                    if(current_messages.includes(d[ea])==true){
                        let index = current_messages.indexOf(d[ea]);
                        if (index > -1) {
                            current_messages.splice(index, 1);
                        }
                    }
                } else if (ea.match(/build_conditional_message/g)){
                    let conditional_msg = ''
                    if(d[ea]['conditional_spelled_out']){
                        let conditional_spelled_out = this.titleCase(d[ea]['conditional_spelled_out'].replace(/_/g,' '))
                        conditional_msg = this.titleCase(d[ea]['id'].replace(/_/g,' ')) + " is required because " + conditional_spelled_out + ' is "' + this.titleCase(this.values[d[ea]['conditional_spelled_out']]) + '".'
                    } else {
                        conditional_msg = this.titleCase(d[ea]['id'].replace(/_/g,' ')) + " is required."
                    }
                    if(current_messages.includes(conditional_msg)==false){
                        current_messages.push(conditional_msg)
                    }
                } else if (ea.match(/build_if_other_message/g)){
                    if(d[ea]['other_field_type']){
                        let if_other_msg = this.titleCase(d[ea]['id'].replace(/_/g,' ').replace(/other/g, d[ea]['other_field_type'])) + " is required."
                    } else {
                        let one_of_msg = this.titleCase(d[ea]['id'].replace(/_/g,' ')) + " is required."
                    }
                    if(current_messages.includes(one_of_msg)==false){
                        current_messages.push(one_of_msg)
                    }
                } else if (ea.match(/build_oneof_message/g)){
                    let one_of_msg = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(d[ea].replace(/_/g,' ').replace(/,/g,', ')) + ').'
                    if(current_messages.includes(one_of_msg)==false){
                        current_messages.push(one_of_msg)
                    }
                } else if (ea.match(/build_message/g)){
                    let str = this.titleCase(d[ea].replace(/_/g,' ')) + " is required."
                    if(current_messages.includes(str)==false){
                        current_messages.push(str)
                    }
                }
            }
        }
        return current_messages
    },
    isMultiKey(field_specified, r, skip_rebuild){
        let is_invalid = false
        let multi_key = r.split(',')
        let is_invalid_msgs = {}
        for (let k in multi_key){
            let req = multi_key[k]
            if(typeof field_specified !='undefined' && field_specified != req){continue}
            let req_type = $('#' + req).attr('type')
            let meets_conditional = false
            let has_yes_no = false
            let is_conditional = false
            let is_if_other = false
            let is_oneof = false
            let has_value = false
            let has_values = false
            for(let v in this.values){
                if (this.values[v]=='false'){
                    delete this.values[v]
                }
            }
            if(typeof this.values != 'undefined' && Object.keys(this.values).length !== 0){
                has_values = true
            }
            let has_enums = false
            let get_enums = this.checkEnums(this.questions, req)
            has_yes_no = get_enums[0]
            has_enums = get_enums[1]
            if (this.conditionals.includes(req) || this.conditionals.includes(r)){
                is_conditional = true
            }
            if(has_yes_no){
                let meets_info = this.checkForEnumConditional(req, true)
                meets_conditional = meets_info[0]
                let id_added = meets_info[1]
                let id_removed = meets_info[2]
            } else if(!has_enums){
                meets_conditional = this.checkForIfOtherConditional(req, true)
            }
            let if_other_info = this.checkIfOther(this.questions, req)
            let if_other = if_other_info[0]
            let other_field_type = if_other_info[1]
            let other_check_id =''
            if(if_other){
                is_if_other = true
                let id_info = req.split('_')
                other_check_id = id_info[0] + '_' + id_info[1] + '_' + id_info[2]
            }
            let one_of_info = this.checkIfOneOfMeets(this.questions, r)
            is_oneof = one_of_info[0]
            has_value = one_of_info[1]
            if(has_value){
                meets_conditional = true
            }
            let req_evaluation = {
                'id':req,
                'is_multikey':true,
                'req_type':req_type,
                'meets_conditional':meets_conditional,
                'has_yes_no':has_yes_no,
                'is_conditional':is_conditional,
                'is_if_other':is_if_other,
                'is_oneof':is_oneof,
                'has_value':has_value,
                'has_values':has_values
            }
            if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                //console.log('EVAL',req_evaluation)
            }
            if(!has_values){
                is_invalid = true
                if(typeof skip_rebuild == 'undefined'){
                    this.applyErrorStyle(r, req_type)
                    if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                        //console.log('ADDING ')
                    }
                }
            }
            if(has_value && has_values && is_conditional && is_oneof){
                if(typeof skip_rebuild == 'undefined'){
                    this.applyErrorStyle(r, req_type, true)
                    if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                        //console.log('REMOVING ')
                    }
                }
            }
            if(has_values && !has_value){
                for (let val in this.values){
                    if((val === req && this.values[val] == '') || !this.values[req]){
                        //console.log(req + ' is invalid?')
                        is_invalid = true
                        if(typeof skip_rebuild == 'undefined'){
                            this.applyErrorStyle(r, req_type)
                            if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                                //console.log('ADDING A')
                            }
                        }
                    } else {
                        if(typeof skip_rebuild == 'undefined'){
                            //console.log(req + ' is valid?')
                            this.applyErrorStyle(r, req_type, true)
                            if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                                //console.log('REMOVING b')
                            }
                        }
                    }
                }
            } else if (is_oneof && meets_conditional && has_value){
                if(typeof skip_rebuild == 'undefined'){
                    this.applyErrorStyle(r, req_type, true)
                    if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                        //console.log('REMOVNG C ')
                    }
                }
            } else if (meets_conditional){
                if(typeof skip_rebuild == 'undefined'){
                    this.applyErrorStyle(r, req_type, true)
                    if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                        //console.log('REMOVING D ')
                    }
                }
            }
            if (!req in JSON.parse(this.$required)){
                if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                    //console.log('STILL IN REQ??????????????????????',req in JSON.parse(this.$required))
                }
            }
            if(is_invalid){
                let args = []
                if(!is_if_other && is_oneof && !meets_conditional){
                    args.push({
                        'build_oneof_message':r
                    })
                } else if(is_oneof && !meets_conditional){
                    args.push({
                        'build_if_other_message':{
                            'id':id,
                            'other_field_type':other_field_type
                        }
                    })
                } 
                this.updateMessages(args)
                //console.log('AFTER UPDATING MULTI',has_value,has_values,req in JSON.parse(this.$required))
                if(meets_conditional){
                    if(is_invalid && (!has_value || !has_values)){
                        let args = []
                        if(!is_if_other && is_oneof && !meets_conditional){
                            args.push({'id':r})
                        } else if(is_oneof && !meets_conditional){
                            args.push({
                                'id':id,
                                'other_field_type':other_field_type
                            })
                        } 
                        this.checkForMessages(args)
                    }
                }
            }
            if(this.errors.length > 0 && typeof field_specified == 'undefined') {
                is_invalid = true
                if($('#eui-banner').hasClass('hidden')){
                    $('#eui-banner').removeClass('hidden')
                }
            }
            this.checkInvalidGroupsBorders()
            req_evaluation = {
                'id':req,
                'is_multikey':true,
                'req_type':req_type,
                'meets_conditional':meets_conditional,
                'has_yes_no':has_yes_no,
                'is_conditional':is_conditional,
                'is_if_other':is_if_other,
                'is_oneof':is_oneof,
                'has_value':has_value,
                'has_values':has_values
            }
            //console.log(req_evaluation)
        }
        return is_invalid
    },
    // @vuese
    // Checks required values against required elements
    hasRequiredFields(VALS, REQ, field_specified, skip_rebuild){ 
        console.log('has required?')
        let is_invalid = false
        let has_values = false
        if(typeof field_specified == 'undefined'){
            console.log('errors being set to []')
            this.errors = []
        } else {
            console.log('field_specified is ',field_specified)
        }
        if(typeof VALS == 'string'){
            VALS = JSON.parse(VALS)
        }
        for(let v in VALS){
            if (VALS[v]=='false'){
                delete VALS[v]
            }
        }
        if(typeof VALS != 'undefined' && Object.keys(VALS).length !== 0){
            has_values = true
        }
        for (let req in REQ ){
            if(typeof field_specified !='undefined' && field_specified !== req){continue}
            let req_type = $('#' + req).attr('type')
            //long_msg = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(req.replace(/_/g,' ').replace(/,/g,', ')) + ')'
            let multi_key = req.split(',')
            if(multi_key.length > 1){ 
                is_multikey = true
                //console.log('TO MULTI')
                this.isMultiKey(field_specified, req, skip_rebuild)
                continue
            }
            let is_multikey = false
            let meets_conditional = false
            let has_yes_no = false
            let is_conditional = false
            let is_if_other = false
            let is_oneof = false
            let has_value = false
            let has_enums = false
            let get_enums = this.checkEnums(this.questions, req)
            let id_removed = ''
            let id_added = ''
            has_yes_no = get_enums[0]
            has_enums = get_enums[1]
            if (this.conditionals.includes(req)){
                is_conditional = true
            }
            if(has_yes_no){
                let meets_info = this.checkForEnumConditional(req)
                meets_conditional = meets_info[0]
                id_added = meets_info[1]
                id_removed = meets_info[2]
            } else if(!has_enums){
                meets_conditional = this.checkForIfOtherConditional(req)
            }
            let if_other_info = this.checkIfOther(this.questions, req)
            let if_other = if_other_info[0]
            let other_field_type = if_other_info[1]
            let other_check_id = ''
            if(if_other){
                is_if_other = true
                let id_info = req.split('_')
                other_check_id = id_info[0] + '_' + id_info[1] + '_' + id_info[2]
            }
            let one_of_info = this.checkIfOneOfMeets(this.questions, req)
            is_oneof = one_of_info[0]
            if(is_oneof){
                has_value = one_of_info[1]
            }
            let req_evaluation = {
                'id':req,
                'is_multikey':false,
                'req_type':req_type,
                'meets_conditional':meets_conditional,
                'has_yes_no':has_yes_no,
                'is_conditional':is_conditional,
                'is_if_other':is_if_other,
                'is_oneof':is_oneof,
                'has_value':has_value,
                'has_values':has_values,
                'id_removed':id_removed,
                'id_added':id_added
            }
            if(req.match(/archival_approval_dependencies/g)){
                console.log('YOOOoo',$('#questions label[for="' + req + '"]').textContent)
                if(typeof($('#questions label[for="' + req + '"]').textContent)!='undefined'){
                    let get_label = $('#questions .row[for="' + req + '"]').textContent.toLowerCase()
                    let proceeding_text = $('#questions label[for="archival_approval_dependencies_explanation"]').parentElement.parentNode.innerText.toLowerCase().split(get_label)
                    //console.log('YOOOoo',get_label,proceeding_text)
                    //if($('#questions label[for="' + req + '"]').textContent.split(',')[0].toLowerCase()=='if yes'){

                    //}
                }
                //console.log('YOOOoo',req_evaluation,JSON.parse(this.$required),this.values[req],this.conditionals)
                // start has radios not explanation and has_yes_no with 'removed' of "archival_approval_dependencies_explanation"

                /* req has explanation on no and on yes:
                    has_value: false
                    has_values: true
                    has_yes_no: false
                    id: "archival_approval_dependencies_explanation"
                    id_added: ""
                    id_removed: ""
                    is_conditional: false
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "text"

                    this required
                */
            }
            if((id_added!='' || id_removed!='')){
                if(!req in JSON.parse(this.$required)){
                    meets_conditional = false
                }
                //console.log('EVAL 0',req_evaluation,req in JSON.parse(this.$required))
                
            } else 
            if(!has_value && is_conditional && has_yes_no){
                //console.log('EVAL 1',req_evaluation,req in JSON.parse(this.$required))
                if(id_added!='' || id_removed!=''){
                    //console.log('EVAL 1b',req_evaluation,req in JSON.parse(this.$required))
                    //console.log(this.$required)
                }
                //archival_approval_dependencies_radios
                //data_product_restrictions_public
            } else if(!has_value && is_conditional && is_if_other){
                //console.log('EVAL 2',req_evaluation,req in JSON.parse(this.$required))
                //is data_format_other info
            } else if(is_oneof){
                //console.log('EVAL 3',req_evaluation,req in JSON.parse(this.$required))
            }
            if(!this.conditionals.includes(req) && id_added === '' && id_removed===''){
                //console.log(this.$required)

            } else if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                //console.log('EVAL 4',req_evaluation,req in JSON.parse(this.$required))
                //ON START HAS data_format_other_info:
                /*
                    has_value: false
                    has_values: false
                    has_yes_no: false
                    id: "data_format_other_info"
                    is_conditional: true
                    is_if_other: true
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "text"
                */

                //APPROVAL:
                //radios yes (BOTH SAME):
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "archival_approval_dependencies_radios"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: true
                    req_type: "radio"
                */
                //radios no (this meets false)
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "archival_approval_dependencies_radios"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "radio"
                */
                //explan
                /*
                    has_value: false
                    has_values: true
                    has_yes_no:  (not always same)
                    id: "archival_approval_dependencies_explanation" (not always same)
                    is_conditional: false (not always same)
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false (not always same)
                    req_type: "text"
                */
                //" " explan
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: false
                    id: "archival_approval_dependencies_explanation"
                    is_conditional: false
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "text"
                */
                //no explan
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true (is different)
                    id: "archival_approval_dependencies_radios" (is_different)
                    is_conditional: true (is_different)
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "radio"
                */

                //RESTRICTIONS:
                //radios yes (BOTH SAME):
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "data_product_restrictions_public"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "radio"
                */
                //radios no (this meets true):
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "data_product_restrictions_public"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: true
                    req_type: "radio"
                */
                //explan
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "data_product_restrictions_public"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "radio"
                */
                //no explan
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "data_product_restrictions_public"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "radio"
                */
                //" " explan
                /*
                    has_value: false
                    has_values: true
                    has_yes_no: true
                    id: "data_product_restrictions_public"
                    is_conditional: true
                    is_if_other: false
                    is_multikey: false
                    is_oneof: false
                    meets_conditional: false
                    req_type: "radio"
                */
            }
            if(!has_value){
                is_invalid = true
                if(typeof skip_rebuild == 'undefined'){
                    this.applyErrorStyle(req, req_type)
                    if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                        console.log('ADDING ',req)
                    }
                }
            }
            
            if (!req in JSON.parse(this.$required)){
                if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                    //console.log('STILL IN REQ??????????????????????',req in JSON.parse(this.$required))
                }
            }
            if(has_values && !has_value){
                for (let val in VALS){
                    if(!has_yes_no && is_conditional && is_if_other){
                        if(typeof skip_rebuild == 'undefined'){
                            if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                                //console.log('REMOVING 1 ',req)
                            }
                            this.applyErrorStyle(req, req_type, true)
                        }
                    } else if((val === req && VALS[val] == '') || !VALS[req]){
                        if(typeof skip_rebuild == 'undefined'){
                            if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                                //console.log('ADDING 1 ',req)
                            }
                            this.applyErrorStyle(req, req_type)
                        }
                    } else {
                        if(typeof skip_rebuild == 'undefined'){
                            if(this.conditionals.includes(req) || (req=='archival_approval_dependencies_explanation' || req == 'data_product_restrictions_explanation' || req == 'data_product_restrictions_public')){
                                //console.log('REMOVING 2 ',req)
                            }
                            this.applyErrorStyle(req, req_type, true)
                            if(!is_conditional && !has_value && !meets_conditional && !has_yes_no && !is_if_other){
                                has_value = true
                                meets_conditional = true
                            }
                        }
                    }
                }
            }
            if(is_invalid){
                let args = []
                if(is_conditional && is_if_other && !meets_conditional && typeof this.values[req]!='undefined'){
                    args.push({
                        'build_conditional_message':{
                            'id':other_check_id,
                            'conditional_spelled_out':req
                        }
                    })
                } else if(!meets_conditional && !is_if_other){
                    args.push({'build_message':req})
                }
                this.updateMessages(args)
                //console.log('AFTER UPDATING',has_value,has_values,req in JSON.parse(this.$required))
                if (meets_conditional){
                    if(is_invalid && (!has_value || !has_values)){
                        let args = []
                        if(!is_if_other && is_oneof && !meets_conditional){
                            args.push({'id':r})
                        } else if(is_oneof && !meets_conditional){
                            args.push({
                                'id':id,
                                'other_field_type':other_field_type
                            })
                        }
                        if(is_conditional && is_if_other && !meets_conditional && typeof this.values[req]!='undefined'){
                            args.push({
                                'id':other_check_id,
                                'conditional_spelled_out':req
                            })
                        } else if(!meets_conditional && !is_if_other){
                            args.push({'id':req})
                        } 
                        this.checkForMessages(args)
                    }
                }
            }
            if(this.errors.length > 0 && typeof field_specified == 'undefined') {
                if($('#eui-banner').hasClass('hidden')){
                    $('#eui-banner').removeClass('hidden')
                }
            }
            this.checkInvalidGroupsBorders()
            req_evaluation = {
                'id':req,
                'is_multikey':false,
                'req_type':req_type,
                'meets_conditional':meets_conditional,
                'has_yes_no':has_yes_no,
                'is_conditional':is_conditional,
                'is_if_other':is_if_other,
                'is_oneof':is_oneof,
                'has_value':has_value,
                'has_values':has_values
            }
            //console.log(req_evaluation)
        }
        return is_invalid
    },
    // @vuese
    // Verify by group, that only one red border exists
    checkInvalidGroupsBorders(){
      let groups = $('.bv-no-focus-ring')
      let errors_possible = ['form-checkbox-error','form-file-error','form-select-error','form-textarea-error','form-radio-group-error','form-checkbox-error','form-input-error']
      for (let grp in groups){
        if(typeof groups[grp].style != 'undefined'){
          let group_style_border = groups[grp].style.border
          if(typeof group_style_border != 'undefined' && group_style_border.match(/red/g)){
            for (let i in errors_possible){
              let inputs = $(groups[grp]).find('.' + errors_possible[i])
              if(inputs.length > 0){
                $(inputs).removeClass(errors_possible[i])
              }
            }
          }
        }
      }
    },
    // @vuese
    // Re-applies the data entry values from values from the store for on undo and redo
    reApplyValues(){
      let vals = this.$store.state.question_answers[this.$store.state.question_answers.length - 1]
      if (!vals) {
        vals = {}
      }
      vals.fromUndo = true
      this.values = vals
    },
    // @vuese
    // Fetchs the questions data
    fetchQuestions(){
      // Fires on load when building the form content
      console.log('FETCH QUESTIONS')
      var question = []
      var ignore_attributes = ['list','step','pattern','accept','autocomplete','autofocus','capture','dirname']

      // TODO - TESTING ONLY /////////////////////////////////////////////////////////////////////////////////////
      let form = this.getPath()[0]
      let json_name = ''
      if(form.match(/interest/g)){
        json_name = 'archival_interest' 
      } else {
        json_name = form + '/data_product_questionaire' 
      }
      $.getJSON( "../" + json_name + ".json", ( questions ) => {
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
          var questions_section = questions['sections'][section]['questions']
          questions_section['heading'] = heading
          for (var q in questions_section){
            if(typeof questions_section[q].inputs != 'undefined'){
              for(var input in questions_section[q].inputs){
                //var attrib_string = ' '
                //if(typeof questions_section[q].inputs[input].attributes !='undefined'){
                  // This builds a string of attributes to apply to the input
                  //for (var attr in questions_section[q].inputs[input].attributes){
                    //if(ignore_attributes.includes(attr)==false){
                      //attrib_string += attr + '="' + questions_section[q].inputs[input].attributes[attr] + '" '
                    //}
                  //}
                //}
                //questions_section[q]['attrib_string'] = attrib_string
                //console.log("'" + attrib_string + "'")
                // Handles the enums options
                var options = []
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
      let is_invalid = this.saveFile(str)
      if (!is_invalid) {
        this.$emit('submit-form', window.localStorage.getItem(this.DAAC + '_questions'))
      }
    },
    // @vuese
    // Used to save file
    // TODO - API call will go here
    saveFile(with_msg) {
      //console.log('Executing save file ...')
      // Saves file to localStorage
      const data = JSON.stringify(this.values)
      console.log('required',this.$required)
      var DAAC
      if(this.daac == null){
        DAAC = window.localStorage.getItem('DAAC')
      } else {
        DAAC = this.daac
      }
      let is_invalid = this.hasRequiredFields(data, JSON.parse(this.$required))
      if(!is_invalid){
        if(typeof DAAC != 'undefined' && DAAC !== null && data !== JSON.stringify({})){
          if (this.$refs.form.checkValidity()) {
            //console.log('checking validity')
            this.submitForm('from save');
          } else {
            //console.log('reporting validity')
            this.$refs.form.reportValidity();
          }
          //window.localStorage.setItem(DAAC + '_questions', data);
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
          //this.$log.debug('this.showDaacs', 'some error')
          if(with_msg){
            alert('Your data has been saved.  Click submit to send the data.')
          }
        }
      } else {
        if($('.vue-go-top__content').is(":visible")){
          $('.vue-go-top__content').click()
        }
      }
      return is_invalid
    },
    // @vuese
    // Save as draft and exit form
    draftFile(with_msg) {
      let is_invalid = this.saveFile(with_msg)
      if(!is_invalid){
        this.exitForm()
      }
    },
    // @vuese
    // Cancel and exit form
    okToCancel(){
      this.$refs.form.reset()
      $('#reset_data').focus()
      let errors_possible = ['form-checkbox-error','form-file-error','form-select-error','form-textarea-error','form-radio-group-error','form-checkbox-error','form-input-error']
      let inputs = $('#questions_container input')
      let textareas = $('#questions_container textarea')
      let groups = $('.bv-no-focus-ring')
      for (let i in inputs){
        if (typeof inputs[i] == 'object'){
          for (let k in errors_possible){
            if ($(inputs[i]).hasClass(errors_possible[k])){
              $(inputs[i]).removeClass(errors_possible[k])
            }
          }
        }
      }
      for (let i in textareas){
        if (typeof textareas[i] == 'object'){
          for (let k in errors_possible){
            if ($(textareas[i]).hasClass(errors_possible[k])){
              $(textareas[i]).removeClass(errors_possible[k])
            }
          }
        }
      }
      for (let i in groups){
        if (typeof groups[i] == 'object'){
          for (let k in errors_possible){
            if ($(groups[i]).hasClass(errors_possible[k])){
              $(groups[i]).removeClass(errors_possible[k])
            }
          }
          try{
            $(groups[i]).css('border','unset')
            $(groups[i]).css('padding','unset')
          } catch(e) {
            // console.error(e)
          }
        }
      }
      $('#eui-banner').addClass('hidden')
      let validation_messages = $('.validation')
      for (let i in validation_messages){
        if (typeof validation_messages[i] == 'object'){
          if (!$(validation_messages[i]).hasClass('hidden')){
            $(validation_messages[i]).addClass('hidden')
          }
        }
      }
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
              // console.log(err) // An error occurred
              alert(err)
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
      alert('Form will exit.')
    },
    // @vuese
    // Undos the form and reverts it to its previous state.
    undoToPreviousState(){
      this.undo();
      this.reApplyValues()
    },
    // @vuese
    // Redo the form and to its previous state.
    redoToPreviousState(){
      this.redo();
      this.reApplyValues()
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
    if(form.toLowerCase().match(/questionaire/g)){
        this.daac = null
    } else {
        if(typeof this.$route != 'undefined' && typeof this.$route.params.default != 'undefined'){
            this.daac = this.$route.params.default
        } else if(window.localStorage.getItem('DAAC')!=null){
            this.daac = window.localStorage.getItem('DAAC')
        }
        if(this.daac == null){
            this.$router.push({ name: form_name_prefix + 'Daacs', path: '/selection', default: 'selection' })
        }

        let set_loc = location.href
        let re = '/' + form + '/questions/'
        if(!set_loc.match(re, 'g')){
            set_loc += '/' + form + '/questions/'
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
  .form-group-error {
    border-color: red;
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
