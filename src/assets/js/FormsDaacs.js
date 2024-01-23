import mixin from "@/mixins/mixin.js";

// This Daacs component gets DAAC data and displays abbreviations as a radio selection.  
// On selection, it displays a link to the selected DAAC website, description and a 'Select 
// Button' is displayed to allow users to move on.
export default {
    mixins: [mixin],
    name: "FormsDaacs",
    data() {
        return {
            selected: "",
            loaded: false,
            daacs: [],
            formId: '',
            requestId: ''
        };
    },
    props: {},
    computed: {
        overviewRootPublicationDaacs() {
            return `${process.env.VUE_APP_OVERVIEW_ROOT}/data_publication_guidelines#daacs`;
        },
        notHidden: function () {
            return this.daacs.filter(i => i.hidden === false)
        },
        hidden: function () {
            return this.daacs.filter(i => i.hidden === true)
        },
    },
    validations: {},
    watch: {
        loaded: function (val) {
            setTimeout(() => {
                if (val) {
                    this.getCurrentDaacAndUpdate();
                }
            }, 1);
        },
        selected: function () {
            setTimeout(() => {
                this.setSelectedValues();
            }, 1);
        }
    },
    mounted() {
        // @vuese
        // Sets local variables from the global_params in store
        window.daacsComponent = this;
        this.setActiveNav("daacs");
        this.setLocalVars(),
            this.fetchDaacs().then(() => {
                if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['group'] != 'undefined') {
                    let daacData = this.getDaac(this.$store.state.global_params['group'])
                    if (typeof daacData != 'undefined') {
                        this.selected = daacData.long_name;
                    }
                }
                this.showHideForms('show')
            })
    },
    methods: {
        setLocalVars() {
            if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['formId'] != 'undefined') {
                this.formId = this.$store.state.global_params['formId']
            }
            if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['requestId'] != 'undefined') {
                this.requestId = this.$store.state.global_params['requestId']
            }
        },
        // @vuese
        // On selected, sets current daac objects from values
        // @arg current_daac [String] hash,  
        setCurrentDaacObjects(current_daac) {
            const daac_specific_data = this.getDaac(current_daac);
            const url = daac_specific_data["url"];
            const id = daac_specific_data["id"];
            let short_name = daac_specific_data["short_name"];
            const long_name = daac_specific_data["long_name"];
            const description = daac_specific_data["description"];
            if (short_name.match(/Unknown/g)) {
                short_name = `${process.env.VUE_APP_UNKNOWN_WEBSITE_LINK_SINGULAR}`
            }
            if (document.getElementById("selected_daac") != null) {
                document.getElementById("selected_daac").innerHTML = short_name;
            }
            if (document.getElementById("selected_daac_link") != null) {
                document.getElementById("selected_daac_link").href = url;
            }
            if (document.getElementById("selected_description") != null) {
                document.getElementById("selected_description").innerHTML = description;
            }
            this.setActiveNav("daacs");
            this.selected = long_name;
            return [short_name, id];
        },
        // @vuese
        // On selected, builds dynamic text and sets html dynamically with the link
        setSelectedValues() {
            let current = this.setCurrentDaacObjects(this.selected);
            const id = current[1];
            const short_name = current[0]
            this.$store.state.global_params['group'] = id
            window.headerComponent.daac = id
            return short_name;
        },
        // @vuese
        // Calls submit form via enter key
        enterSubmitForm() {
            if (this.enterSubmit) {
                this.submitForm();
            }
        },
        // @vuese
        // Used to submit the form data and move on
        cancelForm() {
            history.back()
        },
        // @vuese
        // Used to submit the form data and move on
        submitForm() {
            this.$v.$touch();
            let args = {}
            if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != '') {
                args['formId'] = this.$store.state.global_params['formId']
            }
            if (typeof this.$store !== 'undefined' && this.$store.state.global_params['requestId'] != '') {
                args['requestId'] = this.$store.state.global_params['requestId']
            }
            if (typeof this.$store !== 'undefined' && this.$store.state.global_params['group'] != "") {
                args['group'] = this.$store.state.global_params['group']
                this.saveFile();
            }
        },
        // @vuese
        // Gets the current daac selected from the store and updates
        getCurrentDaacAndUpdate() {
            if (
                (typeof this.$store !== 'undefined' &&
                    this.$store.state.global_params['group'] != "undefined" &&
                    this.$store.state.global_params['group'] != null &&
                    this.$store.state.global_params['group'] != "" &&
                    this.$store.state.global_params['group'] != "selection")
            ) {
                let default_daac;
                let selected;
                if (typeof this.$store !== 'undefined' &&
                    (this.$store.state.global_params['group'] != "" ||
                        typeof this.$store.state.global_params['group'] !== "undefined")) {
                    selected = this.getDaac(this.$store.state.global_params['group']);
                }
                if (typeof selected !== "undefined") {
                    let id = selected["id"];
                    default_daac = id;
                    if (
                        typeof default_daac != "undefined" &&
                        default_daac != "" &&
                        default_daac != "SELECTION"
                    ) {
                        if (document.querySelectorAll(`label[for^='${default_daac}']`)) {
                            document.querySelectorAll(`label[for^='${default_daac}']`).click();
                        }
                    }
                }
            }
            this.setActiveNav("daacs");
        }
    }
};
