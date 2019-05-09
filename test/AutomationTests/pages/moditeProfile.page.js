const Page = require('./page');

class ModiteProfilePage extends Page {

    constructor() {
        super()
    }

    open() {
        super.open('/')
    }


    /**############ Define Elements ###############*/
    static moditeName() {return $("//*[@class='styles_name__875Hr']");}
    static moditeLocation() {return $("//*[@class='styles_location__2Pe5l']");}
    static moditeTodWrap() {return $("//*[@class='styles_todWrap__1juP8']");}
    static moditeFormalTittle() {return $("//*[@class='styles_fieldTitle__1pXDj']");}
    static moditeLongDescription() {return $("//*[@clas='styles_title__3uWQE']");}
    static moditeTacoIcon(){return $("//*[@class='styles_taco__1R96S']");}

    //#############  Verification actions ####################

    /**
     * Checks if modite Name is present on the page
     */
    isModiteNamePresent(){
        this.moditeName.waitForExist();
    }

    /**
     * Checks if modite Location is present on the page
     */
    isModiteLocationPresent(){
        this.moditeLocation.waitForExist();
    }


    /**
     * Checks if modite todWrap is present on the page
     */
    isModiteTodWrapPresent(){
        this.moditeTodWrap.waitForExist();
    }

    /**
     * Checks if modite Formal Tittle is present on the page
     */
    isModiteFormalTittlePresent(){
        this.moditeFormalTittle.waitForExist();
    }

    /**
     * Checks if modite LongDescription is present on the page
     */
    isModiteLongDescriptionPresent(){
        this.moditeLongDescription.waitForExist();
    }

    /**
     * Checks is modite tacos icon is present on the page
     */
    isModiteTacoPresent(){
        this.moditeTacoIcon.waitForExist();
    }


    /**
     * Checks if All UI elements are present on the page
     */
    areAllUIElementsPresent(){
        this.isModiteNamePresent();
        this.isModiteLocationPresent();
        this.isModiteTodWrapPresent();
        this.isModiteFormalTittlePresent();
        this.isModiteLongDescriptionPresent();
        this.isModiteTacoPresent();
    }

}
module.exports = ModiteProfilePage;