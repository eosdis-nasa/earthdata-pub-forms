before(() => {
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

      // fail the test
      throw new Error(msg)
    })
  })
})
describe('Daac Selection Page', () => {
  beforeEach(() => {
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
  it(`Test the daac selection page route and that it loads`, () => {
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.contains(`${Cypress.env('daac_radio_label')}`) 
  })
  it(`Test daac selection populating data and then all functionality`, () => {
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.get('label').contains(`${Cypress.env('daac_radio_label')}`).click()
    cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('daac_selection_url')}`)
    cy.get(`${Cypress.env('daac_description_selector')}`).contains(`${Cypress.env('daac_description_match_text')}`)
    cy.get(`${Cypress.env('daac_link_selector')}`)
      .scrollIntoView()
      .should('have.attr', 'href')
      .and('match', new RegExp(`/${Cypress.env('daac_link_href')}/`, 'g'))
    cy.get(`${Cypress.env('daac_select_button_selector')}`).should('not.be.disabled')
    cy.get(`${Cypress.env('daac_select_button_selector')}`).click()
    cy.url().should('eq', `${Cypress.env('dashboard_root')}/requests`)
  })
})