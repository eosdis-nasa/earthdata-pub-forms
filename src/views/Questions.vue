<template>
  <b-form v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm">
    <b-container>
        <b-row v-for="(heading, a_key) in questions" :key="a_key">
            <h3>{{heading.heading}}</h3>
            <div id=questions>
                <b-form-group v-for="(question, b_key) in heading" :key="b_key">
                    <label :for="question.id">{{question.title}}:</label>
                    <p :id="question.id">{{question.text}}</p>
                    <b-row v-for="(input, c_key) in question.inputs" :key="c_key">
                        <label :for="input.id">{{input.label}}: </label>
                        <div style="color:red;text-align:right" v-if="input.required == true">* required</div>
                        <b-form-input :type="input.type" :id="input.id" :name="input.id" v-if="input.type == 'text' || input.type == 'password' || input.type == 'number' || input.type == 'url' || input.type == 'email' || input.type == 'search' || input.type == 'range' || input.type == 'date' || input.type == 'tel' || input.type == 'time' || input.type == 'color'"></b-form-input>
                        <b-form-checkbox v-model="selected_checkboxes" :type="input.type" :id="input.id" :name="input.id" v-else-if="input.type == 'checkbox'"></b-form-checkbox>
                    </b-row>
                </b-form-group>
            </div>
        </b-row>
    </b-container>
  </b-form>
</template>
<script>
    import $ from 'jquery'

    export default {
        name: 'Questions',
        data() {
            return {
                selected_options:[],
                selected_radios:[],
                selected_checkboxes: [],
                questions: this.fetchQuestions(),
                dirty:false
            }
        },
        props: {
            resetLabel: { default: 'Reset', type: String },
            submitLabel: { default: 'Submit', type: String }
        },
        computed: {},
        validations() {
        },
        methods: {
            fetchQuestions(){
                var question = []
                $.getJSON( "questions.json", function( questions ) {
                    for(var section in questions['sections']) {
                        var heading = questions['sections'][section]['heading']
                        var questions_section = questions['sections'][section]['questions']
                        questions_section['heading'] = heading
                        question.push(questions_section)
                    }
                })
                return question
            },
            setSelectedValues(url, short_name, description){
                var text = "For more information on <b>" + short_name + "</b>, visit <a href=\"" + url + "\">" + short_name + '\'s website</a>.'
                $('#selected_url').html(text)
                $('#selected_description').html(description)
            },
            enterSubmitForm(evt) {
                evt.preventDefault()
                if (this.enterSubmit) {
                    this.submitForm()
                }
            },
            submitForm() {
                this.fixBooleans()
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
    .custom-radio{
        padding-bottom:1.5rem;
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
</style>