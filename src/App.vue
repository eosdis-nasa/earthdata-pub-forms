<template>
  <!-- Main App -->
  <div id="app">
    <Header :formTitle="formTitle"/>
    <router-view ref="content"/>
  </div>
</template>
<!-- End of Main App -->
<script>
    // Imports header and footer as components.  
    // Vue files that are not routes should go in components.
    // Add this to know how to import as such
    import Header from '@/components/Header'
    
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
            Header
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
                    this.$router.push({ name: 'Home', default: window.localStorage.getItem('DAAC') })
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
    .form-group {
        margin-top:2rem;
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
    div.row{
        margin:0rem;
        display:unset;
    }
    .checkboxes {
        display:-webkit-box;
        display:inline-flex!important;
    }
    input[type=radio   ]:not(old) + label{
        cursor: pointer;
    }
    label {
        margin-top: 0.5rem;
    }
    .custom-file-label,.custom-file-input ~ .custom-file-label[data-browse]::after {
        height:unset;
    }
</style>
