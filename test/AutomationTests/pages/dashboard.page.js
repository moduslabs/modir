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

  static emptyResultList() {return $("//*[@class='item ion-focusable hydrated item-label']");}

  static firstModiteFromResultList(){return $("//*[@class='styles_nameCt__1O5NB'][1]")}


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
     * Checks if the little team button is present at the bottom of the page
     */
    isTeamButtonPresent() {
        this.teamButton.isExisting();
    }

    /**
     * Checks if the little projects button is present at the bottom of the page
     */
    isProjectsButtonPresent() {
        this.projectsButton.isExisting();
    }

    /**
     * Checks if the result list is returning NO results
     */
    resultListIsEmpty(){
        this.emptyResultList.waitForExist();
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

    /**
     * Clicks first modite on the list of results
     */
    clickFirstModiteFromList(){
        this.firstModiteFromResultList.click();
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
