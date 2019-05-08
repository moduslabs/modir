const Page = require('./page');

class LoginPage extends Page {
  constructor() {
    super()
  }

  open() {
    super.open('')
  }

  get signInButton() {
    return $('.abcRioButton');
  }
  get emailInput() {
    return $('#identifierId');
  }
  get nextButton() {
    return $('#identifierNext');
  }
  get PasswordField() {
    return $('//*[@name="password"]');
  }

  /**
   * Click first sign in button in Modir App
   */
  clickSignInButton() {
    this.signInButton.click();
  }

  /**
   * Fills Email field with param
   * Param: Email
   */
  fillEmailField(email) {
    const openTabs = browser.getTabIds();
    browser.switchTab(openTabs[1]).pause('3000');

    this.emailInput.setValue(email)
  }

  /**
   * Click Next button in email page
   */
  clickNextButton() {
    this.nextButton.click().pause('3000');
  }

  /**
   * Perform complete login using login page methods
   * Param: Password
   */
  fillPasswordField(password) {
    this.PasswordField.setValue(password);
      super.hitEnter();
      browser.pause('3000');
  }

  //################## Complex methods   ############
  /**
   * Perform complete login using login page methods
   */
  doCompleteLogin(email, password) {
    this.clickSignInButton();
    this.fillEmailField(email);
    this.clickNextButton();
    this.fillPasswordField(password);
  }
}

module.exports = LoginPage;
