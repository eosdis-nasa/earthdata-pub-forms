<template>
  <!-- Main App -->
  <div id="app">
    <Header :form_title="form_title"/>
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
        data() {
            return {
                form_title: ''
            }
        },
        components: {
            Header
        },
        mounted() {
            this.$watch(
                () => {
                    return this.$refs.content.form_title
                },
                val => {
                    this.form_title = val
                }
            )
            this.form_title = this.$refs.content.form_title || ''
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
        font-weight: bold;
        color:white;
    }
    #nav a.router-link-exact-active {
        color: #42b983;
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
