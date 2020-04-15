<template>
    <b-container>
    </b-container>
</template>
<script>
    // This home component provides a means to redirect if no Daacs to be shown
    export default {
        name: 'Home',
        data() {
            return {
                
            }
        },
        props: {
            // Based on the below property will load with/without Daacs form
            showDaacs: {default: true, type: Boolean}
        },
        // This is equivalent to document.ready
        mounted() {
            if(this.showDaacs){
                window.localStorage.setItem('showDaacs',true)
                location.href="/daacs"
            } else {
                window.localStorage.setItem('showDaacs',false)
                location.href="/questions"
            }
        }
    }
</script>