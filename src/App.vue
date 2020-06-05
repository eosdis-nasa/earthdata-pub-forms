<template>
  <!-- Main App -->
  <div id="app">
    <Header :formTitle="formTitle"/>
    <router-view ref="content"/>
     <go-top bg-color="#ebebeb" fg-color="#323232" :has-outline="true" radius=3%></go-top>
  </div>
</template>
<!-- End of Main App -->
<script>
    // Imports header and footer as components. 
    // Vue files that are not routes should go in components.
    // Add this to know how to import as such
    import Header from '@/components/Header'
    import GoTop from '@inotom/vue-go-top';
    // This questions component gets the questions data for the selected daac and
    // sets the above template properties, methods, and custom validation used.
    export default {
        name: 'app',
        data() {
            return {
                formTitle: '',
            }
        },
        props:{
            

        },
        components: {
            Header,
            GoTop
        },
        mounted() {
            if(typeof this.$refs.content !='undefined'){
                this.$watch(
                    () => {
                        return this.$refs.content.formTitle
                    },
                    val => {
                        this.formTitle = val
                    }
                )
                this.formTitle = this.$refs.content.formTitle
            } else {
                if(typeof this.$refs.content =='undefined' && window.localStorage.getItem('DAAC')!=null){
                    this.$router.push({ name: 'Home', default: window.localStorage.getItem('DAAC').toLowerCase() })
                } else {
                    this.$router.push({ name: 'Daacs', path: '/selection', default: 'selection' })
                }
            }
        },
        watch: {
            
        },
        methods: {
            
        }
    }
</script>
<style>
    body{
        background:unset!important;
    }
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
    }
    .selector-for-some-widget {
        box-sizing: content-box;
    }
    .bv-no-focus-ring .row label:nth-last-child {
        margin-top:calc(1.5em + 1rem + 2px) + 1rem;
    }
    .form-group {
        margin-top:2rem;
        margin-bottom: 1.75rem!important;
    }
    #nav {
        padding: 5px;
        text-align:right;
    }
    #nav a {
        color:white;
    }
    #nav a.router-link-exact-active {
        font-weight: bold;
    }
    label{
        font-weight:bold;
    }
    .b-custom-control-lg.custom-file, .b-custom-control-lg .custom-file-input, .b-custom-control-lg .custom-file-label, .input-group-lg.custom-file, .input-group-lg .custom-file-input, .input-group-lg .custom-file-label {
        margin-bottom: 1.25rem;
    }
    div.row{
        margin:0rem;
        display:unset;
    }
    .custom-radio.b-custom-control-lg, .input-group-lg .custom-radio {
        font-size: unset!important;
    }
    .custom-checkbox.b-custom-control-lg, .input-group-lg .custom-checkbox {
        min-height: 1.75rem!important;
    }
    .checkboxes {
        display:-webkit-box;
        display:inline-flex!important;
    }
    input[type=radio   ]:not(old) + label{
        cursor: pointer;
        padding-top: 4px;
    }
    label {
        margin-top: 0.5rem;
    }
    .custom-file-label,.custom-file-input ~ .custom-file-label[data-browse]::after {
        height:unset;
    }
    .row:first-child h3:first-child{
        /*padding-top:5rem!important;*/
    }
</style>
