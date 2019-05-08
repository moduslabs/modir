const Page = require('./page');

class DashPage extends Page {

  constructor() {
    super()
  }

  open() {
    super.open('/')
  }

  /**############ Define Elements ###############*/
  static modusLandHeader() {return $("//*[@class='styles_globeTitle__19Kwx']");}

  static searchInput() {return $("//*[@class='styles_searchbarWrap__1dUb9']");}

  static teambutton() {return $("//*[@class='styles_tabCt__1Cr-H']//a[1]");}

  static projectsButton() {return $("//*[@class='styles_tabCt__1Cr-H']//a[2]");}

  /**
   * Checks if the modus land header is present in the page
   */
  isModusLandHeaderPresent() {
    this.modusLandHeader.isExisting();
  }
}
module.exports = DashPage;
