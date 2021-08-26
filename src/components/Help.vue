<template>
<div role="main">
  <!-- Form -->
  <b-form name="help_form" v-on:submit.stop.prevent>
    <b-container name="help_container">
        <div>
            <b-form-group v-for="(help_tip, index) in help_tips" :key=index>
                <!-- Help Card -->
                <b-card :id=help_tip.help_id>
                    <label for:=help_tip.help>{{help_tip.label}}</label> - {{help_tip.text}}
                    <b-card-text><font-awesome-icon icon="info-circle" name="info icon"/> {{help_tip.help}}</b-card-text>
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
                $.ajaxSetup({
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                    },
                });
                let url;
                let form = this.getForm();
                let json_name = ''
                if(form.match(/interest/g)){
                    json_name = 'data_publication_request' 
                } else {
                    json_name = 'data_product_information' 
                }
                if (this.$testing){
                    url = `../../${json_name}.json`
                } else {
                    url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORMS_URL}?order=desc`
                }
                $.getJSON(url, (forms) => {
                    let form = this.getForm();
                    if (
                        typeof this.$store !== 'undefined' && 
                        this.$store.state.global_params['formId'] == "" &&
                        (this.$store.state.global_params['group'] !== "selection" || this.$store.state.global_params['group'] != "")
                    ) {
                        for (let f in forms) {
                            if (
                                form.toLowerCase().match(/interest/g) &&
                                typeof forms[f].short_name != "undefined" &&
                                forms[f].short_name
                                .toLowerCase()
                                .match(/data_publication_request/g)
                            ) {
                                this.$store.state.global_params['formId'] = forms[f]["id"];
                                this.formTitle = forms[f]["long_name"];
                                break;
                            } else if (
                                form.toLowerCase().match(/questionnaire/g) &&
                                typeof forms[f].short_name != "undefined" &&
                                forms[f].short_name
                                .toLowerCase()
                                .match(/data_product_information/g)
                            ) {
                                this.$store.state.global_params['formId'] = forms[f]["id"];
                                this.formTitle = forms[f]["long_name"];
                                break;
                            }
                        }
                    }
                    if(!this.$testing && typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "") {
                        url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORM_URL}/${this.$store.state.global_params['formId']}`;
                    }
                    $.getJSON(url, (questions) => {
                        for(var section in questions['sections']) {
                            var questions_section = questions['sections'][section]['questions']
                            for(var q in questions_section){
                                var question_id = questions_section[q]['id']
                                var title = questions_section[q]['long_name']
                                var text = questions_section[q]['text']
                                var help = questions_section[q]['help']
                                if(typeof help_id != 'undefined' && help_id != null && question_id != help_id){ continue }
                                if (typeof help == 'undefined' || help == 'undefined' || help == ''){ 
                                    continue;
                                }
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
                                help_json['text'] = text
                                this.help_tips.push(help_json)
                            }
                        }
                    })
                    return this.help_tips
                })
                return this.help_tips
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