<template>
  <b-form v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm">
    <b-container>
        <b-row v-for="(heading, a_key) in questions" :key="a_key">
            <h3>{{heading.heading}}</h3>
            <div id=questions>
                <b-form-group v-for="(question, b_key) in heading" 
                :class="{ 'form-group-error': ($v.data[question.id] || {}).$error }"
                :key="b_key" 
                size="lg"
                :disabled="readonly"
                :lg="question.width || 12">
                    <label :for="question.id" >{{question.title}}:</label>
                    <p :id="question.id || a_key">{{question.text}}</p>
                    <b-row v-for="(input, c_key) in question.inputs" :key="c_key">
                        <label :for="input.id || input + '_' + c_key">{{input.label}}: </label>
                        <span class="required" v-if="input.required == true">* required</span>
                        <b-form-input 
                            :type="input.type" 
                            :id="input.id" 
                            :name="input.id" 
                            v-model="values[input.id]"
                            size="lg"
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
                        <b-form-checkbox 
                            :type="input.type" 
                            :id="input.id" 
                            :name="input.id" 
                            v-model="values[input.id]"
                            size="lg"
                            :disabled="readonly"
                            value="true"
                            unchecked-value="false"
                            v-else-if="input.type == 'checkbox'"
                            input.attrib_string>
                        </b-form-checkbox>
                        <b-form-textarea 
                            :type="input.type" 
                            :id="input.id" 
                            :name="input.id" 
                            v-model="values[input.id]"
                            size="lg"
                            :disabled="readonly"
                            v-else-if="input.type == 'textarea'" 
                            input.attrib_string>
                        </b-form-textarea>
                        <b-form-radio-group
                            :type="input.type" 
                            :id="input.id" 
                            :name="input.id" 
                            v-model="values[input.id]"
                            size="lg"
                            value="true"
                            unchecked-value="false"
                            :disabled="readonly"
                            v-else-if="input.type == 'radio'" 
                            :options="input.options"
                            input.attrib_string>
                        </b-form-radio-group>
                        <b-form-select
                            :type="input.type" 
                            :id="input.id" 
                            :name="input.id" 
                            v-model="values[input.id]"
                            size="lg"
                            :disabled="readonly"
                            v-else-if="input.type == 'select'" 
                            :options="input.options"
                            input.attrib_string>
                        </b-form-select>
                        <b-form-file
                            :type="input.type" 
                            :state="Boolean(values[input.id])"
                            :id="input.id" 
                            :name="input.id" 
                            v-model="values[input.id]" 
                            size="lg"
                            :disabled="readonly"
                            v-else-if="input.type == 'file'" 
                            input.attrib_string>
                        </b-form-file>
                        <div class="mt-3" v-if="input.type == 'file'">Selected file: {{ values[input.id] ? values[input.id].name : '' }}</div>
                    </b-row>
                </b-form-group>
            </div>
        </b-row>
    </b-container>
    <div align=right style="text-align:right;float:right" v-if="!readonly">
        <b-button class="button" @click="submitForm">
            {{ submitLabel }}
        </b-button>
        <b-button class="button" type="reset" v-if="showResetButton">{{ resetLabel }}</b-button>
    </div>
  </b-form>
</template>
<script>
    import { required } from 'vuelidate/lib/validators'
    import $ from 'jquery'

    export default {
        name: 'Questions',
        data() {
            return {
                values: {},
                questions: this.fetchQuestions(),
                dirty:false
            }
        },
        props: {
            data: {},
            resetLabel: { default: 'Reset', type: String },
            submitLabel: { default: 'Submit', type: String },
            enterSubmit: { default: false, type: Boolean }, 
            readonly: { default: false, type: Boolean },
            showResetButton: { default: true, type: Boolean }
        },
        computed: {

        },
        validations() {
            console.log('Validating ...')
            let val_fields = {
                data: {}
            }
            var obj
            if(typeof this.questions.inputs !='undefined'){
                obj = this.questions.inputs
            } else if (typeof this.questions !='undefined'){
                obj = this.questions
            }
            for (let row of obj) {
                for (let field of row) {
                    if (typeof field.required != 'undefined' && field.required) {
                        val_fields.data[field.id] = {
                            required
                        }
                    }
                }
            }
            return val_fields
        },
        methods: {
            fetchQuestions(){
                var question = []
                var ignore_attributes = ['list','step','pattern','accept','autocomplete','autofocus','capture','dirname']
                $.getJSON( "questions.json", function( questions ) {
                    for(var section in questions['sections']) {
                        var heading = questions['sections'][section]['heading']
                        var questions_section = questions['sections'][section]['questions']
                        questions_section['heading'] = heading
                        for (var q in questions_section){
                            if(typeof questions_section[q].inputs != 'undefined'){
                                for(var input in questions_section[q].inputs){
                                    var attrib_string = ' '
                                    if(typeof questions_section[q].inputs[input].attributes !='undefined'){
                                        for (var attr in questions_section[q].inputs[input].attributes){
                                            if(ignore_attributes.includes(attr)==false){
                                                attrib_string += ':' + attr + '="' + questions_section[q].inputs[input].attributes[attr] + '" '
                                            }
                                        }
                                    }
                                    questions_section[q]['attrib_string'] = attrib_string
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
            status(validation) {
                return {
                    error: validation.$error,
                    dirty: validation.$dirty
                }
            },
            enterSubmitForm(evt) {
                evt.preventDefault()
                if (this.enterSubmit) {
                    this.submitForm()
                }
            },
            submitForm() {
                this.$v.$touch()
                if (this.$v.$invalid) {
                    alert('Please correct the errors on the form before saving.')
                } else {
                    this.$emit('submitForm', this.data)
                }
            },
            resetForm() {
                this.$emit('resetForm')
            }
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
       margin-right:1rem;
       margin-bottom:1rem;
    }
</style>