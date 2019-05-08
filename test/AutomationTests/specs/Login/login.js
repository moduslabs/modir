const expect = require('chai').expect
const LoginPage = require('../../pages/login.page')
const loginPage = new LoginPage()

//const DashPage = require('../../pages/dashboard.page')
//const dashPage = new DashPage()

describe('Normal Login', () => {
  it('Should be able to login a normal user', () => {
    loginPage.open()
    loginPage.doCompleteLogin('Modir+123@gmail.com', 'bration.modir.xyc')

    //expect(dashPage.isHeaderPresent())
  })
})
