<template>
    <b-container>
    </b-container>
</template>
<script>
    // This home component provides a means to redirect depending if there is a selected daac or not
    //
    // Possible:
    //
    // http://localhost:8080/daacs, http://localhost:8080/daacs/selection, http://localhost:8080/daacs/ornl_daac
    // http://localhost:8080, http://localhost:8080/daacs/selection, http://localhost:8080/questions/ornl_daac
    export default {
        name: 'Home',
        data() {
            return {
                
            }
        },
        computed: {
            
        },
        props: {
            // Based on the below property will load with/without Daacs form
            showDaacs: {default: true, type: Boolean}
        },
        // This is equivalent to document.ready
        mounted() {
            let parameters = this.$route.query
            var redirect = ''
            if(parameters['showDaacs']==true || this.showDaacs || window.localStorage.getItem('showDaacs')){
                window.localStorage.setItem('showDaacs',true)
                redirect="/daacs"
            } else {
                window.localStorage.setItem('showDaacs',false)
                redirect="/questions"  
            }
            if(typeof parameters['default'] != 'undefined'){
                // Expecting daac short_name here
                redirect+='/' + parameters['default']
            } else if(window.localStorage.getItem('DAAC')!=null){
                redirect+='/' + window.localStorage.getItem('DAAC')
            } else {
                redirect='/daacs/selection'
            }
            location.href = redirect.toLowerCase()
        }
    }
</script>