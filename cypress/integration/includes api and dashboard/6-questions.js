before(() => {
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

      // fail the test
      throw new Error(msg)
    })
  })
})
describe('Questions Page', () => {
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
  it(`Test form 1 route and that data loads`, () => {
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['questions_1_url']}`)
    cy.contains(`${Cypress.env('header_form1_title_value')}`)
  })
  it(`Test form 2 route and that data loads`, () => {
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['questions_2_url']}`)
    cy.contains(`${Cypress.env('header_form2_title_value')}`)
  })
})