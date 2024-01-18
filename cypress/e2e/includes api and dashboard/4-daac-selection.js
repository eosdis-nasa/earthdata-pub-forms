before(() => {
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

      // fail the test
      return false
    })
  })
  cy.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
})
describe('Daac Selection Page', () => {
  beforeEach(() => {
    cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
    cy.removeLocalStorage(`${Cypress.env('token_storage_variable')}`)
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.getLocalStorage(`${Cypress.env('token_storage_variable')}`)
      .then($token => {
        if ($token == null) {
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
  it(`Test the forms root route and verify a modal with ok pops up redirecting you`, () => {
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}`)
    cy.wait(5000);
    cy.get(`${Cypress.env('request_id_required_modal_selector')}`).should('be.visible')
  })
  it(`Test the daac selection page route and that it loads`, () => {
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.wait(5000);
    cy.contains(`${Cypress.env('daac_radio_label')}`)
  })
  it(`Test daac selection populating data and then all functionality`, () => {
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.wait(5000);
    cy.get('label').contains(`${Cypress.env('daac_radio_label')}`).click()
    cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.get(`${Cypress.env('daac_description_selector')}`).contains(`${Cypress.env('daac_description_match_text')}`)
    cy.get(`${Cypress.env('daac_link_selector')}`)
      .scrollIntoView()
      .should('have.attr', 'href')
      .and('match', new RegExp(`/${Cypress.env('daac_link_href')}/`, 'g'))
    cy.get(`${Cypress.env('daac_select_button_selector')}`).should('not.be.disabled')
    cy.get(`${Cypress.env('daac_select_button_selector')}`).click()
    cy.url().should('eq', `${Cypress.env('dashboard_root')}/requests`)
  })
  it(`Test daac selection cancel functionality`, () => {
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.wait(5000);
    cy.get('label').contains(`${Cypress.env('daac_radio_label')}`).click()
    cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
    cy.get(`${Cypress.env('daac_description_selector')}`).contains(`${Cypress.env('daac_description_match_text')}`)
    cy.get(`${Cypress.env('daac_link_selector')}`)
      .scrollIntoView()
      .should('have.attr', 'href')
      .and('match', new RegExp(`/${Cypress.env('daac_link_href')}/`, 'g'))
    cy.get(`${Cypress.env('daac_cancel_button_selector')}`).should('not.be.disabled')
    cy.get(`${Cypress.env('daac_cancel_button_selector')}`).click()
  })
  it(`Test request not found`, () => {
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['questions_page']}testing`)
    cy.get(`${Cypress.env('request_id_required_modal_selector')}`).should('be.visible')
    cy.wait(5000);
  })
})