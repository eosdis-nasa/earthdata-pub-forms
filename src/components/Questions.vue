<template>
<div role="main">
  <!-- Form -->
  <b-form ref="form" name="questions_form" v-on:submit.stop.prevent @submit="enterSubmitForm" @invalid.capture.prevent="handleInvalid" @change="handleInvalid">
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
                      <!-- draft button -->
                      <b-button v-if="Object.keys(this.values).length > 0" class="eui-btn--blue" type="draft" id="draft_data" @click="draftFile()" aria-label="draft button">{{ draftLabel }}</b-button>
                      <b-button v-else disabled class="eui-btn--blue" type="draft" id="draft_data" @click="draftFile()" aria-label="draft button">{{ draftLabel }}</b-button>
                      <!-- save button -->
                      <b-button v-if="Object.keys(this.values).length > 0" class="eui-btn--blue" type="save" id="save_data" @click="saveFile()" aria-label="save button">{{ saveLabel }}</b-button>
                      <b-button v-else disabled class="eui-btn--blue" type="save" id="save_data" @click="saveFile()" aria-label="save button">{{ saveLabel }}</b-button>
                      <!-- submit button -->
                      <b-button v-if="this.$v.$anyError || Object.keys(this.values).length == 0" class="eui-btn--green" type="submit" disabled id="submit_data" @click="submitForm()" aria-label="submit button">{{ submitLabel }}</b-button>
                      <b-button v-else class="eui-btn--green" type="submit" id="submit_data" @click="submitForm()" aria-label="submit button">{{ submitLabel }}</b-button>
                      <!-- cancel button -->
                      <b-button v-if="showCancelButton" class="eui-btn--red" type="reset" id="reset_data" aria-label="cancel button" @click="cancelForm()">{{ cancelLabel }}</b-button>
                      <b-button v-else class="eui-btn--red" type="reset" id="reset_data" @click="cancelForm()" disabled>{{ cancelLabel }}</b-button>
                  </div>
              </div>
          </div>
      </fixed-header>
    </b-container>
    <b-container name="questions_container" id="questions_container">
        <h2 v-if="warning" class="warning">{{warning}}</h2>
        <!-- Section -->
        <section>
            <b-row v-for="(heading, a_key) in questions" :key="a_key">
              <li class="eui-banner--danger same-as-html5" v-bind:key="a_key" v-if="($v.values[`section_${a_key}`] || {}).$error">Section {{ heading.heading }} is required</li>
              <div :class="{ 'form-section-error': ($v.values[`section_${a_key}`] || {}).$error }" class="w-100" v-if="showIf(heading.heading_show_if)">
                <input type="hidden" :id="`section_${a_key}`" v-if="heading.heading_required" />
                <h2>{{heading.heading}}</h2>
                <div :id="a_key" class="question_section w-100">
                    <!-- Question -->
                    <template v-for="(question, b_key) in heading"  >
                      <b-form-group v-if="showIf(question.show_if)"
                        :class="{ 'form-group-error': ($v.values[`question_${a_key}_${b_key}`] || {}).$error }"
                        size="lg" lg=12
                        :disabled="disabled"
                        :readonly="readonly"
                        :key="b_key"
                      >
                      <input type="hidden" :id="`question_${a_key}_${b_key}`" v-if="question.required" />
                      <label :for="question.short_name" class="eui-label-nopointer">{{question.long_name}}</label>
                      <span class="required" v-if="question.required == true">* required</span>
                      <p :id="question.short_name || a_key">{{question.text}}</p>
                      <span class="help">
                        <a href="#" @click.prevent="" :id="`help_${question.short_name}`" v-if="question.help != ''" v-b-modal="`modal_${question.short_name}`">
                        <font-awesome-icon icon="info-circle" name="info icon"/>
                          Help</a>
                        <b-modal :id="`modal_${question.short_name}`" :title="`${question.long_name} - Help`" ok-only centered>
                          <p class="my-4">{{question.help}}</p>
                        </b-modal>
                      </span>
                      <!-- Input -->
                      <b-row>
                        <b-col :lg="question.size || 12" class="question_size">
                          <template v-for="(input, c_key) in question.inputs">
                            <span  :key="c_key">
                              <span v-if="input.type == 'checkbox'" class="checkbox">
                                <label :for="input.control_id || `${input}_${c_key}`" class="eui-label-nopointer" v-if="input.label !== undefined && input.type != 'checkbox'">{{input.label}}: </label>
                                <label :for="input.control_id || `${input}_${c_key}`" class="eui-label" v-if="input.label !== undefined && input.type == 'checkbox'">{{input.label}}: </label>
                                <!-- Checkbox Type of Input -->
                                <b-form-checkbox 
                                  :class="{ 'form-checkbox-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error, 'checkboxes':true }"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
                                  size="lg" 
                                  value="true"
                                  unchecked-value="false"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))">
                                </b-form-checkbox>
                                <!-- End of Checkbox Type of Input -->
                              </span>
                          <b-row v-else>
                            <span :id="input.control_id" class="required" v-if="input.required == true && input.type == 'checkbox'">* required</span>
                            <template v-if="showIf(input.show_if)">
                              <label :for="input.control_id || `${input}_${c_key}`" class="eui-label-nopointer" v-if="input.label !== undefined && input.type != 'checkbox' && input.type != 'bbox'">{{input.label}}:</label>
                              <label :for="input.control_id || `${input}_${c_key}`" class="eui-label" v-if="input.label !== undefined && input.type == 'checkbox'">{{input.label}}: </label>
                              <span class="required" v-if="input.required == true && input.type!='checkbox'">* required</span>
                              <span class="date_formats" v-if="input.type == 'date'"><b>Preferred format: </b><span class="date_formats_required">YYYY-MM-DD</span></span>
                              <span v-if="input.type == 'textarea' && parseInt(charactersRemaining(values[input.control_id], getAttribute('maxlength', question.inputs[c_key]))) > 0" style="padding-left:300px;">
                                {{charactersRemaining(values[input.control_id], getAttribute('maxlength', question.inputs[c_key]))}} characters left
                              </span>
                              <span v-else-if="input.type == 'text' && parseInt(charactersRemaining(values[input.control_id], getAttribute('maxlength', question.inputs[c_key]))) > 0" style="padding-left:5px;">
                                ({{charactersRemaining(values[input.control_id], getAttribute('maxlength', question.inputs[c_key]))}} characters left)
                              </span>
                              <span v-for="(contact,contact_key) in contacts" :key="contact_key">
                                <span id="contact_span" v-if="contact != values[input.control_id] && contact != ''">
                                  <label 
                                    :id="`same_as_${input.control_id}_label`"
                                    :for="`same_as_${input.control_id}`" 
                                    v-if="input.contact == true" 
                                    @click="setContact(input.control_id, contact)"
                                    class="eui-label"> 
                                    Same as {{contact}} </label>
                                    <b-form-checkbox 
                                      class="eui-checkbox"
                                      v-if="input.contact == true"
                                      :id="`same_as_${input.control_id}`"
                                      value="true"
                                      unchecked-value="false"
                                      @change.native="setContact(input.control_id, contact)"
                                      @click.native="setContact(input.control_id, contact)"
                                      @keyup.space.native="setContact(input.control_id, contact)">
                                    </b-form-checkbox>
                                </span>
                              </span>
                              <!-- Text Type of Input -->
                              <b-form-input 
                                  :class="{ 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
                                  size="lg" 
                                  v-if="input.type == 'text' || 
                                  input.type == 'password' || 
                                  input.type == 'number' || 
                                  input.type == 'url' || 
                                  input.type == 'email' || 
                                  input.type == 'search' ||
                                  input.type == 'range' ||
                                  input.type == 'tel' || 
                                  input.type == 'time'"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                  :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                  :pattern="getAttribute('pattern', question.inputs[c_key])"
                                  :maxLength="getAttribute('maxlength', question.inputs[c_key])"
                                  :minLength="getAttribute('minlength', question.inputs[c_key])"
                                  :max="getAttribute('max', question.inputs[c_key])"
                                  :min="getAttribute('min', question.inputs[c_key])"
                                  >
                              </b-form-input>
                              <!-- Date Type of Input -->
                              <b-input-group>
                                <b-form-input
                                  :class="{ 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
                                  size="lg" 
                                  v-if="input.type == 'date'"
                                  @blur="fixDate"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                  :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                  :max="getAttribute('max', question.inputs[c_key])"
                                  :min="getAttribute('min', question.inputs[c_key])"
                                  type="text"
                                  autocomplete="off"
                                ></b-form-input>
                                <b-input-group-append>
                                  <b-form-datepicker 
                                    v-model="values[input.control_id]"
                                    size="lg" 
                                    v-if="input.type == 'date'"
                                    :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                    :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                    :max="getAttribute('max', question.inputs[c_key])"
                                    :min="getAttribute('min', question.inputs[c_key])"
                                    button-only
                                    dropleft
                                  >
                                  </b-form-datepicker>
                                </b-input-group-append>
                              </b-input-group>
                              <!-- End of Text Type of Input -->
                              <!-- BBOX Type of Input -->
                              <div v-if="input.type == 'bbox'" class="w-100">
                                <template v-for="(direction, d_key) in ['north', 'east', 'south', 'west']">
                                  <span :key="`${b_key}_${d_key}`">
                                    <label class="eui-label-nopointer">{{direction.substring(0, 1).toUpperCase()}}:</label>
                                    <b-form-input 
                                        :class="{ 'bbox': true, 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[`${input.control_id}_${direction}`] || {}).$error }"
                                        type="text" 
                                        :id="`${input.control_id}_${direction}`" 
                                        :name="`${input.control_id}_${direction}`" 
                                        v-model="values[`${input.control_id}_${direction}`]"
                                        size="lg"
                                        :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                        :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                        >
                                    </b-form-input>
                                  </span>
                                </template>
                              </div>
                              <!-- End of Text Type of Input -->
                              <!-- Textarea Type of Input -->
                              <b-form-textarea 
                                  :class="{ 'form-textarea-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
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
                                  :class="{ 'form-radio-group-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                  class="w-100"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
                                  size="lg" 
                                  value="true"
                                  unchecked-value="false"
                                  v-if="input.type == 'radio'" 
                                  :options="input.options"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))">
                              </b-form-radio-group>
                              <!-- End of Radio Group Type of Input -->
                              <!-- Select Type of Input -->
                              <b-form-select
                                  :class="{ 'form-select-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
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
                                  :class="{ 'form-file-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :scope="Boolean(values[input.control_id])"
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]" 
                                  size="lg" 
                                  v-if="input.type == 'file'"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                  :placeholder="getAttribute('placeholder', question.inputs[c_key])"
                                  :multiple="Boolean(getAttribute('multiple', question.inputs[c_key]))">
                              </b-form-file>
                              <!-- End of File Type of Input -->
                              <!-- Selected Input File Name -->
                              <div class="mt-3" v-if="input.type == 'file' && values[input.control_id] != ''">Selected file: {{ values[input.control_id] ? values[input.control_id].name : '' }}</div>
                              <!-- End of Selected Input File Name -->
                              <p :id="`${input.control_id}_invalid`" class="eui-banner--danger hidden form-control validation"></p>
                            </template>
                          </b-row>
                            <span v-bind:key="`${a_key}_${b_key}_${c_key}`">
                              <template v-if="input.type == 'bbox'">
                                <template v-for="(direction, d_key) in ['north', 'east', 'south', 'west']">
                                  <li class="eui-banner--danger same-as-html5" v-bind:key="`${a_key}_${b_key}_${c_key}_${d_key}`" v-if="($v.values[`${input.control_id}_${direction}`] || {}).$error">
                                    {{ heading.heading }} - {{ question.long_name }} - {{ direction.substring(0, 1).toUpperCase() }}:
                                    <template v-if="input.required_if !== undefined && input.required_if.length > 0">
                                      <template v-for="(req_if, e_key) in input.required_if">
                                        <span v-bind:key="`${a_key}_${b_key}_${c_key}_${d_key}_${e_key}`" v-if="values[req_if.field] == req_if.value">
                                          <template v-if="req_if.message !== undefined">{{ req_if.message }}</template>
                                          <template v-else-if="input.validation_error_msg !== undefined">{{ input.validation_error_msg }}</template>
                                          <template v-else>is required</template>
                                        </span>
                                      </template>
                                    </template> 
                                    <template v-else-if="input.validation_error_msg !== undefined">{{ input.validation_error_msg }}</template>
                                    <template v-else-if="$v.values[`${input.control_id}_${direction}`].required !== undefined && !$v.values[`${input.control_id}_${direction}`].required">is required</template>
                                    <template v-else>{{  getBboxError(input, direction) }}</template>
                                  </li>
                                </template>
                              </template>
                              <template v-else>
                                <li class="eui-banner--danger same-as-html5" v-if="($v.values[input.control_id] || {}).$error">
                                  <template v-if="input.required_if !== undefined && input.required_if.length > 0">
                                    <template v-for="(req_if, d_key) in input.required_if">
                                      <span v-bind:key="`${a_key}_${b_key}_${c_key}_${d_key}`" v-if="values[req_if.field] == req_if.value">
                                        <template v-if="req_if.message !== undefined">{{ heading.heading }} - {{ question.long_name }} - {{ input.label }}: {{ req_if.message }}</template>
                                        <template v-else-if="input.validation_error_msg !== undefined">{{ heading.heading }} - {{ question.long_name }} - {{ input.label }}: {{ input.validation_error_msg }}</template>
                                        <template v-else>{{ heading.heading }} - {{ question.title }} - {{ input.label }} is required</template>
                                      </span>
                                    </template>
                                  </template>
                                  <template v-else-if="input.validation_error_msg !== undefined">{{ heading.heading }} - {{ question.long_name }} - {{ input.label }}: {{ input.validation_error_msg }}</template>
                                  <template v-else>
                                    {{ heading.heading }} - {{ question.long_name }} - {{ input.label }}
                                    <template v-if="$v.values[input.control_id].required !== undefined && !$v.values[input.control_id].required">is required</template>
                                    <template v-else-if="input.type == 'number'"> - Numbers must be positive digits.</template>
                                    <template v-else-if="input.type == 'date' && !isDateValid(input.control_id, 'validity') && $v.values[input.control_id]"> Date must be in one of the following formats: YYYY-MM-DD, MM/DD/YYYY, M-D-YYYY, MM/D/YYYY, Mon D YYYY, DD Month YYYY, Month D, YYYY</template>
                                    <template v-else-if="input.type == 'date' && !isDateValid(input.control_id, 'greater') && $v.values[input.control_id]"> Date must be less than or equal to End date</template>
                                    <template v-else-if="$v.values[input.control_id].patternMatch !== undefined && !$v.values[input.control_id].patternMatch">does not match pattern {{ input.attributes.pattern }}</template>
                                    <template v-else-if="$v.values[input.control_id].minLength !== undefined && !$v.values[input.control_id].minLength">requires a minimum length of {{ input.attributes.minlength }}</template>
                                    <template v-else-if="$v.values[input.control_id].maxLength !== undefined && !$v.values[input.control_id].maxLength">is over the maximum length of {{ input.attributes.maxlength }}</template>
                                    <template v-else-if="$v.values[input.control_id].min !== undefined && !$v.values[input.control_id].min">the value must be {{ input.attributes.min }} or greater.</template>
                                    <template v-else-if="$v.values[input.control_id].max !== undefined && !$v.values[input.control_id].max">the value must be less than {{ input.attributes.max }}</template>
                                  </template>
                                </li>
                              </template>
                            </span>
                            </span>
                          </template>
                        </b-col>
                      </b-row>
                      <!-- End of Input -->
                      </b-form-group>
                      <li class="eui-banner--danger same-as-html5" v-bind:key="`${a_key}_${b_key}`" v-if="($v.values[`question_${a_key}_${b_key}`] || {}).$error">{{ heading.heading }} - {{ question.long_name }} section is required</li>
                    </template>
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
import {
  required,
  requiredIf,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";
// Jquery javascript
import $ from "jquery";
import FixedHeader from "vue-fixed-header";

// This questions component gets the questions data for the selected daac and
// sets the above template properties, methods, and custom validation used.
export default {
  name: "Questions",
  data() {
    return {
      values: {},
      questions: [],
      contacts: [],
      bboxs: [],
      dirty: false,
      formTitle: "",
      saveTimeout: 0,
      daac: "",
      warning: "",
      isFixed: true,
      confirm: false,
      validation_errors: {},
      formId: "",
      requestId: ""
    };
  },
  props: {
    // The cancel label and type
    cancelLabel: { default: "Cancel", type: String },
    // The draft label and type
    draftLabel: { default: "Save as draft", type: String },
    // The save label and type
    saveLabel: { default: "Save and continue editing", type: String },
    // The undo label and type
    undoLabel: { default: "undo", type: String },
    // The redo label and type
    redoLabel: { default: "redo", type: String },
    // The submit label and type
    submitLabel: { default: "Submit", type: String },
    // The enter submit conditional to allow for submittal
    enterSubmit: { default: false, type: Boolean },
    // The readonly attribute to pass in
    readonly: { default: false, type: Boolean },
    // The disabled attribute to pass in
    disabled: { default: false, type: Boolean },
    // The show cancel button conditional to allow for cancel
    showCancelButton: { default: true, type: Boolean },
  },
  computed: {},
  watch: {
    values: {
      handler() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
          if(typeof this.values != 'undefined'){
            if (!this.values.fromUndo) {
              this.setContacts(this.values);
              this.$store.commit(
                "pushQuestionsState",
                Object.assign({}, this.values)
              );
              this.$log.debug(
                "pushQuestionsState",
                Object.assign({}, this.values)
              );
              var string_logging_object = this.$log.debug("pushQuestionsState");
              this.$logging_object[Date(Date.now()).toString()] = {
                log_string: string_logging_object,
                answers: Object.assign({}, this.values),
              };
            }
            delete this.values.fromUndo;
            if (this.$v.$anyError) {
              this.$v.$touch();
            }
          }
        }, 250);
      },
      deep: true,
    },
  },
  created() {},
  components: {
    FixedHeader,
  },
  validations() {
    let val_fields = {
      values: {},
    };
    var obj = [];
    if (
      typeof this.questions != "undefined" &&
      typeof this.questions.inputs != "undefined"
    ) {
      obj = this.questions.inputs;
    } else if (typeof this.questions != "undefined") {
      obj = this.questions;
    }
    // Gather required elements
    // returning true in a custom validation is that it passes the validation, false does not pass
    for (let [group_index, group] of obj.entries()) {
      if (
        typeof group.heading_required != "undefined" &&
        group.heading_required
      ) {
        val_fields.values[`section_${group_index}`] = {
          required: requiredIf(() => {
            for (let question of group) {
              if (!this.validateQuestionInputsRequired(question.inputs)) {
                return false;
              }
            }
            return true;
          }),
        };
      }
      for (let [question_index, question] of group.entries()) {
        if (typeof question.required != "undefined" && question.required) {
          val_fields.values[`question_${group_index}_${question_index}`] = {
            required: requiredIf(() => {
              return this.validateQuestionInputsRequired(question.inputs);
            }),
          };
        }
        if (typeof question.inputs != "undefined") {
          for (let fld of question.inputs) {
            if (fld.type == "bbox") {
              for (let direction of ["north", "east", "south", "west"]) {
                val_fields.values[`${fld.control_id}_${direction}`] = {
                  bbox: () => {
                    return this.getBboxError(fld, direction) == "";
                  },
                };
                if (typeof fld.required != "undefined" && fld.required) {
                  val_fields.values[
                    `${fld.control_id}_${direction}`
                  ].required = required;
                } else if (typeof fld.required_if != "undefined") {
                  val_fields.values[
                    `${fld.control_id}_${direction}`
                  ].required = requiredIf(() => {
                    for (let req_fld of fld.required_if) {
                      try {
                        if (
                          typeof this.values[req_fld.field] != "undefined" &&
                          this.values[req_fld.field].toString() ===
                            req_fld.value.toString()
                        ) {
                          return true;
                        }
                      } catch (e) {
                        // test
                      }
                    }
                    return false;
                  });
                }
              }
            } else {
              if (typeof fld.required != "undefined" && fld.required) {
                if (fld.type != "checkbox") {
                  val_fields.values[fld.control_id] = {
                    required,
                  };
                }
              } else if (typeof fld.required_if != "undefined") {
                val_fields.values[fld.control_id] = {
                  required: requiredIf(() => {
                    for (let req_fld of fld.required_if) {
                      try {
                        if (
                          typeof this.values[req_fld.field] != "undefined" &&
                          this.values[req_fld.field].toString() ===
                            req_fld.value.toString()
                        ) {
                          return true;
                        }
                      } catch (e) {
                        // test
                      }
                    }
                    return false;
                  }),
                };
              }
              if (
                typeof fld.attributes != "undefined" &&
                typeof fld.attributes.pattern != "undefined"
              ) {
                val_fields.values[fld.control_id] =
                  val_fields.values[fld.control_id] || {};
                val_fields.values[fld.control_id].patternMatch = () => {
                  if (typeof this.values[fld.control_id] != "undefined") {
                    return new RegExp(fld.attributes.pattern).test(
                      this.values[fld.control_id]
                    );
                  }
                  return false;
                };
              }
              if (fld.type == "date") {
                val_fields.values[fld.control_id] =
                  val_fields.values[fld.control_id] || {};
                val_fields.values[fld.control_id].startEndDates = () => {
                  if (typeof fld.control_id != "undefined") {
                    if (!this.isDateValid(fld.control_id, "greater")){
                      return false;
                    } 
                    if (!this.isDateValid(fld.control_id, "validity")){
                      return false;
                    }
                    return true
                  }
                  return true;
                };
              }
              if (fld.type == "number") {
                val_fields.values[fld.control_id] =
                  val_fields.values[fld.control_id] || {};
                val_fields.values[fld.control_id].noNegatives = () => {
                  if (parseInt(this.values[fld.control_id]) < 0){
                    return false;
                  }
                  return true;
                };
              }
              if (
                typeof fld.attributes != "undefined" &&
                typeof fld.attributes.minlength != "undefined"
              ) {
                val_fields.values[fld.control_id] =
                  val_fields.values[fld.control_id] || {};
                val_fields.values[fld.control_id].minLength = minLength(
                  fld.attributes.minlength
                );
              }

              if (
                typeof fld.attributes != "undefined" &&
                typeof fld.attributes.maxlength != "undefined"
              ) {
                val_fields.values[fld.control_id] =
                  val_fields.values[fld.control_id] || {};
                val_fields.values[fld.control_id].maxLength = maxLength(
                  fld.attributes.maxlength
                );
              }
            }
          }
        }
      }
    }
    let DAAC_SET;
    if(typeof this.$store !== 'undefined' && this.$store.state.global_params['group'] != ''){
      DAAC_SET = this.$store.state.global_params['group']
    } 
    if (DAAC_SET !== null) {
      this.$required = JSON.stringify(val_fields.values);
    }
    return val_fields;
  },
  methods: {
    // @vuese
    // Formats any date text to YYYY-MM-DD
    // @event - The event that executed
    fixDate(event) {
      if(this.values[event.target.id] !== ''){
        try{
          new Date(this.values[event.target.id]).toISOString();
          this.values[event.target.id] = new Date(this.values[event.target.id]).toISOString().split('T')[0];
        } catch {
          //
        }
      }
    },
    // @vuese
    // Checks if date text is valid
    // @id - The id used to lookup the value
    // @check_type - Optional string parameter, accepts "greater" or "validity" with "greater" being default
    isDateValid(id, check_type = "greater") {
      let start, end;
      if (id.match(/start/g)) {
        start = id;
        end = id.replace(/start/g, "end");
      } else if (id.match(/end/g)) {
        end = id;
        start = id.replace(/end/g, "start");
      }
      if (typeof this.values[start] != 'undefined' && typeof this.values[end] != 'undefined'){
        let start_bits = this.values[start].split("-");
        let end_bits = this.values[end].split("-");
        let start_date_obj = new Date(
          start_bits[0],
          start_bits[1] - 1,
          start_bits[2]
        );
        let end_date_obj = new Date(
          end_bits[0],
          end_bits[1] - 1,
          end_bits[2]
        );
        if (
          id.match(/start/g) &&
          typeof start_date_obj != "undefined"
        ){
          if (
            start_date_obj != "Invalid Date" &&
            check_type == 'greater'
          ) {
            if (start_date_obj > end_date_obj) {
              return false;
            }
          } else if (
            check_type == "validity" &&
            start_date_obj == "Invalid Date"
          ) {
            return false;
          }
        }
        if (
          id.match(/end/g) &&
          typeof end_date_obj != "undefined"
        ){
          if (
            check_type == "validity" &&
            end_date_obj == "Invalid Date"
          ) {
            return false;
          }
        }
      }
      return true
    },
    // @vuese
    // Validates required question inputs; returns true if valid
    // @inputs - array of inputs to look for bbox in
    validateQuestionInputsRequired(inputs) {
      for (let input of inputs) {
        if (input.type == "bbox") {
          let has_all_directions = true;
          for (let direction of ["north", "east", "south", "west"]) {
            if (
              typeof this.values[`${input.control_id}_${direction}`] ==
                "undefined" ||
              this.values[`${input.control_id}_${direction}`] == "" ||
              this.values[`${input.control_id}_${direction}`] == null
            ) {
              has_all_directions = false;
            }
          }
          if (has_all_directions) {
            return false;
          }
        } else {
          if (
            typeof this.values[input.control_id] != "undefined" &&
            this.values[input.control_id] != "" &&
            this.values[input.control_id] != null
          ) {
            if (
              input.type != "checkbox" ||
              this.values[input.control_id].toString() != "false"
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    // @vuese
    // Gets custom bbox validation errors; returns blank if valid
    // @fld - the bbox field
    // @direction - The direction of the fld
    getBboxError(fld, direction) {
      if (
        typeof this.values[`${fld.control_id}_${direction}`] != "undefined" &&
        this.values[`${fld.control_id}_${direction}`] != null
      ) {
        if (isNaN(this.values[`${fld.control_id}_${direction}`])) {
          return "Must be a number";
        }
        let this_val = parseFloat(
          this.values[`${fld.control_id}_${direction}`]
        );
        let comp_direction = {
          south: "north",
          west: "east",
        };
        let comp_val = parseFloat(
          this.values[`${fld.control_id}_${comp_direction[direction]}`]
        );
        let label = `${direction.substring(0, 1).toUpperCase()}`;
        if (/west|south/.test(direction) && this_val >= comp_val) {
          return `${label} must be less than ${comp_direction[direction]
            .substring(0, 1)
            .toUpperCase()}`;
        }
        if (direction == "west" && this_val >= 180.0) {
          return `${label} must be less than 180.0`;
        }
        if (direction == "east" && this_val <= -180.0) {
          return `${label} must be greater than -180.0`;
        }
        if (direction == "south" && this_val >= 90.0) {
          return `${label} must be less than 90.0`;
        }
        if (direction == "north" && this_val <= -90.0) {
          return `${label} must be greater than -90.0`;
        }
      }
      return "";
    },
    // @vuese
    // Shows and Hides based of json show_if
    // @config - validates for showif
    showIf(config) {
      if (typeof config == "undefined" || config.length == 0) {
        return true;
      }
      for (let fld of config) {
        if (
          typeof this.values[fld.field] != "undefined" &&
          this.values[fld.field] != "" &&
          this.values[fld.field] != null
        ) {
          if (this.values[fld.field].toString() == fld.value.toString()) {
            return true;
          }
        }
      }
      return false;
    },
    // @vuese
    // Copies over contact information from the 'same as' checkbox for contact
    // @id_to - The id of the element to set to
    // @contact - The value of the element to set to
    setContact: function (id_to, contact) {
      let inputs = $("#questions_container input");
      for (let i in inputs) {
        if (
          typeof inputs[i].id != "undefined" &&
          inputs[i].id.toLowerCase().match(/name/g)
        ) {
          if (
            typeof $(`#same_as_${inputs[i].id}_label`) != "undefined" &&
            this.values[inputs[i].id] === contact
          ) {
            let unchecked = $(`#same_as_${id_to}`).is(":checked");
            let get_id_from = inputs[i].id;
            let from_name = get_id_from.toLowerCase();
            let to_name = id_to.toLowerCase();
            let from_org_id = get_id_from
              .toLowerCase()
              .replace(/name/g, "organization");
            let to_org_id = id_to
              .toLowerCase()
              .replace(/name/g, "organization");
            let from_email_id = get_id_from
              .toLowerCase()
              .replace(/name/g, "email");
            let to_email_id = id_to.toLowerCase().replace(/name/g, "email");
            let from_orcid_id = get_id_from
              .toLowerCase()
              .replace(/name/g, "orcid");
            let to_orcid_id = id_to.toLowerCase().replace(/name/g, "orcid");
            if (unchecked) {
              if (typeof $(`#${to_name}`) != "undefined") {
                this.values[to_name] = "";
              }
              if (typeof $(`#${to_org_id}`) != "undefined") {
                this.values[to_org_id] = "";
              }
              if (typeof $(`#${to_email_id}`) != "undefined") {
                this.values[to_email_id] = "";
              }
              if (typeof $(`#${to_orcid_id}`) != "undefined") {
                this.values[to_orcid_id] = "";
              }
            } else {
              if (
                typeof $(`#${from_name}`) != "undefined" &&
                typeof $(`#${to_name}`) != "undefined"
              ) {
                this.values[to_name] = this.values[from_name];
              }
              if (
                typeof $(`#${from_org_id}`) != "undefined" &&
                typeof $(`#${to_org_id}`) != "undefined"
              ) {
                this.values[to_org_id] = this.values[from_org_id];
              }
              if (
                typeof $(`#${from_email_id}`) != "undefined" &&
                typeof $(`#${to_email_id}`) != "undefined"
              ) {
                this.values[to_email_id] = this.values[from_email_id];
              }
              if (
                typeof $(`#${from_orcid_id}`) != "undefined" &&
                typeof $(`#${to_orcid_id}`) != "undefined"
              ) {
                this.values[to_orcid_id] = this.values[from_orcid_id];
              }
            }
            if (
              typeof $(`#${to_name}`) != "undefined" &&
              $(`#${to_name}`).val() == ""
            ) {
              $(`#${to_name}`).focus();
            } else if (
              typeof $(`#${to_org_id}`) != "undefined" &&
              $(`#${to_org_id}`).val() == ""
            ) {
              $(`#${to_org_id}`).focus();
            } else if (
              typeof $(`#${to_email_id}`) != "undefined" &&
              $(`#${to_email_id}`).val() == ""
            ) {
              `#${to_email_id}`.focus();
            } else if (
              typeof $(`#${to_orcid_id}`) != "undefined" &&
              $(`#${to_orcid_id}`).val() == ""
            ) {
              $(`#${to_orcid_id}`).focus();
            }
            this.setContacts(this.values);
            this.$store.commit(
              "pushQuestionsState",
              Object.assign({}, this.values)
            );
          }
        }
      }
    },
    // @vuese
    // Gets contacts and builds options for checkbox
    // @values - The forms values to look for contacts in
    setContacts: function (values) {
      this.contacts = [];
      let questions = this.questions[0];
      for (var ea in values) {
        if (!ea.toLowerCase().match(/name/g)) {
          continue;
        }
        if(typeof questions != 'undefined'){
          for (let section of questions) {
            let inputs = section["inputs"];
            let text = section["text"];
            let long_name = section["long_name"];
            let help = section["help"];
            for (let i in inputs) {
              let inp = inputs[i];
              let label = inp["label"];
              if (ea === inp["control_id"]) {
                if (
                  ((typeof text != "undefined" &&
                    text.toLowerCase().match(/person/g)) ||
                    (typeof text != "undefined" &&
                      text.toLowerCase().match(/contact/g)) ||
                    (typeof long_name != "undefined" &&
                      long_name.toLowerCase().match(/person/g)) ||
                    (typeof long_name != "undefined" &&
                      long_name.toLowerCase().match(/contact/g)) ||
                    (typeof help != "undefined" &&
                      help.toLowerCase().match(/person/g)) ||
                    (typeof help != "undefined" &&
                      help.toLowerCase().match(/contact/g))) &&
                  label.toLowerCase().match(/name/g) &&
                  this.contacts.includes(this.values[inputs[i]["control_id"]]) ==
                    false &&
                  this.values[inputs[i]["control_id"]] != ""
                ) {
                  this.contacts.push(this.values[inputs[i]["control_id"]]);
                }
              }
            }
          }
        }
      }
    },
    // @vuese
    // Gets characters remaining from textarea
    // @value - The current value 
    // @maxlength - The maxlength to compare against the value
    charactersRemaining: function (value, maxlength) {
      let left = maxlength;
      let chars = 0;
      if (typeof value == "string" && value != "") {
        chars = value.length;
      }
      if (typeof maxlength != "undefined" && parseInt(maxlength) > 0) {
        left = parseInt(maxlength - chars);
      }
      return left;
    },
    // @vuese
    // Gets input attributes and filters out those that are undefined
    // @attr - The input attribute value
    // @input - The input the attribute belongs to
    getAttribute(attr, input) {
      let attribute_value = undefined;
      if (
        typeof input.attributes != "undefined" &&
        typeof input.attributes[attr] != "undefined"
      ) {
        attribute_value = input.attributes[attr];
      }
      return attribute_value;
    },
    // @vuese
    // Handle html5 invalidity on form
    // @evt - The event
    handleInvalid(evt) {
      $("#" + evt.target.name + "_invalid").text(evt.target.validationMessage);
      if (evt.target.validationMessage != "") {
        this.validation_errors = {
          ...this.validation_errors,
          [evt.target.name]: evt.target.validationMessage,
        };
        $("#" + evt.target.name + "_invalid").removeClass("hidden");
      } else {
        if (evt.target.name in this.validation_errors) {
          delete this.validation_errors[evt.target.name];
        }
        $("#" + evt.target.name + "_invalid").addClass("hidden");
      }
      if (this.$v.$anyError) {
        this.$v.$touch();
      }
    },
    // @vuese
    // Hides errors banner on clicking x
    // @id - The id of the element to hide
    dismiss(id) {
      document.getElementById(id).style.display = "none";
    },
    // @vuese
    // Fetchs the questions data
    fetchQuestions() {
      $.ajaxSetup({
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      let url;
      let form = this.getForm();
      let json_name = ''
      if(form.match(/interest/g)){
        json_name = 'data_publication_request' 
      } else {
        json_name = 'data_product_information' 
      }
      if (this.$testing){
        url = `../../${json_name}.json`
      } else {
        url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORMS_URL}?order=desc`
      }
      $.getJSON(url, (forms) => {
          var question = [];
          this.contacts = [];
          let contact = false;
          let form = this.getForm();
          if (
            typeof this.$store !== 'undefined' && 
            this.$store.state.global_params['formId'] == "" &&
            (this.$store.state.global_params['group'] !== "selection" || this.$store.state.global_params['group'] != "")
          ) {
            for (let f in forms) {
              if (
                form.toLowerCase().match(/interest/g) &&
                typeof forms[f].short_name != "undefined" &&
                forms[f].short_name
                  .toLowerCase()
                  .match(/data_publication_request/g)
              ) {
                this.$store.state.global_params['formId'] = forms[f]["id"];
                this.formTitle = forms[f]["long_name"];
                break;
              } else if (
                form.toLowerCase().match(/questionnaire/g) &&
                typeof forms[f].short_name != "undefined" &&
                forms[f].short_name
                  .toLowerCase()
                  .match(/data_product_information/g)
              ) {
                this.$store.state.global_params['formId'] = forms[f]["id"];
                this.formTitle = forms[f]["long_name"];
                break;
              }
            }
          }
          if(!this.$testing && typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "") {
            url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORM_URL}/${this.$store.state.global_params['formId']}`;
          }
          $.getJSON(url, (questions) => {
            if (this.formTitle == "" && questions["long_name"] != "") {
              this.formTitle = questions["long_name"];
            }
            //The below line looks for custom css and applies it to the head (eui is done first)
            $('head link[data-eui="yes"]').remove();
            if (questions.style) {
              $('head link[data-custom="yes"]').remove();
            }
            var head = window.document.head;
            var link = window.document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            $(link).attr("data-eui", "yes");
            link.href =
              "https://cdn.earthdata.nasa.gov/eui/1.1.7/stylesheets/application.css";
            head.appendChild(link);
            if (questions.style) {
              head = window.document.head;
              link = window.document.createElement("link");
              link.type = "text/css";
              link.rel = "stylesheet";
              $(link).attr("data-custom", "yes");
              link.href = questions.style;
              head.appendChild(link);
            }
            for (var section in questions["sections"]) {
              var heading = questions["sections"][section]["heading"];
              var heading_required =
                questions["sections"][section]["required"] || false;
              var heading_show_if =
                questions["sections"][section]["show_if"] || [];
              var questions_section =
                questions["sections"][section]["questions"];
              questions_section["heading"] = heading;
              questions_section["heading_required"] = heading_required;
              questions_section["heading_show_if"] = heading_show_if;
              for (var q in questions_section) {
                if (typeof questions_section[q].long_name != "undefined") {
                  let text = questions_section[q].text;
                  let long_name = questions_section[q].long_name;
                  let help = questions_section[q].help;
                  if (
                    (typeof text != "undefined" &&
                      text.toLowerCase().match(/person/g)) ||
                    (typeof text != "undefined" &&
                      text.toLowerCase().match(/contact/g)) ||
                    (typeof long_name != "undefined" &&
                      long_name.toLowerCase().match(/person/g)) ||
                    (typeof long_name != "undefined" &&
                      long_name.toLowerCase().match(/contact/g)) ||
                    (typeof help != "undefined" &&
                      help.toLowerCase().match(/person/g)) ||
                    (typeof help != "undefined" &&
                      help.toLowerCase().match(/contact/g))
                  ) {
                    contact = true;
                  }
                }
                if (typeof questions_section[q].inputs != "undefined") {
                  for (var input in questions_section[q].inputs) {
                    var options = [];
                    if (
                      contact &&
                      questions_section[q].inputs[input].label.toLowerCase() ==
                        "name"
                    ) {
                      questions_section[q].inputs[input].contact = true;
                      contact = false;
                    }
                    if (
                      typeof questions_section[q].inputs[input].enums !=
                      "undefined"
                    ) {
                      for (var e in questions_section[q].inputs[input].enums) {
                        var option =
                          questions_section[q].inputs[input].enums[e];
                        if (
                          Array.isArray(
                            questions_section[q].inputs[input].enums
                          )
                        ) {
                          options.push({ value: option, text: option });
                        } else if (
                          typeof questions_section[q].inputs[input].enums
                            .value != "undefined" &&
                          typeof questions_section[q].inputs[input].enums
                            .text != "undefined"
                        ) {
                          var text =
                            questions_section[q].inputs[input].enums.text;
                          var value =
                            questions_section[q].inputs[input].enums.value;
                          options.push({ value: value, text: text });
                        }
                      }
                    }
                    if (options.length > 0) {
                      questions_section[q].inputs[input]["options"] = options;
                    }
                  }
                }
              }
              question.push(questions_section);
            }
            this.questions = question;
          });
        }
      );
    },
    // @vuese
    // Prevents submit to apply validation; 
    // @evt - the event
    enterSubmitForm() {
      if (this.enterSubmit) {
        this.submitForm();
      }
    },
    // @vuese
    // If there's no errors, submits, then exit form
    submitForm() {
      this.saveFile("submit");
    },
    // @vuese
    // If there's no errors, saves, then exit form
    draftFile() {
      this.saveFile("draft");
    },
    // @vuese
    // Sends data to the API
    // @bvModal - the alert object to modify if an alert is necessary
    // @DAAC - hash string of the group to set in the json
    // @operation - string action (save, draft, submit)
    sendDataToApi(bvModal, DAAC, operation = "save") {
      let action;
      let form = this.getForm();
      let was_draft = false
      let json = {
        data: JSON.parse(this.$store.state.global_params[`${form}_outputs`])[
          "data"
        ],
        log: JSON.parse(this.$store.state.global_params[`${form}_outputs`])["log"],
      };
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "") {
        json["form_id"] = this.$store.state.global_params['formId'];
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['requestId'] != "") {
        json["id"] = this.$store.state.global_params['requestId'];
      }
      if (typeof DAAC !== "undefined" && DAAC != "" && DAAC != null) {
        json["daac_id"] = DAAC;
      }
      if (operation == "save" || operation == "draft") {
        if (operation == "draft") {
          was_draft = true
          operation = "save";
        }
        action = "saved";
      } else {
        action = "submitted";
      }
      if(!this.$testing){
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          url: `${process.env.VUE_APP_API_ROOT}/submission/${operation}`,
          data: JSON.stringify(json),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: (response) => {
            this.requestId = response.id;
            this.$store.commit("pushGlobalParams",['requestId',`${this.requestId}`]);
            let message = `Your data have been ${action}.`
            if (operation == "submit") {
              this.$values = {};
              this.confirm = false;
              if (!this.$v.$anyError && (typeof process.env.VUE_APP_REDIRECT_CONFIRMATION == 'undefined' || JSON.parse(process.env.VUE_APP_REDIRECT_CONFIRMATION))) {
                this.redirectNotification(bvModal, message, operation)
              } else {
                this.exitForm(bvModal, message)
              }
            } else if (was_draft){
              if (typeof process.env.VUE_APP_REDIRECT_CONFIRMATION == 'undefined' || JSON.parse(process.env.VUE_APP_REDIRECT_CONFIRMATION)) {
                this.redirectNotification(bvModal, message, 'draft')
              } else {
                this.exitForm(bvModal, message)
              }
            } else {
                bvModal.msgBoxOk(message, {
                title: "Success!",
                size: "sm",
                buttonSize: "sm",
                okTitle: "OK",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
              })
            }
          },
          error: (XMLHttpRequest, textStatus, errorThrown) => {
            bvModal.msgBoxOk(
              `Your data could not be ${action}. Error returned: ${errorThrown}.  Please try again.`,
              {
                title: "Error!",
                size: "sm",
                buttonSize: "sm",
                okTitle: "OK",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
              }
            );
          },
        });
      } else {
        bvModal.msgBoxOk('Data did not save.  Testing is set to true.', {
          title: "Success!",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
      }
    },
    // @vuese
    // Loads answers using request id
    loadAnswers() {
      if (JSON.stringify(this.values) == '{}' && typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "" && this.$store.state.global_params['requestId'] != '' && typeof this.$store.state.global_params['requestId'] !== 'undefined') {
        $.getJSON(
        `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_REQUEST_URL}/${this.requestId}`,
        (answers) => {
          if(answers.error){
            return {}
          }
          this.values = answers.form_data;
        })
      }
      return this.values
    },
    // @vuese
    // Used to save file
    // @operation - string action (save, draft, submit)
    saveFile(operation = "save") {
      let DAAC;
      if (this.daac == null && 
        typeof this.$store !== 'undefined' && 
        this.$store.state.global_params['group'] != "") {
        DAAC = this.$store.state.global_params['group']
      } else {
        DAAC = this.daac;
      }
      if(operation != 'draft'){
        this.$v.$touch();
      }
      const data = this.values;
      let form = this.getForm();
      if (data !== JSON.stringify({})) {
        this.$values = data;
        this.$output_object["data"] = this.$values;
        this.$output_object["log"] = this.$logging_object;
        this.$input_object["questions"] = this.questions[0];
        this.$input_object["required"] = this.$required;
        this.$store.commit("pushGlobalParams", [`${form}_inputs`,`${JSON.stringify(this.$input_object)}`]);
        this.$store.commit("pushGlobalParams", [`${form}_outputs`,`${JSON.stringify(this.$output_object)}`]);
        // @vuese
        // Example log messages, this.$log.debug|info|warn|error|fatal('test', property|function, 'some error') -> see https://github.com/justinkames/vuejs-logger
        // If production level set (see main.js), will be at different level automatically.
        // Additonal options (can be set in main.js), stringifyArguments|showLogLevel|showMethodName|separator|showConsoleColors
        if (
          (!this.$v.$anyError && operation == "submit") ||
          operation != "submit"
        ) {
          this.sendDataToApi(this.$bvModal, DAAC, operation);
        } else {
          this.errorsNotification(this.$bvModal);
        }
      }
    },
    // @vuese
    // Alerts the user to errors and goes to top of page for messages to help.
    // @bvModal - the alert object to modify if an alert is necessary
    errorsNotification(bvModal) {
      bvModal.msgBoxOk(
        "You have errors to correct before you can submit data.  You can save data.",
        {
          title: "Errors",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        }
      );
      if ($(".vue-go-top__content").is(":visible")) {
        $(".vue-go-top__content").click();
      }
    },
    // @vuese
    // Asks the user if they want to be redirected to the dashboard requests page.
    // @bvModal - the alert object to modify if an alert is necessary
    // @message - any other function messages to include
    // @operation - string action (save, draft, submit)
    async redirectNotification(bvModal, message, operation) {
      if(operation == "submit"){
        const value = await bvModal.msgBoxOk(
        `${message} You will be redirected to Earthdata Pub Dashboard Requests Page.`, 
        {
          title: "Success!",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        if (value) {
          this.exitForm();
        }
    } else {
        const value = await bvModal.msgBoxConfirm(
        `${message} Do you want to be redirected to Earthdata Pub Dashboard Requests Page?`,
        {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        if (value) {
          this.exitForm();
        }
      }
    },
    // @vuese
    // Cancels current edits and exits the form
    okToCancel() {
      $("#eui-banner").addClass("hidden");
      if (Object.keys(this.values).length > 0) {
        this.$refs.form.reset();
        this.$values = {};
        this.$v.$touch();
      }
      $("#reset_data").focus();
      this.confirm = false;
      this.exitForm();
    },
    // @vuese
    // Resets form and local storage to empty entries
    // @evt - the event to prevent before checks
    cancelForm() {
      if (!this.confirm) {
        event.preventDefault();
      }
      // Resets form to blank entries
      if (this.confirm == false) {
        this.confirm = "";
        this.$bvModal
          .msgBoxConfirm(
            `This will cancel any input and redirect you to Earthdata Dashboard Requests.  Are you sure?`,
            {
              title: "Please Confirm",
              size: "lg",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "YES",
              cancelTitle: "NO",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            }
          )
          .then((value) => {
            this.confirm = value;
            if (value) {
              this.okToCancel();
            } else {
              return;
            }
          });
      } else {
        this.confirm = false;
        this.okToCancel();
      }
    },
    // @vuese
    // Removes the store from storage and exits the form to requests page
    // @bvModal - the alert object to modify if an alert is necessary
    // @message - any other function messages to include
    exitForm(bvModal, message) {
      let url = `${process.env.VUE_APP_DASHBOARD_ROOT}/requests`;
      if(typeof bvModal != 'undefined' && typeof message != 'undefined'){
        bvModal.msgBoxOk(message, {
          title: "Success!",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(() => {
          $("#eui-banner").addClass("hidden");
          window.location.href = url;
        })
      } else {
        $("#eui-banner").addClass("hidden");
        window.location.href = url;
      }
    },
    // @vuese
    // Re-applies the data entry values from values from the store for on undo and redo
    reApplyValues() {
      let vals = this.$store.state.question_answers[
        this.$store.state.question_answers.length - 1
      ];
      if (!vals) {
        vals = {};
      }
      vals.fromUndo = true;
      this.values = vals;
      if (this.$v.$anyError) {
        this.$v.$touch();
      }
    },
    // @vuese
    // Undos the form to its previous state.
    undoToPreviousState() {
      if(Object.keys(this.values).length===0){
        this.$bvModal
          .msgBoxConfirm(
            `This will undo your Daac selection.  Are you sure you want to do this?`,
            {
              title: "Please Confirm",
              size: "lg",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "YES",
              cancelTitle: "NO",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            }
          )
          .then((value) => {
            if (value){
              window.headerComponent.goToComponent('daacs')
            }
          });
      } else {
        this.undo();
        this.reApplyValues();
      }
    },
    // @vuese
    // Redo the form state
    redoToPreviousState() {
      this.redo();
      this.reApplyValues();
    },
  },
  // This is equivalent to js document.ready
  mounted() {
    window.questionsComponent = this;
    this.setActiveNav("questions");
    let form = this.getForm();
    this.setShowDaacs();
    if(typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] !== ''){
      this.formId = this.$store.state.global_params['formId']
    }
    if(typeof this.$store !== 'undefined' && this.$store.state.global_params['requestId'] !== ''){
      this.requestId = this.$store.state.global_params['requestId']
    }
    if (form.toLowerCase().match(/questionnaire/g)) {
      this.daac = null;
    } else if(typeof this.$store !=='undefined' && this.$store.state.global_params['group'] !== ''){
      this.daac = this.$store.state.global_params['group']
    }
    let set_loc = location.href;
    let re = `/${form}/questions/`;
    if (!set_loc.match(re, "g")) {
      set_loc += `/${form}/questions/`;
    }
    if (set_loc.match(/selection/g) && (this.daac === '' || this.daac == null)) {
      this.warning = "No daac has been selected";
    }
    if (typeof window.headerComponent != "undefined") {
      window.headerComponent.daac = this.daac
    }
    this.setActiveLocationWithoutReload(this.daac);
    this.fetchQuestions();
    if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['formId'] !== 'undefined'){
      this.loadAnswers()
    }
  },
};
</script>
<style scoped>
#contact_span{
  margin-left:2rem; 
}
.eui-label-nopointer {
  cursor: auto;
}
.bbox {
  min-width: 100px;
  max-width: 100px;
}
.bbox.form-control {
  display: inline-flex;
  margin-left: 10px;
}
.eui-checkbox {
  display: inherit;
}
span.checkbox label {
  margin-left: 0px;
  font-weight:bold;
}
span span label {
  margin-left: 2rem;
  font-weight: normal;
}
span span:nth-child(-n+1) label {
  margin-left:0rem;
}
.question_size {
  padding-left: 0px;
  padding-right: 0px;
}
.question_section {
  margin-bottom: 2rem;
}
h2 {
  text-decoration: underline;
  border-bottom: unset;
}
#reset_data {
  background-color: #db1400;
}
.eui-banner--danger {
  text-align: left;
}
.hidden {
  display: none;
}
.float_right {
  float: right;
}
.warning {
  color: red;
  font-weight: bold;
  text-decoration: None;
}
.col-form-label {
  font-weight: bold;
}
.radio_div {
  width: 25%;
  float: left;
}
.desc_div {
  width: 75%;
  float: right;
}
.required {
  color: red !important;
  padding-top: 7px;
}
.date_formats {
  padding-top: 7px;
  padding-left:20px;
  color: light-grey;
  float:right
}
.date_formats_required {
  padding-top: 7px;
  padding-left:10px;
}
label {
  margin-right: 1rem;
  cursor: pointer;
}
p {
  margin-bottom: unset;
}
button {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.left_button_bar button:first-child {
  margin-left: 0 !important;
}
.right_button_bar button:last-child {
  margin-right: 0 !important;
}
.help {
  text-align: right;
  padding-right: 0px;
  padding-top: 7px;
  position: absolute;
  right: 7px;
  top: 0px;
}
.form-group {
  position: relative;
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
.form-group {
  margin-bottom:unset;
}
input {
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 5px;
  border-color:#b2b2b2
}
.radio_checkbox_group_error {
  border-color: red;
  border-radius: 5px;
}
fieldset {
  border-left: unset;
}
.button_bar {
  display: inline;
}
.left_button_bar {
  display: inline;
  float: left;
  margin-top: 0px;
  height: 55px;
}
.right_button_bar {
  display: inline;
  float: right;
  margin-top: 0px;
  height: 55px;
}
div.container {
  padding-top: 0px;
}
.navbar {
  position: relative;
  display: -ms-flexbox;
  /* display: -webkit-box; */
  /* display: flex; */
  display: flow-root !important;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  -webkit-box-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 0rem 0rem;
  padding-top: 1rem;
}
.console_container {
  height: 1em;
}
.console_bar {
  float: right;
}

@media (min-width: 1200px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    left: 20;
    top: 1rem;
    min-width: 1110px;
    max-width: 1110px;
  }
}
@media (max-width: 1200px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    left: 20;
    top: 1rem;
    min-width: 929px;
    max-width: 929px;
  }
}
@media (max-width: 992px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    left: 20;
    top: 1rem;
    min-width: 929px;
    max-width: 929px;
  }
}
@media (max-width: 768px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    left: 20;
    top: 1rem;
    min-width: 690px;
    max-width: 690px;
  }
}
@media (max-width: 576px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 509px;
    min-width: 509px;
  }
}
@media (max-width: 441px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 380px;
    min-width: 380px;
  }
}
@media (max-width: 414px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 385px;
    min-width: 385px;
  }
}
@media (max-width: 411px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 380px;
    min-width: 380px;
  }
}
@media (max-width: 375px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 345px;
    min-width: 345px;
  }
}
@media (max-width: 360px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 330px;
    min-width: 330px;
  }
}
@media (max-width: 320px) {
  .navbar.vue-fixed-header--isFixed {
    position: fixed;
    top: 1rem;
    max-width: 290px;
    min-width: 290px;
  }
}
/*@media screen and (max-width: 900px) and (min-width: 600px) {*/
</style>
