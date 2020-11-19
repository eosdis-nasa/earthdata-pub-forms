<template>
    <b-container>
    </b-container>
</template>
<script>
    // This home component provides a means to redirect depending if there is a selected daac or not
    //
    // Possible:
    //
    // http://localhost:8080/interest/daacs, http://localhost:8080/interest/daacs/selection, http://localhost:8080/interest/daacs/ornl_daac
    // http://localhost:8080/interest/questions/ornl_daac, http://localhost:8080/interest/help
    // http://localhost:8080/questionnaire/questions, http://localhost:8080/questionnaire/help
    export default {
        name: 'Home',
        data() {
            return {
                
            }
        },
        computed: {
            
        },
        props: {
            
        },
        // This is equivalent to document.ready
        mounted() {
            console.log('HOME MOUNTED')
            window.homeComponent = this;
            this.setShowDaacs()
            let redirect = '';
            let form = this.getPath()[0]
            
            // Set form path
            if(window.headerComponent.showDaacs){
                redirect=`/${form}/daacs`
            } else {
                redirect=`/${form}/questions`
            }
            // Append daac to path if applicable
            if(typeof this.$route != 'undefined' && typeof this.$route.query.parameters != 'undefined' && typeof this.$route.query.parameters.default != 'undefined'){
                // Expecting daac short_name here
                redirect+=`/${this.$route.query.parameters.default.toLowerCase()}`
            } else if(window.localStorage.getItem('DAAC')!=null && form.toLowerCase().match(/interest/g)){
                redirect+=`/${window.localStorage.getItem('DAAC').toLowerCase()}`
            } else if (!form.toLowerCase().match(/questionnaire/g)){
                redirect=`/${form}/daacs/selection`
            } else {
                redirect=`/${form}/questions`
            }
            console.log(window.location.href,redirect)
            window.location.href = redirect.toLowerCase()
        }
    }
</script>