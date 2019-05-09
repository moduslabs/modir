const assert = require('assert');
const expect = require('chai').expect;

const LoginPage = require('../../pages/login.page');
const loginPage = new LoginPage();

const DashPage = require('../../pages/dashboard.page');
const dashPage = new DashPage();

const ProjectsPage = require('../../pages/projects.page');
const projectsPage = new ProjectsPage();

const ModiteProfilePage = require('../../pages/moditeProfile.page');
const moditeProfilePage = new ModiteProfilePage();

    describe('Dashboard UI TESTS', () => {
        beforeEach(function() {
            loginPage.open();
            loginPage.doCompleteLogin('user@moduscreate.com', 'password');
        });

        it('should have the right title', () => {
            assert.equal(loginPage.getTitle(), 'Modite Directory');
        });

        it('should have the search field present', () => {
            expect(dashPage.isSearchInputPresent());
        });

        it('should have the Team button present', () => {
            expect(dashPage.isTeamButtonPresent());
        });

        it('should have Projects button present', () => {
            expect(dashPage.isProjectsButtonPresent());
        })
    });

    describe('Dashboard Functional Tests', () => {
        beforeEach(function() {
            loginPage.open();
            loginPage.doCompleteLogin('user@moduscreate.com', 'password');
        });

        it('should be able to navigate to Projects Page', () => {
            dashPage.clickProjectsButton();
            expect(projectsPage.isProjectListPresent());
        });

        it('should be able to search a modite', () => {
            dashPage.fillsInputModites("Clayton Dog");

            expect(dashPage.resultListIsEmpty())to.equal(false);
        });

        it('should be able to navigate to modite profile page', () => {
            dashPage.fillsInputModites("Clayton Dog");
            dashPage.clickFirstModiteFromList();

            expect(moditeProfilePage.areAllUIElementsPresent());
        });

        it('should NOT be able to see any result', () => {
            dashPage.fillsInputModites("NoExistingModite");

            expect(dashPage.resultListIsEmpty());
        });
});
