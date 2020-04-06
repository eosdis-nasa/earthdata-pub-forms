<template>
  <!-- Form -->
  <b-form @submit="enterSubmitForm">
    <b-container>
        <div>
            <b-form-group label="Choose your DAAC:"><br>
                <!-- Radio Div with Description -->
                <div>
                    <div class="desc_div" v-if="selected" id="selected_description"></div>
                    <div class="radio_div">
                        <b-form-radio v-for="(item, index) in daacs" :key=index :name="item.short_name" :id="item.short_name + '_' + index" :value="item.long_name" @change.native="setSelectedValues(item.url, item.short_name, item.description)" v-model="selected">
                            {{ item.short_name }}
                        </b-form-radio>
                    </div>
                </div>
                <!-- End of Radio Div with Description -->
                <!-- Selected Info -->
                <div style="clear:both">
                    <div class="mt-3" v-if="selected">
                        You have selected:<br>
                        <strong>{{ selected }}</strong>
                    </div>
                    <div class="mt-3" v-if="selected" id="selected_url"></div>
                    <!-- Submit Button -->
                    <div v-if="selected" class="button_div mt-3">
                        <b-button class="button" @click="submitForm()">
                            Next
                        </b-button>
                    </div>
                    <!-- End of Submit Button -->
                </div>
                <!-- End of Selected Info -->
            </b-form-group>
        </div>
    </b-container>
  </b-form>
  <!-- End of Form -->
</template>
<script>
    // Jquery javascript
    import $ from 'jquery'
    
    // This DAACS component gets DAAC data and displays abbreviations as a radio selection
    // On selection displays a link to the selected DAAC website, description and a 'Next
    // Button' is displayed to allow users more info and to move on.
    export default {
        name: 'DAACS',
        data() {
            return {
                selected: '',
                daacs: this.fetchDaacs()
            }
        },
        props: {
            // Submit label property and its type
            submitLabel: { default: 'Submit', type: String }
        },
        computed: {

        },
        validations: {
           
        },
        methods: {
            // @vuese
            // Fetchs the DAAC data
            fetchDaacs(){
                // Gets DAAC data for template
                var items = []
                $.getJSON( "daacs.json", function( daacs ) {
                    for(var dict in daacs['data']) {
                        items.push(daacs['data'][dict])
                    }
                })
                return items
            },
            // @vuese
            // On selected, builds dynamic text and sets html dynamically with the link
            setSelectedValues(url, short_name, description){
                var text = "For more information on <b>" + short_name + "</b>, visit <a href=\"" + url + "\">" + short_name + '\'s website</a>.'
                $('#selected_url').html(text)
                $('#selected_description').html(description)
                this.data = short_name
                this.setSaveObject(this.data)
            },
            // @vuese
            // @arg The event
            enterSubmitForm(evt) {
                // Calls submit form via enter key
                evt.preventDefault()
                if (this.enterSubmit) {
                    this.submitForm()
                }
            },
            // @vuese
            // Used to submit the form data if valid
            submitForm() {
                // Submit form (this.data) if valid
                this.$v.$touch()
                this.$emit('submitForm', this.data)
                // Testing - what does below do
                this.$router.push({ name: 'Questions', params: { DAAC: this.data } })
            },
            // @vuese
            // Used to save file
            setSaveObject() {
                // Saves file to localStorage
                window.localStorage.setItem('DAAC', this.data);
            }
        }
    }
</script>
<style scoped>
    .radio_div{
        width:25%;
        float:left;
        margin-bottom:1rem;
    }
    .desc_div{
        width:75%;
        float:right;
    }
    .button_div{
        margin-top:1rem;
        text-align:left;
        float:left;
    }
</style>