const assert = require('assert')
const LoginPage = require('../../pages/login.page')
const loginPage = new LoginPage()

describe('Normal Login', () => {
  it('Should be able to login a normal user', () => {
    loginPage.open()
    loginPage.doCompleteLogin('abraham.arias@moduscreate.com', 'Bronce.modus.1')
    //expect($('#header_container').isDisplayed())
  })
})
