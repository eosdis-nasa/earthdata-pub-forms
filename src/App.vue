<template>
  <!-- Main App -->
  <div id="app">
    <Header :formTitle="showFormTitle"/>
    <router-view ref="content"/>
     <go-top bg-color="#ebebeb" fg-color="#323232" :has-outline="true" radius=3% aria-label="go to top button"></go-top>
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
        metaInfo: {
            title: 'Default App Title',
            titleTemplate: '%s | vue-meta Example App',
            htmlAttrs: {
                reptilian: 'gator'
            },
            headAttrs: {
                nest: 'eggs'
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'description', content: 'gator' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ]
        },
        computed:{
            showFormTitle: function(){
                return window.formTitle
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
                        window.formTitle = val
                    }
                )
                window.formTitle = this.$refs.content.formTitle
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
    a, a:visited, a span {
        color:#2275AA;
    }
    .selector-for-some-widget {
        box-sizing: content-box;
    }
    .bv-no-focus-ring .row label:nth-last-child {
        margin-top:calc(1.5em + 1rem + 2px) + 1rem;
    }
    .form-group {
        margin-top:.5rem;
    }
    h1 {
        margin: 0.67em 0;
    }
    #nav {
        padding: 5px;
        text-align:right;
        padding-bottom: 1.75rem;
    }
    #nav a {
        color:white;
    }
    #nav a.router-link-exact-active {
        font-weight: bold;
        text-decoration:underline;
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
    .btn.eui-btn--red.btn-secondary:hover, .btn.eui-btn--red.btn-secondary:active, .btn.eui-btn--red.btn-secondary:focus, .btn.eui-btn--red.btn-secondary:visited {
        background-color: #d62c1a;
    }
    .btn.eui-btn--blue.btn-secondary:hover, .btn.eui-btn--blue.btn-secondary:active, .btn.eui-btn--blue.btn-secondary:focus, .btn.eui-btn--blue.btn-secondary:visited {
        background-color: #1a5981;
    }
    .btn.eui-btn--green.btn-secondary:hover, .btn.eui-btn--green.btn-secondary:active, .btn.eui-btn--green.btn-secondary:focus, .btn.eui-btn--green.btn-secondary:visited {
        background-color: #1baf5e;
    }
    .default_background {
        background-color: #ebebeb;
    }
</style>
