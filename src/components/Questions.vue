<template>
  <!-- Form -->
  <b-form ref="form" name="questions_form" v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="cancelForm" @invalid.capture.prevent="handleInvalid" @change="handleChange">
    <b-container>
        <fixed-header :fixed.sync="isFixed" :threshold="168">
            <div class="navbar">
                <!-- Button Options -->
                <div class="button_bar">
                    <div align=left v-if="!readonly" class="left_button_bar">
                        <b-button class="button" type="redo" id="redo_button" v-if="canRedo" @click="redoToPreviousState()"><font-awesome-icon v-bind:icon="redoLabel">{{ redoLabel }}</font-awesome-icon></b-button>
                        <b-button class="button" type="redo" id="redo_button" v-else disabled><font-awesome-icon v-bind:icon="redoLabel">{{ redoLabel }}</font-awesome-icon></b-button>
                        <b-button class="button" type="undo" id="undo_button" v-if="canUndo" @click="undoToPreviousState()"><font-awesome-icon v-bind:icon="undoLabel">{{ undoLabel }}</font-awesome-icon></b-button>
                        <b-button class="button" type="undo" id="undo_button" v-else disabled><font-awesome-icon v-bind:icon="undoLabel">{{ undoLabel }}</font-awesome-icon></b-button>
                    </div>
                    <div align=right v-if="!readonly" class="right_button_bar">
                        <b-button class="eui-btn--blue" type="draft" id="draft_data" @click=draftFile(true)>{{ draftLabel }}</b-button>
                        <b-button class="eui-btn--blue" type="save" id="save_data" @click=saveFile(true)>{{ saveLabel }}</b-button>
                        <b-button class="eui-btn--green" type="submit" id="submit_data" @click=submitForm>{{ submitLabel }}</b-button>
                        <b-button class="eui-btn--red" type="reset" id="reset_data" v-if="showCancelButton">{{ cancelLabel }}</b-button>
                    </div>
                </div>
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
        <h3 v-if="warning" class="warning">{{warning}}</h3>
        <!-- Section -->
        <section>
            <b-row v-for="(heading, a_key) in questions" :key="a_key">
                <h3>{{heading.heading}}</h3>
                <div id=questions>
                    <!-- Question -->
                    <b-form-group v-for="(question, b_key) in heading" 
                    :class="{ 'form-group-error': ($v.values[question.id] || {}).$error }"
                    :key="b_key" 
                    size="lg" lg=12
                    :disabled="readonly">
                        <label :for="question.id" class="eui-label">{{question.title}}:</label>
                        <span class="required" v-if="question.required == true">* required</span>
                        <p :id="question.id || a_key">{{question.text}}</p>
                        <!--<b-col class="w-50 help" :id="question.id">
                            <a href="#" v-if="question.help != ''" @click:=getHelp(question.id)>Help</a>
                            <div class="hidden overlay">{{question.help}}</div>
                        </b-col>-->
                        <!-- Input -->
                        <b-row v-for="(input, c_key) in question.inputs" :key="c_key">
                            <label :for="input.id || input + '_' + c_key" class="eui-label">{{input.label}}: </label>
                            <span class="required" v-if="input.required == true && input.type!='checkbox'">* required</span>
                            <!-- Text Type of Input -->
                            <b-form-input 
                                :class="{ 'form-input-error': ($v.values[input.id] || {}).$error }"
                                :type="input.type" 
                                :id="input.id" 
                                :name="input.id" 
                                v-model="values[input.id]"
                                size="lg" lg=12
                                :disabled="readonly"
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
                                input.attrib_string>
                            </b-form-input>
                            <!-- End of Text Type of Input -->
                            <!-- Checkbox Type of Input -->
                            <b-form-checkbox 
                                :class="{ 'form-checkbox-error': ($v.values[input.id] || {}).$error, 'checkboxes':true }"
                                :type="input.type" 
                                :id="input.id" 
                                :name="input.id" 
                                v-model="values[input.id]"
                                size="lg" lg=12
                                :disabled="readonly"
                                value="true"
                                unchecked-value="false"
                                v-if="input.type == 'checkbox'" 
                                input.attrib_string>
                            </b-form-checkbox>
                            <span :id="input.id" class="required" v-if="input.required == true && input.type == 'checkbox'">* required </span>
                            <!-- End of Checkbox Type of Input -->
                            <!-- Textarea Type of Input -->
                            <b-form-textarea 
                                :class="{ 'form-textarea-error': ($v.values[input.id] || {}).$error }"
                                :type="input.type" 
                                :id="input.id" 
                                :name="input.id" 
                                v-model="values[input.id]"
                                size="lg" lg=12
                                :disabled="readonly"
                                v-else-if="input.type == 'textarea'" 
                                input.attrib_string>
                            </b-form-textarea>
                            <!-- End of Textarea Type of Input -->
                            <!-- Radio Group Type of Input -->
                            <b-form-radio-group
                                :class="{ 'form-radio-group-error': ($v.values[input.id] || {}).$error }"
                                :type="input.type" 
                                :id="input.id" 
                                :name="input.id" 
                                v-model="values[input.id]"
                                size="lg" lg=12
                                value="true"
                                unchecked-value="false"
                                :disabled="readonly"
                                v-else-if="input.type == 'radio'" 
                                :options="input.options" 
                                input.attrib_string>
                            </b-form-radio-group>
                            <!-- End of Radio Group Type of Input -->
                            <!-- Select Type of Input -->
                            <b-form-select
                                :class="{ 'form-select-error': ($v.values[input.id] || {}).$error }"
                                :type="input.type" 
                                :id="input.id" 
                                :name="input.id" 
                                v-model="values[input.id]"
                                size="lg" lg=12
                                :disabled="readonly"
                                v-else-if="input.type == 'select'" 
                                :options="input.options" 
                                input.attrib_string>
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
                                size="lg" lg=12 
                                :disabled="readonly" 
                                v-else-if="input.type == 'file'" 
                                input.attrib_string>
                            </b-form-file>
                            <!-- End of File Type of Input -->
                            <!-- Selected Input File Name -->
                            <div class="mt-3" v-else-if="input.type == 'file' && values[input.id] != ''">Selected file: {{ values[input.id] ? values[input.id].name : '' }}</div>
                            <!-- End of Selected Input File Name -->
                            <p :id="input.id + '_invalid'" class="eui-banner eui-banner--danger hidden validation"></p>
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
</template>
<script>
    // Basic html5 validation 
    import { required } from 'vuelidate/lib/validators'
    // Jquery javascript
    import $ from 'jquery'
    import mixin from '../mixins/mixin'
    import FixedHeader from 'vue-fixed-header'

    // This questions component gets the questions data for the selected daac and
    // sets the above template properties, methods, and custom validation used.
    export default {
        name: 'Questions',
        mixins: [mixin],
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
            //console.log('Validations ...')
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
                                let is_conditional = this.checkForEnumConditional(fld.id, true)
                                if(is_conditional){
                                    this.conditionals.push(fld.id)
                                }
                            } else if(!has_enums){
                                let is_conditional = this.checkForIfOtherConditional(fld.id, true)
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
            return val_fields
        },
        methods: {
            // @vuese
            // Handle html5 invalidity on change
            handleChange(evt) {
                //console.log('handleChange :: ', evt.target.name);
                $('#' + evt.target.name + '_invalid').text(evt.target.validationMessage)
                if(evt.target.validationMessage!=''){
                    //console.log('errors being set to []')
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
                this.hasRequiredFields(this.values, JSON.parse(this.$required))
            },
            //TODO: if other still not working properly -> highlights right and adds another message but:
            //At the end, 'Data Format Other Info is required.' is still in messages and shouldn't be.
            //At the end, the one of sentence is there and shouldn't be
            //Dont know if the objects have them right or not 
            //-> suspect it's correct right after but re-added later
            //also, not removing messages once filled out for YES/NOs
            //styling on textboxes not always working (turning off)
            // @vuese
            // Handle html5 invalidity on form
            handleInvalid(evt) {
                //console.log('handleInvalid :: ', evt.target.name);
                $('#' + evt.target.name + '_invalid').text(evt.target.validationMessage)
                if(evt.target.validationMessage!=''){
                    //console.log('errors being set to []')
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
            // Converts sentence string to title case
            titleCase(str) {
                str = str.toLowerCase().split(' ');
                for (var i = 0; i < str.length; i++) {
                    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
                }
                return str.join(' ');
            },
            // @vuese
            // Checks for conditionally required elements from questions
            checkForEnumConditional(req, check_only){
                //console.log('conditional check for ' + req)
                let Qs = this.questions
                var options = []
                let conditional_found = false
                let id_added = ''
                let id_removed = ''
                let val_fields = { values: {} }
                if(typeof check_only == 'undefined'){
                    val_fields.values = JSON.parse(this.$required)
                }
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
                                                val_fields.values[details['id']] = { required }
                                                this.$required = JSON.stringify(val_fields.values)
                                                this.applyErrorStyle(details['id'], 'text')
                                                this.applyErrorStyle(req, 'text', true)
                                                let conditional_spelled_out = this.titleCase(req.replace(/_/g,' '))
                                                let msg = this.titleCase(details['id'].replace(/_/g,' ')) + " is required because " + conditional_spelled_out + ' is "' + this.titleCase(this.values[req]) + '".'
                                                if(this.errors.includes(msg) == false){
                                                    // console.log('pushing error 1 ',msg);
                                                    this.errors.push(msg);
                                                }
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
                }
                if (this.conditionals.includes(req) && typeof check_only == 'undefined'){
                    if(!conditional_found){
                        if(req in val_fields.values[req]){
                            delete val_fields.values[req]
                        }
                        this.$required = JSON.stringify(val_fields.values)
                        this.applyErrorStyle(id_removed, 'text', true)
                        this.applyErrorStyle(req, 'text')
                    } else {
                        if(req in val_fields.values[req]){
                            delete val_fields.values[req]
                        }
                        this.$required = JSON.stringify(val_fields.values)
                        this.hasRequiredFields(this.values, JSON.parse(this.$required), id_added, true)
                    }
                }
                return conditional_found
            },
            // @vuese
            // Checks for 'if other' conditionally required elements from questions
            checkForIfOtherConditional(req, check_only){
                let Qs = this.questions
                let conditional_found = false
                let id_added = ''
                let multi_msg = ''
                let val_fields = { values: {} }
                if(typeof check_only == 'undefined'){
                    val_fields.values = JSON.parse(this.$required)
                }
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
                                                if(typeof check_only == 'undefined'){
                                                    if(other_check_id in val_fields.values){
                                                        delete val_fields.values[other_check_id]
                                                    }
                                                    val_fields.values[req] = { required };
                                                    this.applyErrorStyle(req, 'text')
                                                    this.applyErrorStyle(other_check_id, 'checkbox', true)
                                                    for(let e in this.one_ofs){
                                                        let re = new RegExp(other_check_id, 'g')
                                                        if (this.one_ofs[e].match(re)){
                                                            let multi_key = this.one_ofs[e].split(',')
                                                            if (multi_key.length > 1){
                                                                multi_msg = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(this.one_ofs[e].replace(/_/g,' ').replace(/,/g,', ')) + ')'
                                                            }
                                                            let index = this.errors.indexOf(multi_msg);
                                                            if (index > -1) {
                                                                //console.log('splicing out of errors 3',multi_msg)
                                                                this.errors.splice(index, 1);
                                                            }
                                                            delete val_fields.values[this.one_ofs[e]]
                                                        }
                                                    }
                                                    let msg = this.titleCase(req.replace(/_/g,' ')) + " is required."
                                                    if(this.errors.includes(msg) == true){
                                                        let index = this.errors.indexOf(msg);
                                                        if (index > -1) {
                                                            //console.log('splicing out of errors 4',msg)
                                                            this.errors.splice(index, 1);
                                                        }
                                                    }
                                                    let conditional_spelled_out = this.titleCase(other_check_id.replace(/_/g,' '))
                                                    msg = this.titleCase(req.replace(/_/g,' ')) + " is required because " + conditional_spelled_out + ' is checked.'
                                                    if(this.errors.includes(msg) == false){
                                                        // console.log('pushing error 2 ',msg);
                                                        this.errors.push(msg);
                                                    }
                                                }
                                                conditional_found = true
                                                break
                                            }
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
                    this.$required = JSON.stringify(val_fields.values)
                    //console.log('has required from if other conditionals')
                    this.hasRequiredFields(this.values, JSON.parse(this.$required))
                }
                return conditional_found
            },
            // @vuese
            // Checks required values against required elements
            hasRequiredFields(VALS, REQ, field_specified, skip_rebuild){ 
                //console.log('has required?')
                let is_invalid = false
                let msg = ''
                //let is_conditional = false
                if(typeof field_specified == 'undefined'){
                    //console.log('errors being set to []')
                    this.errors = []
                }
                if(typeof VALS == 'string'){
                    VALS = JSON.parse(VALS)
                }
                for (let req in REQ ){
                    msg = this.titleCase(req.replace(/_/g,' ')) + " is required."
                    let req_type = $('#' + req).attr('type')
                    // Values object is empty
                    if (Object.keys(VALS).length === 0 || typeof VALS == 'undefined'){
                        //console.log(1,req)
                        is_invalid = true
                        let multi_key = req.split(',')
                        if (multi_key.length > 1){
                            msg = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(req.replace(/_/g,' ').replace(/,/g,', ')) + ')'
                        }
                        if(typeof field_specified == 'undefined'){
                            if(this.errors.includes(msg) == false){
                                //console.log('pushing error 3 ',msg)
                                this.errors.push(msg);}
                        }
                        this.applyErrorStyle(req, req_type)
                    // Some values have been recorded in the values object
                    } else {
                        for (let val in VALS){
                            let multi_key = req.split(',')
                            let get_enums = this.checkEnums(this.questions, req)
                            let has_yes_no = get_enums[0]
                            let has_enums = get_enums[1]
                            if (multi_key.length > 1){
                                // If key is multiple fields, then one of the fields must have a value
                                msg = 'One of the following fields must be checked or filled out:\n(' + this.titleCase(req.replace(/_/g,' ').replace(/,/g,', ')) + ')'
                                for (let k in multi_key){
                                    if(typeof field_specified !='undefined' && multi_key[k] !== field_specified){ continue }
                                    if(typeof skip_rebuild == 'undefined'){
                                        get_enums = this.checkEnums(this.questions, multi_key[k])
                                        has_yes_no = get_enums[0]
                                        has_enums = get_enums[1]
                                        if(has_yes_no){
                                            this.checkForEnumConditional(multi_key[k])
                                        } else if(!has_enums){
                                            this.checkForIfOtherConditional(multi_key[k])
                                        }
                                    }
                                    if ((val === multi_key[k] && VALS[val] == '') || !VALS[val] || !VALS[multi_key[k]]){
                                        is_invalid = true
                                        if(typeof field_specified == 'undefined'){
                                            if(this.errors.includes(msg) == false){
                                                //console.log('pushing error 4 ',msg)
                                                this.errors.push(msg);}
                                        }
                                        if(typeof skip_rebuild == 'undefined'){
                                            this.applyErrorStyle(req, req_type)
                                        }
                                    } else {
                                        if(typeof skip_rebuild == 'undefined'){
                                            this.applyErrorStyle(req, req_type, true)
                                        }
                                    }
                                }
                            } else if ((val === req && VALS[val] == '') || !VALS[req]){
                                if(typeof field_specified !='undefined' && req !== field_specified){ continue }
                                //console.log(3,req)
                                if(typeof skip_rebuild == 'undefined'){
                                    if(has_yes_no){
                                        this.checkForEnumConditional(req)
                                    } else if(!has_enums){
                                        this.checkForIfOtherConditional(req)
                                    }
                                }
                                is_invalid = true
                                if(typeof field_specified == 'undefined'){
                                    if(this.errors.includes(msg) == false){
                                        //console.log('pushing error 5 ',msg)
                                        this.errors.push(msg);}
                                }
                                if(typeof skip_rebuild == 'undefined'){
                                    this.applyErrorStyle(req, req_type)
                                }
                            } else {
                                if(typeof field_specified !='undefined' && req !== field_specified){ continue }
                                //console.log(4,req,skip_rebuild) //here for radios
                                if(typeof skip_rebuild == 'undefined'){
                                    if(has_yes_no){
                                        this.checkForEnumConditional(req)
                                    } else if(!has_enums){
                                        this.checkForIfOtherConditional(req)
                                    }
                                }
                                //console.log(is_conditional,req)
                                if(typeof skip_rebuild == 'undefined'){
                                    this.applyErrorStyle(req, req_type, true)
                                }
                            }
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
                // AJAX CALL HERE
                //console.log('DAAC being passed into fetchQuestions is ' + DAAC)
                var question = []
                var ignore_attributes = ['list','step','pattern','accept','autocomplete','autofocus','capture','dirname']
                $.getJSON( "../questions.json", ( questions ) => {
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
                                    var attrib_string = ' '
                                    if(typeof questions_section[q].inputs[input].attributes !='undefined'){
                                        // This builds a string of attributes to apply to the input
                                        for (var attr in questions_section[q].inputs[input].attributes){
                                            if(ignore_attributes.includes(attr)==false){
                                                attrib_string += attr + '="' + questions_section[q].inputs[input].attributes[attr] + '" '
                                            }
                                        }
                                    }
                                    questions_section[q]['attrib_string'] = attrib_string
                                    // console.log("'" + attrib_string + "'")
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
                    this.$emit('submitForm', window.localStorage.getItem(this.DAAC + '_questions'))
                }
            },
            // @vuese
            // Used to save file
            // TODO - API call will go here
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
            if(typeof this.$route != 'undefined' && typeof this.$route.params.default != 'undefined'){
              this.daac = this.$route.params.default
            } else if(window.localStorage.getItem('DAAC')!=null){
              this.daac = window.localStorage.getItem('DAAC')
            }
            if(typeof this.$route != 'undefined' && typeof this.$route.params.showDaacs != 'undefined'){
              this.showDaacs = this.$route.params.showDaacs
            } else if(window.localStorage.getItem('showDaacs')!=null){
              this.showDaacs = window.localStorage.getItem('showDaacs')
            }
            if(typeof window.headerComponent != 'undefined' && this.showDaacs =='false'){
                window.headerComponent.showDaacs = false
            }
            if(this.daac == null){
                this.$router.push({ name: 'Daacs', path: '/selection', default: 'selection' })
            }
            this.questions = this.fetchQuestions()
            this.setActiveNav('questions')
            let set_loc = location.href
            if(!set_loc.match(/questions/g)){
                set_loc += 'questions/'
            }
            if(set_loc.match(/selection/g)){
                this.warning = 'No daac has been selected'
            }
            this.setActiveLocationWithoutReload(set_loc, this.daac)
            if(typeof window.headerComponent != 'undefined'){
                window.headerComponent.daac = this.daac.replace(/ /g,'_').toLowerCase()
            }
        }
    }
</script>
<style scoped>
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
    h3{
        display:block;
        width:100%;
        text-decoration:underline;
    }
    .required{
        color:red!important;
        padding-top:7px
    }
    .help{
        padding-top:7px
    }
    label{
        margin-right: 1rem;
    }
    p{
        margin-bottom:unset;
    }
    h3{
        margin-top:1rem;
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
        padding-right:0px
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