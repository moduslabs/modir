const expect = require('chai').expect;
const LoginPage = require('../../pages/login.page');
const loginPage = new LoginPage();

const DashPage = require('../../pages/dashboard.page');
const dashPage = new DashPage();

describe('Normal Login', () => {
  it('Should be able to login a normal user', () => {
    loginPage.open();
    loginPage.doCompleteLogin('abraham.arias@moduscreate.com', 'bronce.modus.1');

    expect(dashPage.isHeaderPresent())
  })
});
