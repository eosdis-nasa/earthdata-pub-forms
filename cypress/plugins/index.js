/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
require('dotenv').config()

module.exports = (on, config) => {
  config.env.dashboard_root = process.env.VUE_APP_DASHBOARD_ROOT
  config.env.api_root=process.env.VUE_APP_API_ROOT
  config.env.api_daacs_url = process.env.VUE_APP_DAACS_URL
  config.env.api_forms_url = process.env.VUE_APP_FORMS_URL
  config.env.api_form_url = process.env.VUE_APP_FORM_URL
  config.env.api_requests_url = process.env.VUE_APP_REQUESTS_URL
  config.env.api_request_url = process.env.VUE_APP_REQUEST_URL
  config.env.api_questions_url = process.env.VUE_APP_QUESTIONS_URL
  config.env.forms_default_route = process.env.VUE_APP_DEFAULT_ROUTE
  config.env.forms_unknown_website_link_singular = process.env.VUE_APP_UNKNOWN_WEBSITE_LINK_SINGULAR
  config.env.forms_testing_mode = process.env.VUE_APP_TESTING_MODE

  on('before:browser:launch', (browser = {}, launchOptions) => {
    // `args` is an array of all the arguments that will
    // be passed to browsers when it launches
    console.log(launchOptions.args) // print all current args

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // auto open devtools
      launchOptions.args.push('--auto-open-devtools-for-tabs')
    }

    if (browser.family === 'firefox') {
      // auto open devtools
      launchOptions.args.push('-devtools')
    }

    if (browser.name === 'electron') {
      // auto open devtools
      launchOptions.preferences.devTools = true
    }

    if (browser.name === 'chrome' && browser.isHeadless) {
      // fullPage screenshot size is 1400x1200 on non-retina screens
      // and 2800x2400 on retina screens
      launchOptions.args.push('--window-size=1400,1200')

      // force screen to be non-retina (1400x1200 size)
      launchOptions.args.push('--force-device-scale-factor=1')

      // force screen to be retina (2800x2400 size)
      // launchOptions.args.push('--force-device-scale-factor=2')
    }

    if (browser.name === 'electron' && browser.isHeadless) {
      // fullPage screenshot size is 1400x1200
      launchOptions.preferences.width = 1400
      launchOptions.preferences.height = 1200
    }

    if (browser.name === 'firefox' && browser.isHeadless) {
      // menubars take up height on the screen
      // so fullPage screenshot size is 1400x1126
      launchOptions.args.push('--width=1400')
      launchOptions.args.push('--height=1200')
    }

    // whatever you return here becomes the launchOptions
    return launchOptions
  })
  return config;
}