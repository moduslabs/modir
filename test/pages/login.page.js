const Page = require('./page')

class LoginPage extends Page {
  constructor() {
    super()
  }
  //############ Locators ###############
  get signInButton() {
    return $('.abcRioButton')
  }
  get emailInput() {
    return $('#identifierId')
  }
  get nextButton() {
    return $('#identifierNext')
  }
  get PasswordField() {
    return $('//*[@name="password"]')
  }
  get passwordNextButton() {
    return $('#passwordNext')
  }

  open() {
    super.open('')
  }

  clickSignInButton() {
    this.signInButton.click()
  }

  fillEmailField(email) {
    const openTabs = browser.getTabIds()
    browser.switchTab(openTabs[1]).pause('3000')

    this.emailInput.setValue(email)
  }

  clickNextButton() {
    this.nextButton.click().pause('6000')
  }

  fillPasswordField(password) {
    //browser.debug()
    this.PasswordField.setValue(password)
  }

  //Clicks sign in button
  clickButtonPasswordNext() {
    this.passwordNextButton.click
  }

  //#######Complex methods############

  /**
   * Perform complete login using login page methods
   *
   */
  doCompleteLogin(email, password) {
    this.clickSignInButton()
    this.fillEmailField(email)
    this.clickNextButton()
    this.fillPasswordField(password)
    this.clickButtonPasswordNext()
  }
}

module.exports = LoginPage
