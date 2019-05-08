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

  static searchModitesInput() {return $("//*[@class='styles_searchbarWrap__1dUb9']");}

  static teamButton() {return $("//*[@class='styles_tabCt__1Cr-H']//a[1]");}

  static projectsButton() {return $("//*[@class='styles_tabCt__1Cr-H']//a[2]");}



    //#############  Verification actions ####################
    /**
     * Checks if the modus land header is present in the page
     */
    isModusLandHeaderPresent() {
        this.modusLandHeader.isExisting();
    }

    /**
     * Checks if the Search modites input is present on the page
     */
    isSearchInputPresent() {
        this.searchModitesInput.isExisting();
    }

    /**
     * Checks if the team button at the bottom of the page is present
     */
    isModusLandHeaderPresent() {
        this.teamButton.isExisting();
    }

    //#############  Clicking Actions ####################
    /**
     * Clicks little team button in dashboard at the bottom of the page
     */
    clickTeamButton() {
        this.teamButton.click();
    }

    /**
     * Clicks little projects button at the bottom of the page
     */
    clickProjectsButton(){
        this.projectsButton.click();
    }

    //#############  Filling Actions ####################
    /**
     * Fills input modites
     */
    fillsInputModites(value){
        this.searchModitesInput.setValue(value)
    }
}
module.exports = DashPage;
