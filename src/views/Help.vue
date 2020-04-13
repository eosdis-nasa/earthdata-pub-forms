<template>
  <!-- Form -->
  <b-form v-on:submit.stop.prevent>
    <b-container>
        <div>
            <b-form-group v-for="(help_tip, index) in help_tips" :key=index>
                <!-- Help Card -->
                <b-card :id=help_tip.help_id :aria-hidden="show">
                    <label for:=help_tip.help>{{help_tip.label}}</label>
                    <b-card-text>{{help_tip.help}}</b-card-text>
                </b-card>
                <!-- End of Help Card -->
            </b-form-group>
        </div>
    </b-container>
  </b-form>
  <!-- End of Form -->
</template>
<script>
    // Jquery javascript
    import $ from 'jquery'

    // This help component displays all the help in the questions.json
    // It sets the above template properties and methods. Takes an optional help.id
    export default {
        name: 'Help',
        data() {
            return {
                show:true,
                selected: '',
                help_tips: {}
            }
        },
        computed: {

        },
        validations() {

        },
        methods: {
            // Loops through the questions.json and builds a help object from that.
            // If a id is passed in, it just displays 'Help Tip'
            fetchHelp(help_id){
                var help_tips = []
                $.getJSON( "questions.json", function( questions ) {
                    for(var section in questions['sections']) {
                        var questions_section = questions['sections'][section]['questions']
                        for(var q in questions_section){
                            var question_id = questions_section[q]['id']
                            var title = questions_section[q]['title']
                            if(help_id != null && question_id != help_id){ continue }
                            var help = questions_section[q]['help']
                            var help_json = {
                                'help_id':question_id,
                                'help':help
                            }
                            var label;
                            if (help_id == null){
                                label = title
                            } else {
                                label = 'Help Tip'
                            }
                            help_json['label'] = label
                            help_tips.push(help_json)
                        }
                    }
                })
                return help_tips
            }
        },
        // This is equivalent to document.ready
        mounted() {
            var help_id = window.localStorage.getItem('help_id')
            this.help_tips = this.fetchHelp(help_id)
        },
    }
</script>
<style scoped>
    .card-title {
        font-weight:bold;
    }
    .card{
        border-radius:unset;
        width:unset;
    }
    .card-body {
        display:unset
    }
</style>