<template>
  <!-- Main App -->
  <div id="app">
    <TimeoutWarning />
    <FormsHeader />
    <router-view ref="content"/>
    <go-top id="go_top" bg-color="#ebebeb" fg-color="#323232" :has-outline="true" radius="3%" aria-label="go to top button" role="contentinfo"></go-top>
    <noscript>
      <strong>We're sorry but earthdata-pub-forms pages will not work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
  </div>
</template>
<!-- End of Main App -->
<script>
    // Imports FormsHeader and footer as components.
    // Vue files that are not routes should go in components.
    // Add this to know how to import as such
    import FormsHeader from '@/components/FormsHeader'
    import GoTop from '@inotom/vue-go-top';
    import TimeoutWarning from '@/components/TimeoutWarning';
    export default {
        name: 'app',
        metaInfo: {
            title: 'Earthdata Pub Forms',
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

        },
        props:{

        },
        components: {
            FormsHeader,
            GoTop,
            TimeoutWarning
        },
        mounted() {
            
        },
        watch: {

        },
        methods: {

        }
    }
</script>
<style>
    .custom-control-label {
        margin-top: 5.5px;
    }
    .editable-table .data-cell {
        min-height: 2rem;
        border-radius:5px;
        padding: 5px;
        border: 1px solid #cac8c8;
    }
    a {
        cursor:pointer;
    }
    .form-control {
        border-radius:5px;
        height: unset!important;
    }
    .same-as-html5{
        border-radius:5px!important;
        list-style-type: none;
    }
    input, textarea {
        margin: unset!important;
    }
    textarea {
        padding-left:8px!important;
    }
    #go_top {
        max-width:50px;
        max-height:50px;
    }
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
    }
    .form-group {
        margin-top:.5rem;
    }
    a:hover {
        text-decoration: underline !important;
    }
    div.row {
        margin:0rem;
    }
    .checkboxes {
        display:-webkit-box;
        display:inline-flex!important;
        margin-right: -8px!important;
    }
    .custom-radio.b-custom-control-lg, 
    .input-group-lg .custom-radio {
        font-size: unset!important;
    }
    .custom-checkbox.b-custom-control-lg, 
    .input-group-lg .custom-checkbox {
        min-height: 1.75rem;
    }
    input[type=radio   ]:not(old) + label{
        cursor: pointer;
        padding-top: 4px;
    }
    .custom-file-label, 
    .custom-file-input ~ .custom-file-label[data-browse]::after {
        height:unset;
    }
    /* eui overrides  */
    .eui-link {
        cursor:pointer;
    }
    .eui-btn--green,
    .eui-btn--green:disabled:hover {
        background-color: #158749!important;
    }
    .eui-btn--green:hover,
    footer button.btn-primary:hover {
        background-color:#12713d!important;
    }
    .eui-btn--red,
    .eui-btn--red:disabled:hover{
        background-color: #DB1400;
    }
    .eui-btn--red:hover {
        background-color: #c21200!important;
    }
    .btn:disabled, .btn.disabled {
        cursor:not-allowed;
    }
    .eui-btn--blue,
    .eui-btn--blue.disabled:hover {
        background-color: #2275AA;
    }
    .eui-btn--blue:hover {
        background-color: #2c3e50;
    }
    .modal-footer,
    .modal-header {
        background-color: #ebebeb!important;
    }
    .eui-btn--green,
    .eui-btn--green:disabled:hover {
        background-color: #158749!important;
    }
    .eui-btn--green:hover,
    footer button.btn-primary:hover {
        background-color:#12713d!important;
    }
    footer button.btn-primary {
        background-color:#158749;
        color:white;
    }
    #undo_button.disabled,
    #redo_button.disabled {
        background-color: #6c757d;
    }
    .btn.eui-btn--red.btn-secondary:hover, 
    .btn.eui-btn--red.btn-secondary:active, 
    .btn.eui-btn--red.btn-secondary:focus, 
    .btn.eui-btn--red.btn-secondary:visited, 
    .eui-btn--red.btn-secondary:disabled {
        background-color: #d62c1a;
    }
    .btn.eui-btn--blue.btn-secondary:hover, 
    .btn.eui-btn--blue.btn-secondary:active, 
    .btn.eui-btn--blue.btn-secondary:focus, 
    .btn.eui-btn--blue.btn-secondary:visited, 
    .eui-btn--blue.btn-secondary:disabled {
        background-color: #1a5981;
    }
    .btn.eui-btn--green.btn-secondary:hover, 
    .btn.eui-btn--green.btn-secondary:active, 
    .btn.eui-btn--green.btn-secondary:focus, 
    .btn.eui-btn--green.btn-secondary:visited, 
    .eui-btn--green.btn-secondary:disabled {
        background-color: #1baf5e;
    }
    /* ******************* */
</style>