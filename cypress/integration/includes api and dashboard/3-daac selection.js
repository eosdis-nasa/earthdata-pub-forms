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
        
    })
    it(``, () => {
        
    })
    it(``, () => {
        
    })
})