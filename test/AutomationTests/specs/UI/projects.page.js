const Page = require('./page');

class projectsPage extends Page {

    constructor() {
        super()
    }

    open() {
        super.open('/projects')
    }

    /**############ Define Elements ###############*/
    static ProjectList() {return $("#todo");}


    //#############  Verification actions ####################
    /**
     * Checks if the project list is present on the page
     */
    isProjectListPresent() {
        this.ProjectList.isExisting();
    }

}
module.exports = projectsPage;
