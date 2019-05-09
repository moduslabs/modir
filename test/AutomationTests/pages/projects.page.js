const Page = require('./page');

class projectsPage extends Page {

    constructor() {
        super()
    }

    open() {
        super.open('/projects')
    }

    /**############ Define Elements ###############*/
    static projectList() {return $("//div[@class='styles_nameCt__1O5NB']");}
    static projectModal() {return $("//div[@class='styles_moditeCt__Tp4wX']");}

    //#############  Verification actions ####################
    /**
     * Checks if the project list is present on the page
     */
    isProjectListPresent() {
        this.projectList.isExisting();
    }

    /**
     * Checks if the project Modal with project information is being displayed
     */
    isProjectModalDisplayed() {
        this.projectModal.isExisting();
    }

}
module.exports = projectsPage;
