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
            window.homeComponent = this;
            this.resetRoute()
        }
    }
</script>