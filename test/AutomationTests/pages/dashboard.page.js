const Page = require('./page');

class DashPage extends Page {
  constructor() {
    super()
  }

  open() {
    super.open('')
  }

  //############ Locators ###############
  get headerContainer() {
    return $('#header_container');
  }

  /**
   * documentation
   */
  isHeaderPresent() {
    this.headerContainer;
  }
}
module.exports = DashPage;
