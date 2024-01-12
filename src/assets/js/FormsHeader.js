import mixin from "@/mixins/mixin.js";

// This is the header component that displays navigation links
// for the user and remains the same across all components.
export default {
    mixins: [mixin],
    name: "FormsHeader",
    data() {
        return {
            daac: "",
            formId: '',
            requestId: ''
        };
    },
    props: {

    },
    computed: {
        dashboardRoot() {
            return process.env.VUE_APP_DASHBOARD_ROOT
        },
        overviewRoot() {
            if (process.env.VUE_APP_OVERVIEW_ROOT === '') {
                return `http://localhost:8082`;
            }
            return process.env.VUE_APP_OVERVIEW_ROOT
        }
    },
    watch: {

    },
    created() {

    },
    mounted() {
        // @vuese
        // Sets the main route based on incoming query string, then saves them to the store.
        // This then sets local variables from the global_params
        window.headerComponent = this;
        if (!window.location.href.match(/daacs/g)) {
            this.getIDs().then(() => {
                this.setLocalVars()
            })
        } else {
            this.setLocalVars()
        }
    },
    methods: {
        setLocalVars() {
            if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['formId'] != 'undefined') {
                this.formId = this.$store.state.global_params['formId']
            }
            if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['requestId'] != 'undefined') {
                this.requestId = this.$store.state.global_params['requestId']
            }
            if (typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['group'] != 'undefined') {
                this.daac = this.$store.state.global_params['group']
            }
        }
    }
};
