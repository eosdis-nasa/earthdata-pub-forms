<template>
  <!-- Form -->
  <b-form v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm">
    <b-container>
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
                            <a href="javascript:void(0);" v-if="question.help != ''" @click:=getHelp(question.id)>Help</a>
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
                                input.attrib_string>
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
    <div align=right v-if="!readonly" class="button_bar">
        <b-button class="button" type="redo" v-if="canRedo" @click="redoToPreviousState()">{{ redoLabel }}</b-button>
        <b-button class="button" type="redo" v-else disabled>{{ redoLabel }}</b-button>
        <b-button class="button" type="undo" v-if="canUndo" @click="undoToPreviousState()">{{ undoLabel }}</b-button>
        <b-button class="button" type="undo" v-else disabled>{{ undoLabel }}</b-button>
        <b-button class="button" type="save" @click=saveFile(true)>{{ saveLabel }}</b-button>
        <b-button class="button" type="submit" @click=submitForm>{{ submitLabel }}</b-button>
        <b-button class="button" type="reset" v-if="showResetButton">{{ resetLabel }}</b-button>
    </div>
    <!-- End of Button Options -->
  </b-form>
  <!-- End of Form -->
</template>
<script>
    // Basic html5 validation 
    import { required } from 'vuelidate/lib/validators'
    // Jquery javascript
    import $ from 'jquery'

    // This questions component gets the questions data for the selected daac and
    // sets the above template properties, methods, and custom validation used.
    export default {
        name: 'Questions',
        data() {
            return {
                values: {},
                questions: {},
                dirty:false,
                formTitle: '',
                saveTimeout: 0,
                daac:''
            }
        },
        props: {
            // The reset label and type
            resetLabel: { default: 'Reset', type: String },
            // The save label and type
            saveLabel: { default: 'Save', type: String },
            // The undo label and type
            undoLabel: { default: 'Undo', type: String },
            // The redo label and type
            redoLabel: { default: 'Redo', type: String },
            // The submit label and type
            submitLabel: { default: 'Submit', type: String },
            // The enter submit conditional to allow for submittal
            enterSubmit: { default: false, type: Boolean }, 
            // The readonly attribute to pass in
            readonly: { default: false, type: Boolean },
            // The show reset button conditional to allow for reset
            showResetButton: { default: true, type: Boolean }
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
                this.daac = DAAC_SET
                window.localStorage.setItem(DAAC_SET + '_questions', JSON.stringify(val_fields.values))
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
                    var head = document.head;
                    var link = document.createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    $(link).attr('data-eui', 'yes');
                    link.href = 'https://cdn.earthdata.nasa.gov/eui/1.1.7/stylesheets/application.css';
                    head.appendChild(link);
                    if (questions.style){
                        head = document.head;
                        link = document.createElement("link");
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
                    window.localStorage.setItem(DAAC + '_questions', data);
                }
                if(with_msg){
                    alert('Your data has been saved.  Click submit to send the data.')
                }
            },
            // @vuese
            // Clear and reset form
            resetForm() {
                //console.log('Resetting form ...')
                // Resets form to blank entries
                this.$emit('resetForm')
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
            this.showDaacs = window.localStorage.getItem('showDaacs')
            this.daac = window.localStorage.getItem('DAAC')
            this.questions = this.fetchQuestions()
            this.setActiveNav('questions')
            let set_loc = location.href
            if(!set_loc.match(/questions/g)){
                set_loc += 'questions/'
            }
            this.setActiveLocationWithoutReload(set_loc, this.daac)
            window.headerComponent.daac = this.daac.replace(/ /g,'_').toUpperCase()
        }
    }
</script>
<style scoped>
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
        background:#dedede;
        border-top:1px solid #dfdfdf
    }
</style>