<template>
  <!-- Form -->
  <b-form name="questions_form" v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm" @cancel="cancelForm">
    <!-- Console Options -->
    <b-container v-if="!readonly" name="console_container" class="console_container">
        <div v-if="!readonly" class="console_bar">
            <b-button class="button" type="redo" id="redo_button" v-bind:title="redoLabel" v-if="canRedo" @click="redoToPreviousState()">
                <font-awesome-icon v-bind:icon="redoLabel">{{ redoLabel }}</font-awesome-icon>
            </b-button>
            <b-button class="button" type="redo" id="redo_button" v-bind:title="redoLabel" v-else disabled>
                <font-awesome-icon v-bind:icon="redoLabel">{{ redoLabel }}</font-awesome-icon>
            </b-button>
            <b-button class="button" type="undo" id="undo_button" v-bind:title="undoLabel" v-if="canUndo" @click="undoToPreviousState()">
                <font-awesome-icon v-bind:icon="undoLabel">{{ undoLabel }}</font-awesome-icon>
            </b-button>
            <b-button class="button" type="undo" id="undo_button" v-bind:title="undoLabel" v-else disabled>
                <font-awesome-icon v-bind:icon="undoLabel">{{ undoLabel }}</font-awesome-icon>
            </b-button>
        </div>
    </b-container>
    <!-- End of Concole Options -->
    <b-container name="questions_container">
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
                        <!--<b-col class="w-50 help">
                            <a href="#" v-if="question.help != ''" @click:=getHelp(question.id)>Help</a>
                            <div class="hidden overlay">{{question.help}}</div>
                        </b-col>-->
                        <!-- Input -->
                        <b-row v-for="(input, c_key) in question.inputs" :key="c_key">
                            <label :for="input.id || input + '_' + c_key">{{input.label}}: </label>
                            <span class="required" v-if="input.required == true">* required</span>
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
                            <span id:="input.id + '.required_checkbox' + " class="required" v-if="input.required == true && input.type == 'checkbox'">* required </span>
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
                                v-else-if="input.type == 'checkbox'"
                                input.attrib_string
                                stacked >
                            </b-form-checkbox>
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
                                input.attrib_string
                                stacked >
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
                        </b-row>
                        <!-- End of Input -->
                    </b-form-group>
                    <!-- End of Question -->
                </div>
            </b-row>
        </section>
        <!-- End of Section -->
    </b-container>
    <!-- Button Options -->
    <b-container v-if="!readonly" name="buttons_container">
        <div v-if="!readonly" class="button_bar">
            <b-button class="button eui-btn--red" type="cancel" id="cancel_data" v-if="showCancelButton">{{ cancelLabel }}</b-button>
            <b-button class="button eui-btn--green" type="submit" id="submit_data" @click=submitForm>{{ submitLabel }}</b-button>
            <b-button class="button eui-btn--blue" type="draft" id="draft_data" @click=draftFile(true)>{{ draftLabel }}</b-button>
            <b-button class="button eui-btn--blue" type="save" id="save_data" @click=saveFile(true)>{{ saveLabel }}</b-button>
            <b-button class="button eui-btn--red" type="reset" id="reset_data" v-if="showResetButton">{{ resetLabel }}</b-button>
        </div>
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

    // This questions component gets the questions data for the selected daac and
    // sets the above template properties, methods, and custom validation used.
    export default {
        name: 'Questions',
        mixins: [mixin],
        data() {
            return {
                values: {},
                questions: {},
                dirty:false,
                formTitle: '',
                saveTimeout: 0,
                daac:'',
                warning:''
            }
        },
        props: {
            // The cancel label and type
            cancelLabel: { default: 'Cancel', type: String },
            // The reset label and type
            resetLabel: { default: 'Reset', type: String },
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
            showCancelButton: { default: true, type: Boolean },
            // The show reset button conditional to allow for reset
            showResetButton: { default: false, type: Boolean }
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
                    }, 250);
                },
                deep: true
            }
        },
        created () {
            
        },
        components: {

        },
        validations() {
            //console.log('Validations ...')
            // Evaluates required fields and alerts if any are empty
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
                    // If the group is required, assume each input within is required
                    if (typeof question.required != 'undefined' && question.required) {
                        if (typeof question.inputs != 'undefined'){
                            for (let fld of question.inputs){
                                val_fields.values[fld.id] = {
                                    required
                                }
                            }
                        } else {
                            val_fields.values[question.id] = {
                                required
                            }
                        }
                    // If the required attribute is not at the group level, investigates under input level
                    } else if (typeof question.inputs != 'undefined'){
                        for (let fld of question.inputs){
                            if (typeof fld.required != 'undefined' && fld.required) {
                                val_fields.values[fld.id] = {
                                    required
                                }
                            }
                        }
                    }
                }
            }
            let DAAC_SET = window.localStorage.getItem('DAAC')
            if(DAAC_SET !== null){
                //window.localStorage.setItem(DAAC_SET + '_questions', JSON.stringify(val_fields.values))
                this.$required = JSON.stringify(val_fields.values)
            }
            return val_fields
        },
        methods: {
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
                                                attrib_string += ':' + attr + '="' + questions_section[q].inputs[input].attributes[attr] + '" '
                                            }
                                        }
                                    }
                                    questions_section[q]['attrib_string'] = attrib_string
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
                //console.log('Getting status ...')
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
            submitForm() {
                // Submit form (this.data) if valid
                //console.log('Executing Submit ...')
                this.$v.$touch()
                this.safeFile()
                //this.validations()
                if (this.$v.$invalid) {
                    //TODO
                    //var required_ids_to_check = JSON.parse(window.localStorage.getItem(this.DAAC + '_required'))
                    //console.log(required_ids_to_check)
                    //for(var r in required_ids_to_check){
                        //console.log(required_ids_to_check[r])
                    //}
                    //alert('Please correct the errors on the form before saving.')
                } else {
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
                if(this.daac == null){
                    var DAAC = window.localStorage.getItem('DAAC')
                }
                if(DAAC !== null && data !== JSON.stringify({})){
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
                }
                if(with_msg){
                    alert('Your data has been saved. Click submit to send the data.')
                }
            },
            // @vuese
            // Save as draft and exit form
            draftFile(with_msg) {
                this.saveFile(with_msg)
                this.exitForm()
            },
            // @vuese
            // Cancel and exit form
            cancelForm() {
                //console.log('Canceling form ...')
                // Cancels form and exits to home
                this.exitForm()
            },
            // @vuese
            // Clear and reset form
            resetForm() {
                //console.log('Resetting form ...')
                // Resets form to blank entries
                this.$emit('resetForm')
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
       margin:1rem;
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
    fieldset {
        border-left: unset
    }
    .button_bar {
        /* float:right */
    }
    .button_bar .button {
        float:right
    }
    .button_bar .button:first-of-type {
        float:left
    }
    .console_container {
        height: 1em;
    }
    .console_bar {
        float:right
    }
</style>