const Page = require('./page');

class DashPage extends Page {
  constructor() {
    super()
  }

  open() {
    super.open('')
  }

  //############ Locators ###############
  get modusLandHeader() {
    return $(".//*[@class='styles_globeTitle__19Kwx']");
  }

  /**
   * documentation
   */
  isModusLandHeaderPresent() {
    this.modusLandHeader.isExisting();
  }
}
module.exports = DashPage;
