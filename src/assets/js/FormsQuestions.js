/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// Basic html5 validation
import {
  required,
  requiredIf,
  minLength,
  maxLength
} from 'vuelidate/lib/validators';
import FixedHeader from 'vue-fixed-header';
import BEditableTable from 'bootstrap-vue-editable-table';
import mixin from '@/mixins/mixin.js';

// This FormsQuestions component gets the questions data for the selected daac and
// sets the template properties, methods, and custom validation used.
export default {
  mixins: [mixin],
  name: 'FormsQuestions',
  data() {
    return {
      values: {},
      questions: [],
      contacts: [],
      contact_fields: [],
      saveTimeout: 0,
      daac: '',
      confirm: false,
      validation_errors: {},
      formId: '',
      requestId: '',
      daac_name: '',
      valueHistory: [{ fromUndo: true }],
      valueHistoryUndoIdx: 0,
      alertVariant: 'success',
      alertMessage: '',
      dismissSecs: 7,
      dismissCountDown: 0,
      timer: null
    };
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
  computed: {},
  watch: {
    // @vuese
    // This watches for any changes in values to re-evaluate
    // contacts so if a same as checkbox is checked, it will update
    // the values.
    //
    // It also resets history to be correct, otherwise history will
    // have each system correction and undo / redo will not work
    // correctly.
    //
    // Then it resets the log.
    values: {
      handler() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
          if (typeof this.values !== 'undefined') {
            if (!this.values.fromUndo) {
              this.setContacts(this.values);
              for (const sameAs of Object.keys(this.values).filter((item) => /^same_as_/.test(item))) {
                if (this.values[sameAs].toString() === 'true') {
                  for (const v in this.values) {
                    if (new RegExp(`^same_as_.*_${v}$`).test(sameAs)) {
                      const to_base_name = sameAs.replace(/^same_as_/, '').replace(new RegExp(`_${v}$`), '').replace(/_name/g, '').replace(/_organization/g, '')
                        .replace(/_department/g, '')
                        .replace(/_email/g, '')
                        .replace(/_orcid/g, '');
                      const from_base_name = v.replace(/_name/g, '').replace(/_organization/g, '').replace(/_department/g, '').replace(/_email/g, '')
                        .replace(/_orcid/g, '');
                      for (const ea in this.values) {
                        if (new RegExp(`^${from_base_name}_`).test(ea)) {
                          this.$set(this.values, ea.replace(`${from_base_name}_`, `${to_base_name}_`), this.values[ea]);
                        }
                      }
                    }
                  }
                }
              }
              // try to handle items going from '' to undefined
              const saveValues = JSON.parse(JSON.stringify(this.values));
              for (const ea in saveValues) {
                if (!(saveValues[ea]) && saveValues[ea] !== 'false') {
                  delete saveValues[ea];
                }
              }
              saveValues.fromUndo = true;
              if (this.valueHistory.length === 0 || JSON.stringify(saveValues, Object.keys(saveValues).sort()) !== JSON.stringify(this.valueHistory[this.valueHistory.length - 1], Object.keys(this.valueHistory[this.valueHistory.length - 1]).sort())) {
                this.valueHistory.splice(this.valueHistory.length - this.valueHistoryUndoIdx);
                this.valueHistory.push(saveValues);
                this.valueHistoryUndoIdx = 0;
              }
              this.$log.debug(
                'pushQuestionsState',
                saveValues
              );
              const string_logging_object = this.$log.debug('pushQuestionsState');
              this.$logging_object[Date(Date.now()).toString()] = {
                log_string: string_logging_object,
                answers: saveValues
              };
            }
            delete this.values.fromUndo;
            if (this.$v.$anyError) {
              this.$v.$touch();
            }
          }
        }, 0);
      },
      deep: true
    }
  },
  created() { },
  components: {
    FixedHeader,
    BEditableTable
  },
  validations() {
    const val_fields = {
      values: {}
    };
    let obj = [];
    if (
      typeof this.questions !== 'undefined'
      && typeof this.questions.inputs !== 'undefined'
    ) {
      obj = this.questions.inputs;
    } else if (typeof this.questions !== 'undefined') {
      obj = this.questions;
    }
    // Gather required elements
    // returning true in a custom validation is that it passes the validation, false does not pass
    for (const [group_index, group] of obj.entries()) {
      if (
        typeof group.heading_required !== 'undefined'
        && group.heading_required
        && this.showIf(group.heading_show_if)
      ) {
        val_fields.values[`section_${group_index}`] = {
          required: requiredIf(() => {
            for (const question of group) {
              if (!this.validateQuestionInputsRequired(question.inputs)) {
                return false;
              }
            }
            return true;
          })
        };
      }
      for (const [question_index, question] of group.entries()) {
        if (typeof question.required !== 'undefined' && question.required && this.showIf(question.show_if)) {
          val_fields.values[`question_${group_index}_${question_index}`] = {
            required: requiredIf(() => this.validateQuestionInputsRequired(question.inputs))
          };
        }
        if (typeof question.inputs !== 'undefined') {
          for (const fld of question.inputs) {
            if (this.showIf(fld.show_if)) {
              if (fld.type === 'bbox') {
                for (const direction of ['north', 'east', 'south', 'west']) {
                  val_fields.values[`${fld.control_id}_${direction}`] = {
                    bbox: () => this.getBboxError(fld, direction) === ''
                  };
                  if (typeof fld.required !== 'undefined' && fld.required) {
                    val_fields.values[
                      `${fld.control_id}_${direction}`
                    ].required = required;
                  } else if (typeof fld.required_if !== 'undefined') {
                    val_fields.values[
                      `${fld.control_id}_${direction}`
                    ].required = requiredIf(() => this.checkRequiredIf(fld));
                  }
                }
              } else if (fld.type === 'table') {
                const enum_arr = [];
                for (const subfield in fld.enums) {
                  enum_arr.push(fld.enums[subfield].key);
                }
                val_fields.values[`${fld.control_id}`] = {};
                if (typeof fld.required !== 'undefined' && fld.required) {
                  val_fields.values[
                    `${fld.control_id}`
                  ].required = required;
                } else if (typeof fld.required_if !== 'undefined') {
                  val_fields.values[
                    `${fld.control_id}`
                  ].required = requiredIf(() => {
                    for (const req_fld of fld.required_if) {
                      try {
                        if (
                          typeof this.values[req_fld.field] !== 'undefined'
                          && this.values[req_fld.field].toString()
                          === req_fld.value.toString()
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
              } else {
                if (typeof fld.required !== 'undefined' && fld.required) {
                  if (fld.type !== 'checkbox') {
                    val_fields.values[fld.control_id] = {
                      required
                    };
                  }
                } else if (typeof fld.required_if !== 'undefined') {
                  val_fields.values[fld.control_id] = {
                    required: requiredIf(() => {
                      try {
                        for (const req_fld of fld.required_if) {
                          try {
                            if (
                              typeof this.values[req_fld.field] !== 'undefined'
                              && this.values[req_fld.field].toString()
                              === req_fld.value.toString()
                            ) {
                              return true;
                            }
                          } catch (e) {
                            // test
                          }
                        }
                        return false;
                      } catch (e) {
                        // test
                      }
                    })
                  };
                }
                if (
                  typeof fld.attributes !== 'undefined'
                  && typeof fld.attributes.pattern !== 'undefined'
                ) {
                  val_fields.values[fld.control_id] = val_fields.values[fld.control_id] || {};
                  val_fields.values[fld.control_id].patternMatch = () => {
                    if (typeof this.values[fld.control_id] !== 'undefined') {
                      return new RegExp(fld.attributes.pattern).test(
                        this.values[fld.control_id]
                      );
                    }
                    return false;
                  };
                }
                if (fld.type === 'date') {
                  val_fields.values[fld.control_id] = val_fields.values[fld.control_id] || {};
                  val_fields.values[fld.control_id].startEndDates = () => {
                    if (typeof fld.control_id !== 'undefined') {
                      if (!this.isDateValid(fld.control_id, 'greater')) {
                        return false;
                      }
                      if (!this.isDateValid(fld.control_id, 'validity')) {
                        return false;
                      }
                      return true;
                    }
                    return true;
                  };
                }
                if (fld.type === 'number') {
                  val_fields.values[fld.control_id] = val_fields.values[fld.control_id] || {};
                  val_fields.values[fld.control_id].noNegatives = () => {
                    if (parseInt(this.values[fld.control_id]) < 0) {
                      return false;
                    }
                    return true;
                  };
                }
                if (
                  typeof fld.attributes !== 'undefined'
                  && typeof fld.attributes.minlength !== 'undefined'
                ) {
                  val_fields.values[fld.control_id] = val_fields.values[fld.control_id] || {};
                  val_fields.values[fld.control_id].minLength = minLength(
                    fld.attributes.minlength
                  );
                }

                if (
                  typeof fld.attributes !== 'undefined'
                  && typeof fld.attributes.maxlength !== 'undefined'
                ) {
                  val_fields.values[fld.control_id] = val_fields.values[fld.control_id] || {};
                  val_fields.values[fld.control_id].maxLength = maxLength(
                    fld.attributes.maxlength
                  );
                }
              }
            }
          }
        }
      }
    }
    let DAAC_SET;
    if (typeof this.$store !== 'undefined' && this.$store.state.global_params.group !== '') {
      DAAC_SET = this.$store.state.global_params.group;
    }
    if (DAAC_SET !== null) {
      this.$required = JSON.stringify(val_fields.values);
    }
    return val_fields;
  },
  mounted() {
    // @vuese
    // On load it sets the local variables from the store,
    // then it sets the address location with the daac,
    // then it gets the questions,
    // then finally loads the answers.
    window.questionsComponent = this;
    this.setActiveNav('questions');
    this.getIDs().then(() => {
      this.setLocalVars();
      this.fetchQuestions().then(() => {
        this.accessibilityHack();
        this.loadAnswers();
      });
    });
    // 10 min timer on loop
    this.timer = setInterval(() => {
      this.saveFile('draft', true);
    }, (1000 * 60 * 10));
  },
  methods: {
    // @vuese
    // Sets local variables
    setLocalVars() {
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params.formId !== '') {
        this.formId = this.$store.state.global_params.formId;
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params.requestId !== '') {
        this.requestId = this.$store.state.global_params.requestId;
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params.group !== '') {
        this.daac = this.$store.state.global_params.group;
      }
      if (typeof window.headerComponent !== 'undefined') {
        window.headerComponent.daac = this.daac;
      }
    },
    resize(id) {
      const textarea = document.getElementById(id);
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    // @vuese
    // Checks if field is a required_if field
    // @arg fld [String] the id of the field in question,
    checkRequiredIf(fld) {
      if (fld.required_if) {
        try {
          for (const req_fld of fld.required_if) {
            try {
              if (
                typeof this.values[req_fld.field] !== 'undefined'
                && this.values[req_fld.field].toString()
                === req_fld.value.toString()
              ) {
                return true;
              }
            } catch (e) {
              // test
            }
          }
        } catch (e) {
          // test
        }
      }
      return false;
    },
    // @vuese
    // Accessibility hack that manipulates library components
    accessibilityHack() {
      const buttons = document.getElementsByTagName('button');
      for (const ea in buttons) {
        if (buttons[ea].ariaLabel == null && typeof buttons[ea].id !== 'undefined') {
          try {
            buttons[ea].ariaLabel = buttons[ea].id;
          } catch (err) {
            // console.error(err);
          }
        }
      }
    },
    // @vuese
    // Goes to daacs after asking if okay if new data present.
    goToDaacs() {
      this.compareDataAskLeave('daacs');
    },
    // @vuese
    // Adds a new row to the table
    // @arg tableId [String] the id of the table in question
    addRow(tableId) {
      const enum_arr = {};
      for (const group of this.questions) {
        for (const question of group) {
          if (typeof question.inputs !== 'undefined') {
            for (const input of question.inputs) {
              // eslint-disable-next-line no-continue
              if (input.type !== 'table') { continue; }
              if (input.control_id === tableId) {
                for (const e in input.enums) {
                  const en = input.enums[e];
                  enum_arr[`${en.key}`] = this.values[`${tableId}_${en.key}`];
                }
                if (!this.values[tableId]) {
                  this.$set(this.values, tableId, []);
                }
                this.values[tableId].push(enum_arr);
                break;
              }
            }
          }
        }
      }
    },
    // @vuese
    // Removes the selected table row
    // @arg tableId [String] the id of the table in question,
    // @arg item [Array] the item in question
    removeRow(tableId, item) {
      for (let r = 0; r < this.values[tableId].length; r++) {
        const row = this.values[tableId][r];
        let found = true;
        for (const field of Object.keys(row)) {
          if (row[field] !== item[field]) {
            found = false;
            break;
          }
        }
        if (found) {
          this.values[tableId].splice(r, 1);
          break;
        }
      }
    },
    // @vuese
    // Moves the selected table row
    // @arg tableId [String] the id of the table in question,
    // @arg item [Array] the item in question
    // @arg direction [String] which direction the item should move to.
    moveUpDown(tableId, item, direction, canMove = false) {
      for (let r = 0; r < this.values[tableId].length; r++) {
        const row = this.values[tableId][r];
        let found = true;
        for (const field of Object.keys(row)) {
          if (row[field] !== item[field]) {
            found = false;
            break;
          }
        }
        if (found) {
          if (direction === 'up') {
            if (r >= 1) {
              if (canMove) {
                return true;
              }
              const other_row = this.values[tableId][r - 1];
              this.values[tableId].splice(r, 1, other_row);
              this.values[tableId].splice(r - 1, 1, row);
              break;
            }
          }
          if (direction === 'down') {
            if (r < this.values[tableId].length - 1) {
              if (canMove) {
                return true;
              }
              const other_row = this.values[tableId][r + 1];
              this.values[tableId].splice(r, 1, other_row);
              this.values[tableId].splice(r + 1, 1, row);
              break;
            }
          }
        }
      }
    },
    // @vuese
    // Formats any date text to YYYY-MM-DD
    // @arg event [Object] the event that executed
    fixDate(event) {
      if (this.values[event.target.id] !== '') {
        try {
          new Date(this.values[event.target.id]).toISOString();
          // eslint-disable-next-line prefer-destructuring
          this.values[event.target.id] = new Date(this.values[event.target.id]).toISOString().split('T')[0];
        } catch {
          //
        }
      }
    },
    // @vuese
    // Checks if date text is valid
    // Validates the the end date is > or = start
    // @arg id [String] the hash id used to lookup the value,
    // @arg check_type [String] optional, accepts "greater" or "validity" with "greater" being default
    isDateValid(id, check_type = 'greater') {
      let start; let
        end;
      if (id.match(/start/g)) {
        start = id;
        end = id.replace(/start/g, 'end');
      } else if (id.match(/end/g)) {
        end = id;
        start = id.replace(/end/g, 'start');
      }
      if (typeof this.values[start] !== 'undefined' && typeof this.values[end] !== 'undefined') {
        const start_bits = this.values[start].split('-');
        const end_bits = this.values[end].split('-');
        const start_date_obj = new Date(
          start_bits[0],
          start_bits[1] - 1,
          start_bits[2]
        );
        const end_date_obj = new Date(
          end_bits[0],
          end_bits[1] - 1,
          end_bits[2]
        );
        if (
          id.match(/start/g)
          && typeof start_date_obj !== 'undefined'
        ) {
          if (
            start_date_obj !== 'Invalid Date'
            && check_type === 'greater'
          ) {
            if (start_date_obj > end_date_obj) {
              return false;
            }
          } else if (
            check_type === 'validity'
            && start_date_obj === 'Invalid Date'
          ) {
            return false;
          }
        }
        if (
          id.match(/end/g)
          && typeof end_date_obj !== 'undefined'
        ) {
          if (
            check_type === 'validity'
            && end_date_obj === 'Invalid Date'
          ) {
            return false;
          }
        }
      }
      return true;
    },
    // @vuese
    // Validates required question inputs; returns true if valid
    // @arg inputs [Array] of inputs to look for bbox in
    validateQuestionInputsRequired(inputs) {
      for (const input of inputs) {
        if (input.type === 'bbox') {
          let has_all_directions = true;
          for (const direction of ['north', 'east', 'south', 'west']) {
            if (
              typeof this.values[`${input.control_id}_${direction}`]
              === 'undefined'
              || this.values[`${input.control_id}_${direction}`] === ''
              || this.values[`${input.control_id}_${direction}`] == null
            ) {
              has_all_directions = false;
            }
          }
          if (has_all_directions) {
            return false;
          }
        } else if (
          typeof this.values[input.control_id] !== 'undefined'
          && this.values[input.control_id] !== ''
          && this.values[input.control_id] != null
        ) {
          if (
            input.type !== 'checkbox'
            || this.values[input.control_id].toString() !== 'false'
          ) {
            return false;
          }
        }
      }
      return true;
    },
    // @vuese
    // Gets custom bbox validation errors; returns blank if valid
    // @arg fld [Object] the bbox field,
    // @arg direction [String] The direction of the fld
    getBboxError(fld, direction) {
      if (
        typeof this.values[`${fld.control_id}_${direction}`] !== 'undefined'
        && this.values[`${fld.control_id}_${direction}`] != null
      ) {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(this.values[`${fld.control_id}_${direction}`])) {
          return 'Must be a number';
        }
        const this_val = parseFloat(
          this.values[`${fld.control_id}_${direction}`]
        );
        const comp_direction = {
          south: 'north',
          west: 'east'
        };
        const comp_val = parseFloat(
          this.values[`${fld.control_id}_${comp_direction[direction]}`]
        );
        const label = `${direction.substring(0, 1).toUpperCase()}`;
        if (/west|south/.test(direction) && this_val > comp_val) {
          return `${label} must be less than ${comp_direction[direction]
            .substring(0, 1)
            .toUpperCase()}`;
        }
        if (direction === 'west' && this_val >= 180.0) {
          return `${label} must be less than 180.0`;
        }
        if (direction === 'east' && this_val <= -180.0) {
          return `${label} must be greater than -180.0`;
        }
        if (direction === 'south' && this_val >= 90.0) {
          return `${label} must be less than 90.0`;
        }
        if (direction === 'north' && this_val <= -90.0) {
          return `${label} must be greater than -90.0`;
        }

        if (direction === 'west' && this_val < -180.0) {
          return `${label} is out of range. ${label} must be greater than -180.0`;
        }
        if (direction === 'east' && this_val > 180.0) {
          return `${label} is out of range. ${label} must be less than 180.0`;
        }
        if (direction === 'south' && this_val < -90.0) {
          return `${label} is out of range. ${label} must be greater than -90.0`;
        }
        if (direction === 'north' && this_val > 90.0) {
          return `${label} is out of range. ${label} must be less than 90.0`;
        }
      }
      return '';
    },
    // @vuese
    // Shows and Hides based of json show_if
    // @arg config [Array] validates for showif
    showIf(config) {
      if (config == null || typeof config === 'undefined' || config.length === 0 || !Array.isArray(config)) {
        return true;
      }
      for (const fld of config) {
        if (
          typeof this.values[fld.field] !== 'undefined'
          && this.values[fld.field] !== ''
          && this.values[fld.field] != null
        ) {
          if (this.values[fld.field].toString() === fld.value.toString()) {
            return true;
          }
        }
      }
      return false;
    },
    // @vuese
    // Copies over contact information from the 'same as' checkbox for contact
    // @arg fld_to [String] the id of the element to set to,
    // @arg fld_from [String] the id of the element it's coming from,
    // @arg contact_key [String] the contact key needed to check checkbox state
    setContact(fld_to, fld_from, contact_key) {
      const checked = !document.getElementById(`same_as_${fld_to}_${contact_key}`).checked;
      const to_base_name = fld_to.replace(/_name/g, '').replace(/_organization/g, '').replace(/_department/g, '').replace(/_email/g, '')
        .replace(/_orcid/g, '');
      const from_base_name = fld_from.replace(/_name/g, '').replace(/_organization/g, '').replace(/_department/g, '').replace(/_email/g, '')
        .replace(/_orcid/g, '');
      if (checked) {
        for (const ea in this.values) {
          if (new RegExp(`^${from_base_name}_`).test(ea)) {
            this.$set(this.values, ea.replace(`${from_base_name}_`, `${to_base_name}_`), this.values[ea]);
          }
        }
      } else {
        for (const ea in this.values) {
          if (new RegExp(`^${to_base_name}_`).test(ea)) {
            this.$set(this.values, ea, '');
          }
        }
      }
    },
    // @vuese
    // Returns the same as id as string
    // @arg control_id [String] the control id,
    // @arg contact_fld [String] the contact field
    getSameAsId(control_id, contact_fld) {
      return `same_as_${control_id}_${contact_fld}`;
    },
    // @vuese
    // Compares to see if same is checked
    // @arg control_id [String] the control id to compare against,
    // @arg contact_fld [String] the contact field to compare against
    sameAsSelected(control_id, contact_fld) {
      const matchRegExp = new RegExp(`^same_as_${control_id}_`);
      for (const ea in this.values) {
        let from_has_name = false;
        const from_name = ea.split('name_')[1];
        if (typeof from_name !== 'undefined' && this.values[from_name] !== '') {
          from_has_name = true;
        }
        if (matchRegExp.test(ea) && (typeof contact_fld === 'undefined' || ea !== this.getSameAsId(control_id, contact_fld))) {
          if (this.values[ea] && this.values[ea] !== 'false' && from_has_name) {
            return true;
          }
        }
      }
      return false;
    },
    // @vuese
    // Compares to see if any sameas is checked
    // @arg control_id [String] the control id to compare against
    anySameAsSelected(control_id) {
      return this.sameAsSelected(control_id.replace(/_name/g, '').replace(/_organization/g, '').replace(/_department/g, '').replace(/_email/g, '')
        .replace(/_orcid/g, ''));
    },
    // @vuese
    // Gets contacts and builds options for checkbox
    // @arg values [Object] the forms values to look for contacts in
    setContacts(values) {
      this.contacts = [];
      this.contact_fields = [];
      const questions = this.questions[0];
      for (const ea in values) {
        if (!ea.toLowerCase().match(/name/g)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (typeof questions !== 'undefined') {
          for (const section of questions) {
            const { inputs } = section;
            const { text } = section;
            const { long_name } = section;
            const { help } = section;
            for (const i in inputs) {
              const inp = inputs[i];
              const { label } = inp;
              if (ea === inp.control_id) {
                if (
                  ((typeof text !== 'undefined'
                    && text.toLowerCase().match(/person/g))
                    || (typeof text !== 'undefined'
                      && text.toLowerCase().match(/contact/g))
                    || (typeof long_name !== 'undefined'
                      && long_name.toLowerCase().match(/person/g))
                    || (typeof long_name !== 'undefined'
                      && long_name.toLowerCase().match(/contact/g))
                    || (typeof help !== 'undefined'
                      && help.toLowerCase().match(/person/g))
                    || (typeof help !== 'undefined'
                      && help.toLowerCase().match(/contact/g)))
                  && label.toLowerCase().match(/name/g)
                  && this.contacts.includes(long_name)
                  === false
                ) {
                  this.contacts.push(long_name);
                  this.contact_fields.push(inp.control_id);
                }
              }
            }
          }
        }
      }
    },
    // @vuese
    // Gets characters remaining from textarea
    // @arg value [String] the current value,
    // @arg maxlength [Number] the maxlength to compare against the value
    charactersRemaining(value, maxlength) {
      let left = maxlength;
      let chars = 0;
      if (typeof value === 'string' && value !== '') {
        chars = value.length;
      }
      if (typeof maxlength !== 'undefined' && parseInt(maxlength) > 0) {
        left = parseInt(maxlength - chars);
      }
      return left;
    },
    // @vuese
    // Gets input attributes and filters out those that are undefined
    // @arg attr [String] the input attribute value,
    // @arg input [String] the input the attribute belongs to
    getAttribute(attr, input) {
      let attribute_value;
      if (
        typeof input.attributes !== 'undefined'
        && typeof input.attributes[attr] !== 'undefined'
      ) {
        attribute_value = input.attributes[attr];
      }
      return attribute_value;
    },
    // @vuese
    // Handle html5 invalidity on form
    // @arg evt [Object] the event
    handleInvalid(evt) {
      if (document.getElementById(`${evt.target.name}_invalid`) != null) {
        document.getElementById(`${evt.target.name}_invalid`).textContent = evt.target.validationMessage;
        document.getElementById(`${evt.target.name}_invalid`).classList.remove('hidden');
      }
      if (evt.target.validationMessage !== '') {
        this.validation_errors = {
          ...this.validation_errors,
          [evt.target.name]: evt.target.validationMessage
        };
      } else {
        if (document.getElementById(`${evt.target.name}_invalid`) != null) {
          document.getElementById(`${evt.target.name}_invalid`).classList.add('hidden');
        }
        if (evt.target.name in this.validation_errors) {
          delete this.validation_errors[evt.target.name];
        }
      }
      if (this.$v.$anyError) {
        this.$v.$touch();
      }
    },
    // @vuese
    // Prevents submit to apply validation;
    // @arg evt [Object] the event
    enterSubmitForm() {
      if (this.enterSubmit) {
        this.submitForm();
      }
    },
    // @vuese
    // If there's no errors, submits
    submitForm() {
      this.saveFile('submit');
    },
    // @vuese
    // If there's no errors, saves
    draftFile() {
      this.saveFile('draft');
    },
    // @vuese
    // Loads answers using request id
    loadAnswers() {
      if (JSON.stringify(this.values) === '{}'
        && typeof this.$store !== 'undefined'
        && this.$store.state.global_params.formId !== ''
        && this.$store.state.global_params.requestId !== ''
        && typeof this.$store.state.global_params.requestId !== 'undefined'
        && !this.$testing) {
        const options = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`
          }
        };
        fetch(`${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_REQUEST_URL}/${this.$store.state.global_params.requestId}`, options)
          .then((r) => r.json())
          .then((answers) => {
            this.checkApiResponse(answers);
            if (answers.error) {
              return {};
            }
            this.valueHistory = [];
            this.values = answers.form_data;
            setTimeout(() => {
              this.setContacts(this.values);
            }, '3000');
          }).catch(() => {
            const url = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`;
            if (!this.$testing) {
              localStorage.removeItem('auth-token');
              window.location.href = url;
            } else { this.confirmExit(url); }
          });
      }
    },
    // @vuese
    // Cancels current edits and exits the form
    okToCancel() {
      if (document.getElementById('eui-banner') != null) {
        document.getElementById('eui-banner').classList.add('hidden');
      }
      if (Object.keys(this.values).length > 0) {
        this.$refs.form.reset();
        this.$values = {};
        this.$v.$touch();
      }
      if (document.getElementById('reset_data') != null) {
        document.getElementById('reset_data').focus();
      }
      this.confirm = false;
      this.exitForm();
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
      this.valueHistoryUndoIdx++;
      this.$set(this, 'values', JSON.parse(JSON.stringify(this.valueHistory[this.valueHistory.length - this.valueHistoryUndoIdx - 1])));
    },
    // @vuese
    // Redos the form state
    redoToPreviousState() {
      this.valueHistoryUndoIdx--;
      this.$set(this, 'values', JSON.parse(JSON.stringify(this.valueHistory[this.valueHistory.length - this.valueHistoryUndoIdx - 1])));
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
