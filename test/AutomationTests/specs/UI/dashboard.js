const assert = require('assert');
const LoginPage = require('../../pages/login.page');
const loginPage = new LoginPage();

describe('Dashboard', () => {
  it('should have the right title', () => {
    loginPage.open();
    assert.equal(loginPage.getTitle(), 'Modite Directory')
  });

  it('should have the search field present', () => {
      //#todo
  });

  it('should have the Team button present', () => {
      //#todo
  });

  it('should have Projects button present', () => {
      //#todo
  })
});
