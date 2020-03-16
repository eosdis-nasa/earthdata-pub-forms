<template>
  <b-form v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm">
    <b-container>
        <div>
            <ul>
                <li v-for="(heading, index) in questions" :key=index>
                    <h3>{{heading.heading}}</h3>
                </li>
            </ul>
        </div>
    </b-container>
  </b-form>
</template>
<script>
    import $ from 'jquery'

    export default {
        name: 'Questions',
        data() {
            return {
                selected: '',
                questions: this.fetchQuestions()
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
                console.log(question)
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
<style>
    .col-form-label {
        font-weight:bold;
    }
    .mt-3 {
        text-align: left;
    }
    strong {
        margin-left:2rem;
    }
    .bv-no-focus-ring {
        text-align:left;
        margin-left:2rem;
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
</style>