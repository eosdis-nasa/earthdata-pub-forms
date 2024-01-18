before(() => {
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

      // fail the test
      // throw new Error(msg)
      return false
    })
  })
  cy.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
})
describe('Header functionality', () => {
  beforeEach(() => {
    cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
    cy.removeLocalStorage(`${Cypress.env('token_storage_variable')}`)
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.getLocalStorage(`${Cypress.env('token_storage_variable')}`)
      .then($token => {
        if ($token == null || $token == undefined) {
          cy.get(`${Cypress.env('login_modal_selector')}`).should('be.visible')
            .find('button').should('contain', `${Cypress.env('login_label')}`).click()
          cy.get(`${Cypress.env('login_user_select_selector')}`)
            .should('have.value', `${Cypress.env('login_user_select_value')}`)
          cy.get(`${Cypress.env('login_user_select_selector')}`)
            .select(`${Cypress.env('user_id')}`)
          cy.wait(5000);
          cy.get(`${Cypress.env('login_button_selector')}`)
            .should('be.visible').trigger("click")
        }
      })
  })
  it(`Test the nav links from daac selection page`, () => {
    // These links should have href attributes
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.wait(5000);
    cy.contains(`${Cypress.env('daac_radio_label')}`)
    const navPages = `${Cypress.env('daac_nav_href_checks')}`.split(', ')
    navPages.forEach(page => {
      cy.get(`span a`).contains(page)
        .then((link) => {
          cy.visit(link.prop('href'))
          cy.wait(5000);
          cy.go('back')
          cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
        })
    })
  })
})