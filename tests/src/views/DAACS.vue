<template>
  <b-form v-on:submit.stop.prevent @submit="enterSubmitForm" @reset="resetForm">
    <b-container>
        <div>
            <b-form-group label="Choose your DAAC:"><br>
                <b-form-radio v-for="(item, index) in daacs" :key=index :name="item.short_name" :id="item.short_name + '_' + index" :value="item.long_name" @change.native="setSelectedValues(item.url, item.short_name)" v-model="selected">
                    {{ item.short_name }}
                </b-form-radio>
                <div class="mt-3" v-if="selected">
                    You have selected:<br>
                    <strong>{{ selected }}</strong>
                </div>
                <div class="mt-3" v-if="selected" id="selected_url"></div>
            </b-form-group>
        </div>
    </b-container>
  </b-form>
</template>
<script>
    import $ from 'jquery'
    
    export default {
        name: 'DAACS',
        data() {
            return {
                selected: '',
                daacs: this.fetchDaacs()
            }
        },
        props: {
            resetLabel: { default: 'Reset', type: String },
            submitLabel: { default: 'Submit', type: String }
        },
        computed: {},
        validations() {
        },
        methods: {
            fetchDaacs(){
                var items = []
                $.getJSON( "daacs.json", function( daacs ) {
                    for(var dict in daacs['data']) {
                        items.push(daacs['data'][dict])
                    }
                })
                return items
            },
            setSelectedValues(url, short_name){
                var text = "For more information on <b>" + short_name + "</b>, visit <a href=\"" + url + "\">" + short_name + '\'s website</a>.'
                $('#selected_url').html(text)
            },
            enterSubmitForm(evt) {
                evt.preventDefault()
                if (this.enterSubmit) {
                    this.submitForm()
                }
            },
            submitForm() {
                this.fixBooleans()
                this.$v.$touch()
                if (this.$v.$invalid) {
                    alert('Please correct the errors on the form before saving.')
                } else {
                    this.$emit('submitForm', this.data)
                }
            },
            resetForm() {
                this.$emit('resetForm')
            }
        }
    }
</script>
<style>
    .col-form-label {
        font-weight:bold;
    }
    .mt-3 {
        text-align: left;
    }
    strong {
        margin-left:2rem;
    }
    .bv-no-focus-ring {
        text-align:left;
        margin-left:2rem;
    }
    .custom-radio{
        padding-bottom:1.5rem;
    }
</style>