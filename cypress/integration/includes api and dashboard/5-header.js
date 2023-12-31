before(() => {
    Cypress.on('window:before:load', (win) => {
      win.addEventListener('unhandledrejection', (event) => {
        const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`
  
        // fail the test
        throw new Error(msg)
      })
    })
})
describe('Header functionality', () => {
    beforeEach(() => {
        cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
        cy.removeLocalStorage(`${Cypress.env('token_storage_variable')}`)
        cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
        cy.getLocalStorage(`${Cypress.env('token_storage_variable')}`)
            .then($token => {
                if ($token == null){
                    cy.get(`${Cypress.env('login_modal_selector')}`).should('be.visible')
                      .find('button').should('contain', `${Cypress.env('login_label')}`).click()
                    cy.get(`${Cypress.env('login_user_select_selector')}`)
                      .should('have.value', `${Cypress.env('login_user_select_value')}`)
                    cy.get(`${Cypress.env('login_user_select_selector')}`)
                      .select(`${Cypress.env('user_id')}`)
                    cy.get(`${Cypress.env('login_button_selector')}`)
                      .should('be.visible').trigger("click")
                }
            })
    })
    it(`Test the nav links from daac selection page`, () => {
      // These links should have href attributes
      // In questions, the other links use a onclick to ask a user first before redirecting
      cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
      cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
      const navPages = `${Cypress.env('daac_nav_href_checks')}`.split(', ')
      navPages.forEach(page => {
        cy.contains(page)
          .then((link) => {
            cy.request(link.prop('href'))
          })
      })
    })
})