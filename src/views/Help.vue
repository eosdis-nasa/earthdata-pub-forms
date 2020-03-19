<template>
  <b-form v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm">
    <b-container>
        <div>
            <b-form-group v-for="(help_tip, index) in help_tips" :key=index>
                <b-card :id=help_tip.id title="Help Tip" :aria-hidden="show">
                    <b-card-text>{{help_tip.help}}</b-card-text>
                </b-card>
            </b-form-group>
        </div>
    </b-container>
  </b-form>
</template>
<script>
    import $ from 'jquery'

    export default {
        name: 'Help',
        data() {
            return {
                show:true,
                selected: '',
                help_tips: this.fetchHelp()
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
            fetchHelp(){
                var help_tips = []
                $.getJSON( "questions.json", function( questions ) {
                    for(var section in questions['sections']) {
                        var questions_section = questions['sections'][section]['questions']
                        for(var q in questions_section){
                            var question_id = questions_section[q]['id']
                            var help = questions_section[q]['help']
                            help_tips.push({
                                'id':question_id,
                                'help':help
                            })
                        }
                    }
                })
                return help_tips
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
    .card-title {
        font-weight:bold;
    }
    .card{
        border-radius:unset!important
    }
</style>