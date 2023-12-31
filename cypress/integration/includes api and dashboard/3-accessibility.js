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
    // Forms
    it(`Create a new request and look at first questions form for critical accessibility violations`, () => {
      cy.request(Cypress.env('api_reseed'))
        .should((response) => {
          expect(response.status).to.eq(200)
        })
      cy.wait(10000);
      cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
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
      cy.wait(9000)
      cy.get(`${Cypress.env('new_request_link_selector')}`)
        .invoke('attr', 'id')
        .then(($id) => {
          const id = $id
          cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['questions_page']}${id}`)
          cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
          cy.wait(9000)
          cy.injectAxe()
          cy.checkA11y(null, {
            rules: {
              'color-contrast': { enabled: false },
            },
            includedImpacts: ['critical']
          })
        })
      })

      it(`Create a new request, reassign the workflow to the second form, then look at the second questions form for critical accessibility violations`, () => {
        cy.request(Cypress.env('api_reseed'))
          .should((response) => {
            expect(response.status).to.eq(200)
          })
        cy.wait(10000);
        cy.removeLocalStorage(`${Cypress.env('history_tracking_variable')}`)
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
        cy.wait(9000)
        cy.get(`${Cypress.env('new_request_link_selector')}`)
          .invoke('attr', 'id')
          .then(($id) => {
            const id = $id
            cy.get(`${Cypress.env('request_link_selector')}#${id}`).click()
            cy.get(`${Cypress.env('request_dropdown_selector')}`).click()
            cy.get(`${Cypress.env('reassign_workflow_selector')}`).eq(1).click()
            cy.get(`${Cypress.env('assign_form2_workflow_select_id')}`).should('be.visible').click()
            cy.get(`${Cypress.env('workflow_select_button_selector')}`).click()
            cy.wait(9000)
            cy.get('.table--wrapper').scrollTo('right')
            cy.get(`${Cypress.env('next_action_selector')}`).should('be.visible').click()
            cy.contains(`${Cypress.env('header_form2_title_value')}`)
            cy.wait(9000)
            cy.injectAxe()
            cy.checkA11y(null, {
              rules: {
                'color-contrast': { enabled: false },
              },
              includedImpacts: ['critical']
            })
          })
        })

    it(`Analyze the daac selection form for critical accessibility violations`, () => {
      cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
      cy.get('label').contains(`${Cypress.env('daac_radio_label')}`).click()
      cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('daac_selection_url')}`)
      cy.get(`${Cypress.env('daac_description_selector')}`).contains(`${Cypress.env('daac_description_match_text')}`)
      cy.get(`${Cypress.env('daac_link_selector')}`)
        .scrollIntoView()
        .should('have.attr', 'href')
        .and('match', new RegExp(`/${Cypress.env('daac_link_href')}/`, 'g'))
      cy.injectAxe()
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false },
        },
        includedImpacts: ['critical']
      })
    })
})