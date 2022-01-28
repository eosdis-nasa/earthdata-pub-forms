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
        cy.removeLocalStorage('auth-token')
        cy.visit(Cypress.env('forms_root'))
        cy.getLocalStorage('auth-token')
            .then($token => {
                if ($token == null){
                    cy.get('div.modal-content').should('be.visible')
                        .find('button').should('contain', 'Login').click()
                    cy.get('#user-select')
                        .should('have.value', 'register')
                    cy.get('#user-select')
                        .select(`${Cypress.env('user_id')}`)
                    cy.get('#btn-login').should('be.visible').trigger("click")
                }
            })
        cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('forms_default_route')}`)
    })
    it(`Login to the dashboard as ${Cypress.env('new_user_fullname')}, then log out`, () => {
        cy.removeLocalStorage('auth-token')
        cy.visit(Cypress.env('dashboard_root'))
        cy.getLocalStorage('auth-token')
            .then($token => {
                if ($token == null){
                    cy.get('div.modal-content').should('be.visible')
                        .find('button').should('contain', 'Login').click()
                    cy.get('#user-select')
                        .should('have.value', 'register')
                    cy.get('#input-name')
                       .type(`${Cypress.env('new_user_fullname')}`)
                       .should('have.value', `${Cypress.env('new_user_fullname')}`)
                    cy.get('#input-email')
                       .type(`${Cypress.env('new_email')}`)
                       .should('have.value', `${Cypress.env('new_email')}`)
                    cy.get('#btn-register').should('be.visible').trigger("click")
                }
            })
        cy.url().should('eq', `${Cypress.env('dashboard_root')}/`)
        cy.get('.logOut').should('be.visible').trigger("click")
    })
})