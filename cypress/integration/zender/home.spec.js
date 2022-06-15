describe('example to-do app', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000')
    })
    it('Default behaviour',()=>{
        cy.get('.files li').should('have.length', 0)
        cy.get('.files').contains("Drag and drop some file here")
    })
}
)