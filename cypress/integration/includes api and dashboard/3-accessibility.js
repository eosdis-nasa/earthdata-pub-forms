/* These are accessibility tests to verify 508 compliance is being met */
before(() => {
    Cypress.on('window:before:load', (win) => {
      win.addEventListener('unhandledrejection', (event) => {
        const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`
  
        // fail the test
        throw new Error(msg)
      })
    })
})
describe('Accessibility Testing', () => {
    beforeEach(() => {
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
    // Forms
    it(`Forms root, ${Cypress.env('forms_root')}, meets 508 compliance`, () => {
        cy.visit(Cypress.env('forms_root'))
        cy.wait(5000)
        cy.injectAxe()
        cy.checkA11y()
    })
    it(`Forms pages meet 508 compliance`, () => {
        const pages = Cypress.env('forms_pages')
        for (const ea in pages) {
            const page_url = `${Cypress.env('forms_root')}${pages[ea]}`
            cy.visit(page_url)
            cy.wait(9000)
            cy.injectAxe()
            cy.checkA11y()  
        }
    })
})