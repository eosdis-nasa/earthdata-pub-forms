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
  cy.request(Cypress.env('api_reseed'))
    .should((response) => {
      expect(response.status).to.eq(200)
    })
  cy.wait(10000);
  cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
})
describe('Questions Page', () => {
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
    cy.wait(10000);
    cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
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
    cy.wait(9000)
    cy.get('.table--wrapper').scrollTo('right')
    cy.get(`${Cypress.env('new_request_link_selector')}`)
      .invoke('attr', 'id')
      .then(($id) => {
        const id = $id
        cy.get(`${Cypress.env('request_link_selector')}#${id}`).first().click()
        cy.get(`${Cypress.env('request_dropdown_selector')}`).click()
        cy.get(`${Cypress.env('reassign_workflow_selector')}`).contains(`Reassign Workflow`).click()
        cy.wait(9000);
      })
  })
  // Forms
  it(`Create a new request, assign the first form workflow and load the form`, () => {
    cy.get(`${Cypress.env('assign_form1_workflow_select_id')}`).should('be.visible').click()
    cy.get(`${Cypress.env('workflow_select_button_selector')}`).click()
    cy.wait(9000)
    cy.get('.table--wrapper').scrollTo('right')
    cy.get(`${Cypress.env('next_action_selector')}`).first().should('be.visible').click()
    cy.wait(9000)
    cy.contains(`${Cypress.env('header_form1_title_value')}`)
  })
  it(`Create a new request, assign the second form workflow and load the form`, () => {
    cy.get(`${Cypress.env('assign_form2_workflow_select_id')}`).should('be.visible').click()
    cy.get(`${Cypress.env('workflow_select_button_selector')}`).click()
    cy.wait(9000)
    cy.get('.table--wrapper').scrollTo('right')
    cy.get(`${Cypress.env('next_action_selector')}`).first().should('be.visible').click()
    cy.wait(9000)
    cy.contains(`${Cypress.env('header_form2_title_value')}`)
  })
})