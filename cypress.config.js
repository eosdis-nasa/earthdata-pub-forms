const { defineConfig } = require("cypress");

module.exports = defineConfig({
    env: {
        username: "Earthdata Pub System",
        new_user_fullname: "New User",
        new_email: "example@edpub.com",
        email: "no_email",
        user_id: "1b10a09d-d342-4eee-a9eb-c99acd2dde17",
        nav_active_class: "router-link-exact-active.router-link-active",
        api_test: "http://localhost:8080/docs",
        api_reseed: "http://localhost:8080/reseed",
        overview_root: "http://localhost:8082",
        forms_root: "http://localhost:8081",
        token_storage_variable: "auth-token",
        history_tracking_variable: "forms-arrived-from",
        login_modal_selector: "div.modal-content",
        login_label: "Login",
        login_user_select_selector: "#user-select",
        login_user_select_value: "register",
        login_input_name_selector: "#input-name",
        login_input_email_selector: "#input-email",
        login_button_selector: "#btn-login",
        login_button_register_selector: "#btn-register",
        login_logout_selector: ".logOut",
        request_id_required_modal_selector: ".redirect-modal",
        header_title_selector: "span#title",
        header_title_default_value: "Earthdata Publication Forms",
        header_form1_title_value: "Data Accession Request",
        header_form2_title_value: "Data Publication Request",
        daac_radio_label: "ORNL DAAC",
        daac_radio_label_for_assign_workflow: "GHRC DAAC",
        daac_description_selector: "div#selected_description",
        daac_link_selector: "a#selected_daac_link",
        daac_description_match_text: "Oak Ridge",
        daac_link_href: "daac.ornl.gov",
        new_request_button_class: ".new-request-button",
        assign_workflow_selector: ".assign-workflow",
        request_link_selector: ".table--wrapper a",
        request_dropdown_selector: ".dropdown__options__btn",
        reassign_workflow_selector: ".async__element span",
        workflow_select_button_selector: "#selectButton",
        assign_form1_workflow_select_id: ".select_data_accession_request_workflow",
        assign_form2_workflow_select_id:
            ".select_data_publication_request_workflow",
        next_action_selector: ".next-action",
        new_request_link_selector: ".table__main-asset a",
        daac_select_button_selector: "button#daac_select_button",
        daac_cancel_button_selector: "button#daac_cancel_button",
        daac_nav_href_checks: "Dashboard, Overview",
        api_get_token_command_admin:
            "python3 /home/5kb/git/earthdatapub/get_edpub_token.py",
        api_get_token_command_manager:
            "python3 /home/5kb/git/earthdatapub/get_edpub_token.py -r manager -g asdc",
        api_get_token_command_coordinator:
            "python3 /home/5kb/git/earthdatapub/get_edpub_token.py -r coordinator -g asdc",
        forms_pages: {
            daac_selection_page: "/daacs/selection",
            questions_page: "/questions/",
        },
        codeCoverage: {
            url: 'http://localhost:8081/__coverage__',
        }
    },

    chromeWebSecurity: false,

    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        fixturesFolder: 'cypress/e2e/fixtures',
        specPattern: 'cypress/e2e/includes api and dashboard',
        screenshotsFolder: 'cypress/e2e/screenshots',
        videosFolder: 'cypress/e2e/videos',
        supportFile: 'cypress/support/e2e.js',
        setupNodeEvents(on, config) {
            require('@cypress/code-coverage/task')(on, config)
            require("./cypress/plugins/index.js")(on, config);
            on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));
            return config
        },
        baseUrl: "http://localhost:8081",
    },
    /* component: {
      supportFile: 'cypress/support/e2e.js',
      devServer: {
        framework: "vue-cli",
        bundler: "webpack",
      },
    }, */
});