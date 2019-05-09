const assert = require('assert');
const expect = require('chai').expect;

const LoginPage = require('../../pages/login.page');
const loginPage = new LoginPage();

const DashPage = require('../../pages/dashboard.page');
const dashPage = new DashPage();

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
