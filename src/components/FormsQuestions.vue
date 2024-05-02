<template>
<div role="main">
  <!-- Form -->
  <b-form ref="form" name="questions_form" id="questions_form" v-on:submit.stop.prevent @submit="enterSubmitForm" @invalid.capture.prevent="handleInvalid" @change="handleInvalid">
    <fixed-header :threshold="168" style="z-index:5;">
      <div class="navbar">
          <!-- Button Options -->
          <div class="button_bar">
              <div align=left v-if="!readonly" class="left_button_bar">
                  <b-button class="button" type="redo" id="redo_button" name="redo_button" v-if="valueHistoryUndoIdx > 0" @click="redoToPreviousState()" aria-label="redo button">
                    <font-awesome-icon v-bind:icon="redoLabel"/>
                    {{ redoLabel }}
                  </b-button>
                  <b-button class="button" type="redo" id="redo_button" name="redo_button" v-else disabled aria-label="redo button">
                    <font-awesome-icon v-bind:icon="redoLabel"/>
                    {{ redoLabel }}
                  </b-button>
                  <b-button class="button" type="undo" id="undo_button" name="undo_button" v-if="valueHistory.length - valueHistoryUndoIdx > 1" @click="undoToPreviousState()" aria-label="undo button">
                    <font-awesome-icon v-bind:icon="undoLabel"/>
                    {{ undoLabel }}
                  </b-button>
                  <b-button class="button" type="undo" id="undo_button" name="undo_button" v-else disabled aria-label="undo button">
                    <font-awesome-icon v-bind:icon="undoLabel"/>
                    {{ undoLabel }}
                  </b-button>
              </div>
              <div align=right v-if="!readonly" class="right_button_bar">
                  <!-- save button -->
                  <b-button v-if="Object.keys(this.values).length > 0" class="eui-btn--blue" type="save" id="save_data" @click="saveFile()" aria-label="save button">{{ saveLabel }}</b-button>
                  <b-button v-else disabled class="eui-btn--blue" type="save" id="save_data" @click="saveFile()" aria-label="save button">{{ saveLabel }}</b-button>
                  <!-- draft button -->
                  <b-button v-if="Object.keys(this.values).length > 0" class="eui-btn--blue" type="draft" id="draft_data" @click="draftFile()" aria-label="draft button">{{ draftLabel }}</b-button>
                  <b-button v-else disabled class="eui-btn--blue" type="draft" id="draft_data" @click="draftFile()" aria-label="draft button">{{ draftLabel }}</b-button>
                  <!-- submit button -->
                  <b-button v-if="Object.keys(this.values).length == 0" class="eui-btn--green" type="submit" disabled id="submit_data" name="submit_data" @click="submitForm()" aria-label="submit button">{{ submitLabel }}</b-button>
                  <b-button v-else class="eui-btn--green" type="submit" id="submit_data" name="submit_data" @click="submitForm()" aria-label="submit button">{{ submitLabel }}</b-button>
                  <!-- cancel button -->
                  <b-button v-if="showCancelButton" class="eui-btn--red" type="reset" id="reset_data" name="reset_data" aria-label="cancel button" @click="cancelForm()">{{ cancelLabel }}</b-button>
                  <b-button v-else class="eui-btn--red" type="reset" id="reset_data" name="reset_data" aria-label="cancel button" @click="cancelForm()" disabled>{{ cancelLabel }}</b-button>
              </div>
          </div>
          <b-alert :show="dismissCountDown" :variant="alertVariant" dismissible fade @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
            {{alertMessage}}
          </b-alert>
      </div>
    </fixed-header>
    <b-container name="questions_container" id="questions_container">
        <!-- Section -->
        <h3 v-if="daac_name!=''" id="daac_selection">DAAC Selected: <span id="daac_name" v-if="daac_name!=''" class="question_section w-100">
          <a class="eui-link" @click="goToDaacs()" id="daac_name_link" alt="go the EDPub Group Selection" title="go the EDPub Group Selection">{{daac_name}}</a></span>
        </h3>
        <section>
            <b-row v-for="(heading, a_key) in questions" :key="a_key">
              <li class="eui-banner--danger same-as-html5" v-bind:key="a_key" v-if="($v.values[`section_${a_key}`] || {}).$error">Section {{ heading.heading }} is required</li>
              <div :class="{ 'form-section': true, 'form-section-error': ($v.values[`section_${a_key}`] || {}).$error }" class="w-100" v-if="showIf(heading.heading_show_if)">
                <input type="hidden" :id="`section_${a_key}`" v-if="heading.heading_required" />
                <h2 class="heading">{{heading.heading}}</h2>
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
                      <legend class="hidden">Fill out the form input fields.</legend>
                      <input type="hidden" :id="`question_${a_key}_${b_key}`" v-if="question.required" aria-label="Question Required Message"/>
                      <h3 :for="question.short_name" class="eui-label-nopointer">{{question.long_name}}:
                        <span class="small" :id="question.short_name || a_key">{{question.text}}</span>
                        <span class="col text-right section_required" v-if="question.required == true">required</span>
                      </h3>
                      <p class="text-muted" v-if="question.help != 'undefined'" v-html="question.help"></p>
                      <!-- Input -->
                      <b-row>
                        <b-col :lg="question.size || 12" class="question_size">
                          <template v-for="(input, c_key) in question.inputs">
                            <span  :key="c_key">
                              <span v-if="input.type == 'checkbox'" class="checkbox">
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
                                  :aria-label="input.label"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))">
                                  <div class="eui-label checkbox-label">{{input.label}}</div>
                                </b-form-checkbox>
                                <!-- End of Checkbox Type of Input -->
                                <span class='required' v-if='input.required || checkRequiredIf(input)'>required</span>
                              </span>
                          <b-row v-else>
                            <template v-if="showIf(input.show_if)">
                              <label :for="input.control_id || `${input}_${c_key}`" class="eui-label" v-if="input.label !== undefined && input.label !== '' && input.type != 'checkbox' && input.type != 'bbox' && input.type != 'table'">{{input.label}}:</label>
                              <span class="date_formats" v-if="input.type == 'datetimePicker'">Format: <span class="date_formats_required">YYYY-MM-DD hh:mm AM/PM</span></span>
                              <label v-if="(input.type == 'textarea' || input.type == 'text') && parseInt(charactersRemaining(values[input.control_id], getAttribute('maxlength', question.inputs[c_key]))) > 0">
                                 {{charactersRemaining(values[input.control_id], getAttribute('maxlength', question.inputs[c_key]))}} characters left
                              </label>
                              <span v-for="(contact, contact_key) in contacts" :key="contact_key">
                                <span id="contact_span" v-if="input.contact == true && contact != '' && question.long_name != contact && values[contact_fields[contact_key]] && !sameAsSelected(input.control_id, contact_fields[contact_key]) && !sameAsSelected(contact_fields[contact_key])">
                                  <b-form-checkbox 
                                    class="eui-checkbox"
                                    v-if="input.contact == true"
                                    v-model="values[getSameAsId(input.control_id, contact_fields[contact_key])]"
                                    :id="`same_as_${input.control_id}_${contact_key}`"
                                    value="true"
                                    unchecked-value="false"
                                    aria-label="Set Contact"
                                    @keyup.space.native="setContact(input.control_id, contact_fields[contact_key], contact_key)">
                                  </b-form-checkbox>
                                  <label 
                                    :id="`same_as_${input.control_id}_${contact_key}_label`"
                                    :for="`same_as_${input.control_id}_${contact_key}`" 
                                    v-if="input.contact == true" 
                                    @click="setContact(input.control_id, contact_fields[contact_key], contact_key)"
                                    class="eui-label"> 
                                    Same as {{contact}} 
                                  </label>
                                </span>
                              </span>
                              <!-- Text Type of Input -->
                              <b-form-input 
                                  :class="{ 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error, 'extra_space': !input.label }"
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
                                  :aria-label="input.control_id"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key])) || anySameAsSelected(input.control_id)"
                                  :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key])) || anySameAsSelected(input.control_id)"
                                  :pattern="getAttribute('pattern', question.inputs[c_key])"
                                  :maxLength="getAttribute('maxlength', question.inputs[c_key])"
                                  :minLength="getAttribute('minlength', question.inputs[c_key])"
                                  :max="getAttribute('max', question.inputs[c_key])"
                                  :min="getAttribute('min', question.inputs[c_key])"
                                  :placeholder="input.required || checkRequiredIf(input) ? 'required' : ''"
                                  >
                              </b-form-input>
                              <!-- Date Type of Input -->
                                <date-picker    
                                  v-if="input.type == 'datetimePicker'"
                                  :type="input.type"
                                  :input-class="{ 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error, 'form-control form-control-lg extra_space': 'true' }"
                                  :id="input.control_id" 
                                  :name="input.control_id"
                                  v-model="values[input.control_id]"                                     
                                  format="YYYY-MM-DD hh:mm A"
                                  type="datetime" 
                                  valueType="format"
                                  placeholder="required"
                                  >
                                </date-picker> 
                              <!-- End of Text Type of Input -->
                              <!-- BBOX Type of Input -->
                              <div v-if="input.type == 'bbox'" class="w-100">
                                <template v-for="(direction, d_key) in ['north', 'east', 'south', 'west']">
                                  <span :key="`${b_key}_${d_key}`">
                                    <label :for="`${input.control_id}_${direction}`" class="eui-label-nopointer">{{direction.substring(0, 1).toUpperCase()}}:</label>
                                    <b-form-input 
                                        :class="{ 'bbox': true, 'form-input-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[`${input.control_id}_${direction}`] || {}).$error }"
                                        type="text" 
                                        :id="`${input.control_id}_${direction}`" 
                                        :name="`${input.control_id}_${direction}`" 
                                        v-model="values[`${input.control_id}_${direction}`]"
                                        size="lg"
                                        :aria-label="`${input.control_id}_${direction}`"
                                        :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                        :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                        :placeholder="input.required || checkRequiredIf(input) ? 'required' : ''"
                                        >
                                    </b-form-input>
                                  </span>
                                </template>
                              </div>
                              <!-- Table Type of Input -->
                              <div v-if="input.type == 'table'" class="table-div w-100">
                                <template>
                                  <span class='table_required' v-if='input.required || checkRequiredIf(input)'>required</span>
                                  <b-editable-table 
                                    :class="{ 'editable-table': true, 'single-column':(question.inputs[c_key]['enums'].length === 1), 'form-table-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error }"
                                    bordered 
                                    fixed
                                    responsive 
                                    sticky-header 
                                    show-empty
                                    :id="input.control_id"
                                    :value="values[input.control_id]"
                                    :items="values[input.control_id]"
                                    :fields="question.inputs[c_key]['enums'].concat([{key:'X'}])">
                                    <template #head(X)="data">
                                      <b-button 
                                        class="" 
                                        type="add_row" 
                                        id="add_row_button" 
                                        aria-label="add row button" 
                                        style="margin: 0px;"
                                        @click="addRow(input.control_id, data.item)">
                                        <font-awesome-icon icon="plus"/>
                                      </b-button>
                                    </template>
                                    <template #cell(X)="data">
                                      <b-button 
                                        class="button" 
                                        aria-label="remove row button" 
                                        style="margin:0px"
                                        @click="removeRow(input.control_id, data.item)">
                                        <font-awesome-icon icon="trash-alt"/>
                                      </b-button>
                                      <template v-if="moveUpDown(input.control_id, data.item, 'up', true)">
                                        &nbsp;
                                        <b-button 
                                          class="button" 
                                          aria-label="move up button" 
                                          style="margin:0px"
                                          @click="moveUpDown(input.control_id, data.item, 'up')">
                                          <font-awesome-icon icon="arrow-up"/>
                                        </b-button>
                                      </template>
                                      <template v-if="moveUpDown(input.control_id, data.item, 'down', true)">
                                        &nbsp;
                                        <b-button 
                                          class="button" 
                                          aria-label="move down button" 
                                          style="margin:0px"
                                          @click="moveUpDown(input.control_id, data.item, 'down')">
                                          <font-awesome-icon icon="arrow-down"/>
                                        </b-button>
                                      </template>
                                    </template>
                                  </b-editable-table>
                                </template>
                              </div>
                              <!-- end of table type of Input -->
                              <!-- Textarea Type of Input -->
                              <b-form-textarea 
                                  :class="{ 'form-textarea-error': !($v.values[`section_${a_key}`] || {}).$error && !($v.values[`question_${a_key}_${b_key}`] || {}).$error && ($v.values[input.control_id] || {}).$error, 'extra_space': !input.label }"
                                  :type="input.type" 
                                  :id="input.control_id" 
                                  :name="input.control_id" 
                                  v-model="values[input.control_id]"
                                  size="lg" 
                                  :aria-label="input.control_id"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                  :readonly="readonly || Boolean(getAttribute('readonly', question.inputs[c_key]))"
                                  :cols="getAttribute('cols', question.inputs[c_key])"
                                  :rows="getAttribute('rows', question.inputs[c_key])"
                                  :maxlength="getAttribute('maxlength', question.inputs[c_key])"
                                  :minlength="getAttribute('minlength', question.inputs[c_key])"
                                  :placeholder="input.required || checkRequiredIf(input) ? 'required' : ''"
                                  @focus="resize(input.control_id)"
                                  @keyup="resize(input.control_id)"
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
                                  :aria-label="input.control_id"
                                  :options="input.options"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))">
                                  <span class='required' v-if='input.required || checkRequiredIf(input)'>required</span>
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
                                  :aria-label="input.control_id"
                                  :options="input.options"
                                  :disabled="disabled || Boolean(getAttribute('disabled', question.inputs[c_key]))"
                                  :placeholder="input.required || checkRequiredIf(input) ? 'required' : ''"
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
                                  :placeholder="input.required || checkRequiredIf(input) ? 'required' : ''"
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
                                          <span v-else-if="input.validation_error_msg !== undefined" v-html="input.validation_error_msg"></span>
                                          <template v-else>is required</template>
                                        </span>
                                      </template>
                                    </template> 
                                    <span v-else-if="input.validation_error_msg !== undefined" v-html="input.validation_error_msg"></span>
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
                                        <template v-if="req_if.message !== undefined">{{ heading.heading }}{{ typeof question.long_name !== 'undefined' ? ` - ${question.long_name}` : ''}}{{ typeof input.label !== 'undefined' && input.label !==''  && input.label !== 'undefined' ? ` - ${input.label}` : ''}} - {{req_if.message}}</template>
                                        <span v-else-if="input.validation_error_msg !== undefined" v-html="`${heading.heading} - ${question.long_name} - ${input.validation_error_msg}`"></span>
                                        <template v-else>{{ heading.heading }} - {{ question.long_name }} is required</template>
                                      </span>
                                    </template>
                                  </template>
                                  <span v-else-if="input.validation_error_msg !== undefined" v-html="`${heading.heading} - ${question.long_name} - ${input.validation_error_msg}`"></span>
                                  <template v-else>
                                    {{ heading.heading }} - {{ question.long_name }} {{ typeof input.label !== 'undefined' && input.label !=='' && input.label !== 'undefined' ? ` - ${input.label}` : ''}}
                                    <template v-if="$v.values[input.control_id].required !== undefined && !$v.values[input.control_id].required">is required</template>
                                    <template v-else-if="input.type == 'number'"> - Numbers must be positive digits.</template>
                                    <template v-else-if="input.type == 'datetimePicker' && !isDateValid(input.control_id, 'validity') && $v.values[input.control_id]"> Date must be in one of the following formats: YYYY-MM-DD, MM/DD/YYYY, M-D-YYYY, MM/D/YYYY, Mon D YYYY, DD Month YYYY, Month D, YYYY</template>
                                    <template v-else-if="input.type == 'datetimePicker' && !isDateValid(input.control_id, 'greater') && $v.values[input.control_id]"> Date must be less than or equal to End date</template>
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
<script src="../assets/js/FormsQuestions.js"></script>
<style scoped src="../assets/css/FormsQuestions.css"></style>