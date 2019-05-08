const Page = require('./page')

class DashPage extends Page {
  constructor() {
    super()
  }

  open() {
    super.open('')
  }

  //############ Locators ###############
  get header() {
    return $('#header_container')
  }

  /**
   * documentation
   */
  isHeaderPresent() {
    console.log('12')
    this.header.click()
  }
}
module.exports = DashPage
