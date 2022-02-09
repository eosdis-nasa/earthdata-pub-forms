before(() => {
    Cypress.on('window:before:load', (win) => {
      win.addEventListener('unhandledrejection', (event) => {
        const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`
  
        // fail the test
        throw new Error(msg)
      })
    })
})
describe('Logging in', () => {
    it(`Login to the dashboard as ${Cypress.env('username')}`, () => {
        cy.removeLocalStorage(`${Cypress.env('token_storage_variable')}`)
        cy.visit(Cypress.env('forms_root'))
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
        cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('forms_default_route')}`)
    })
    it(`Login to the dashboard as ${Cypress.env('new_user_fullname')}, then log out`, () => {
        cy.removeLocalStorage(`${Cypress.env('token_storage_variable')}`)
        cy.visit(Cypress.env('dashboard_root'))
        cy.getLocalStorage(`${Cypress.env('token_storage_variable')}`)
            .then($token => {
                if ($token == null){
                    cy.get(`${Cypress.env('login_modal_selector')}`).should('be.visible')
                        .find('button').should('contain', `${Cypress.env('login_label')}`).click()
                    cy.get(`${Cypress.env('login_user_select_selector')}`)
                        .should('have.value', `${Cypress.env('login_user_select_value')}`)
                    cy.get(`${Cypress.env('login_input_name_selector')}`)
                       .type(`${Cypress.env('new_user_fullname')}`)
                       .should('have.value', `${Cypress.env('new_user_fullname')}`)
                    cy.get(`${Cypress.env('login_input_email_selector')}`)
                       .type(`${Cypress.env('new_email')}`)
                       .should('have.value', `${Cypress.env('new_email')}`)
                    cy.get(`${Cypress.env('login_button_register_selector')}`)
                        .should('be.visible').trigger("click")
                }
            })
        cy.url().should('eq', `${Cypress.env('dashboard_root')}/`)
        cy.get(`${Cypress.env('login_logout_selector')}`).should('be.visible').trigger("click")
    })
    it(`Tests the auth script to get admin token`, () => {
        cy.exec(Cypress.env('api_get_token_command_admin')).then((result) => {
          const admin_token = result.stdout
          expect(admin_token).to.contain('Bearer')
        })
    })
    it(`Tests the auth script to get manager token`, () => {
        cy.exec(Cypress.env('api_get_token_command_manager')).then((result) => {
          const manager_token = result.stdout
          expect(manager_token).to.contain('Bearer')
        })
    })
    it(`Tests the auth script to get coordinator token`, () => {
        cy.exec(Cypress.env('api_get_token_command_coordinator')).then((result) => {
          const coordinator_token = result.stdout
          expect(coordinator_token).to.contain('Bearer')
        })
    })
})