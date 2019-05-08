const assert = require('assert');
const LoginPage = require('../../pages/login.page');
const loginPage = new LoginPage();

describe('Dashboard', () => {
  it('should have the right title', () => {
    browser.url('/');
    const title = browser.getTitle();
    assert.equal(title, 'Modite Directory')
  })
});
