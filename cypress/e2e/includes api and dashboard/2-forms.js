/// <reference types="cypress" />
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
    cy.task('resetCoverage', { isInteractive: Cypress.config('isInteractive') })
})
describe('Forms E2E testing', () => {
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
    it(`Create a new request and look at first questions form for critical accessibility violations`, () => {
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
        cy.get(`${Cypress.env('new_request_link_selector')}`)
            .invoke('attr', 'id')
            .then(($id) => {
                const id = $id
                cy.get(`${Cypress.env('request_link_selector')}#${id}`).first().click()
                cy.get(`${Cypress.env('request_dropdown_selector')}`).click()
                cy.get(`${Cypress.env('reassign_workflow_selector')}`).contains(`Reassign Workflow`).click()
                cy.wait(9000);
                cy.get(`${Cypress.env('assign_form2_workflow_select_id')}`).should('be.visible').click()
                cy.get(`${Cypress.env('workflow_select_button_selector')}`).click()
                cy.get('.table--wrapper').scrollTo('right')
                cy.get(`${Cypress.env('next_action_selector')}`).first().should('be.visible').click()
                cy.wait(9000)
                cy.contains(`${Cypress.env('header_form2_title_value')}`)
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
        cy.wait(10000);
        cy.visit(`${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
        cy.get('label').contains(`${Cypress.env('daac_radio_label')}`).click()
        cy.url().should('eq', `${Cypress.env('forms_root')}${Cypress.env('forms_pages')['daac_selection_page']}`)
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
    it(`Create a new request, assign the first form workflow and load the form`, () => {
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
        cy.get(`${Cypress.env('assign_form1_workflow_select_id')}`).should('be.visible').click()
        cy.get(`${Cypress.env('workflow_select_button_selector')}`).click()
        cy.wait(9000)
        cy.get('.table--wrapper').scrollTo('right')
        cy.get(`${Cypress.env('next_action_selector')}`).first().should('be.visible').click()
        cy.wait(9000)
        cy.contains(`${Cypress.env('header_form1_title_value')}`)
    })
    it(`Create a new request, assign the second form workflow and load the form`, () => {
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
        cy.get(`${Cypress.env('assign_form2_workflow_select_id')}`).should('be.visible').click()
        cy.get(`${Cypress.env('workflow_select_button_selector')}`).click()
        cy.wait(9000)
        cy.get('.table--wrapper').scrollTo('right')
        cy.get(`${Cypress.env('next_action_selector')}`).first().should('be.visible').click()
        cy.wait(9000)
        cy.contains(`${Cypress.env('header_form2_title_value')}`)
    })
    afterEach(() => {
        // save coverage after each test
        // because the entire "window" object is about
        // to be recycled by Cypress before next test
        cy.window().then(win => {
            if (win.__coverage__) {
                cy.task('combineCoverage', win.__coverage__)
            }
        })
    })
})