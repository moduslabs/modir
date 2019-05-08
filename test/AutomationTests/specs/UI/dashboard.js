const assert = require('assert');
const LoginPage = require('../../pages/login.page');
const loginPage = new LoginPage();

describe('Dashboard', () => {
  it('should have the right title', () => {
    loginPage.open();
    const title = loginPage.getTitle();
      assert.equal(title, 'Modite Directory')
  })
});
