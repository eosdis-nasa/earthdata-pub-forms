<template>
<div role="main">
  <!-- Form -->
  <b-form name="help_form" v-on:submit.stop.prevent>
    <b-container name="help_container">
        <div>
            <b-form-group v-for="(help_tip, index) in help_tips" :key=index>
                <!-- Help Card -->
                <b-card :id=help_tip.help_id >
                    <label for:=help_tip.help>{{help_tip.label}}</label>
                    <b-card-text>{{help_tip.help}}</b-card-text>
                </b-card>
                <!-- End of Help Card -->
            </b-form-group>
        </div>
    </b-container>
  </b-form>
  <!-- End of Form -->
</div>
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
                selected: '',
                help_tips: [],
                formId: '',
                requestId: '',
                group:''
            }
        },
        computed: {

        },
        validations() {

        },
        watch: {
            help_tips: function() {
                setTimeout(() => {
                    this.setActiveNav('help')
                }, 1)
            }
        },
        methods: {
            // @vuese
            // Fetches help tips or individual tip. Loops through questions.json and builds
            // help object from that.
            // @help_id - the id to the question's specific help for individual lookup
            fetchHelp(help_id){
                var help_tips = []
                $.ajaxSetup({
                    headers : {
                        'Authorization' : `Bearer ${localStorage.getItem('auth-token')}`,
                    }
                });
                // TODO - TESTING ONLY /////////////////////////////////////////////////////////////////////////////////////
                let form = this.getForm();
                let json_name = ''
                if(form.match(/interest/g)){
                    json_name = 'data_publication_request' 
                } else {
                    json_name = 'data_product_information' 
                }
                $.getJSON( `../${form}/${json_name}.json`, ( questions ) => {
                // TODO - TESTING ONLY /////////////////////////////////////////////////////////////////////////////////////
                    for(var section in questions['sections']) {
                        var questions_section = questions['sections'][section]['questions']
                        for(var q in questions_section){
                            var question_id = questions_section[q]['id']
                            var title = questions_section[q]['title']
                            if(typeof help_id != 'undefined' && help_id != null && question_id != help_id){ continue }
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
            window.helpComponent = this;
            this.setActiveNav("help");
            let loc;
            let daacStored;
            if(typeof this.$store !== 'undefined' && this.$store.state.global_params['group']){
                daacStored = this.$store.state.global_params['group']
            }
            if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['formId'] != 'undefined'){
                this.formId = this.$store.state.global_params['formId']
            }
            if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['requestId'] != 'undefined'){
                this.requestId = this.$store.state.global_params['requestId']
            }
            if(daacStored !=null && typeof this.$route != 'undefined'){
                let re = new RegExp(`/${daacStored}`)
                if(window.location.href.match(re,'g')){
                    loc = window.location.href
                    loc = loc.replace(re,'')
                }
            } else {
                loc = window.location.href
            }
            this.help_tips = this.fetchHelp()
            if (typeof loc != 'undefined'){
                history.replaceState('updating href', window.document.title, loc.replace(/\/selection/g, ''))
            }
        }
    }
</script>
<style scoped>
    .card-title {
        font-weight:bold;
    }
    .card{
        border-radius:unset;
        width:unset;
        margin-bottom:1rem;
    }
    .card-body {
        display:unset
    }
    div.card-body:nth-of-type(odd) {
        background: rgb(235, 235, 235);
    }
    .form-group:first-of-type{
        margin-top:2rem;
    }
</style>