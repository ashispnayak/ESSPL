var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Storage } from '@ionic/storage';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { PlacesListPage } from '../pages/places-list/places-list';
import { AboutPage } from '../pages/about/about';
import { SubscribePage } from '../pages/subscribe/subscribe';
import { ContactPage } from '../pages/contact/contact';
import { UserData } from '../providers/userdata';
var ESSPL = (function () {
    function ESSPL(events, userData, menu, platform, 
        //public storage: Storage,
        statusBar, splashScreen) {
        var _this = this;
        this.events = events;
        this.userData = userData;
        this.menu = menu;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        // List of pages that can be navigated to from the left menu
        // the left menu only works after login
        // the login page disables the left menu
        this.appPages = [
            { title: 'ESSPL', component: TabsPage, icon: 'calendar' },
            { title: 'Places', component: PlacesListPage, icon: 'md-globe' },
            { title: 'About', component: AboutPage, icon: 'information-circle' },
            { title: 'Subscribe', component: SubscribePage, icon: 'logo-rss' },
            { title: 'Cotact', component: ContactPage, icon: 'md-mail' },
        ];
        this.loggedInPages = [
            { title: 'Account', component: AccountPage, icon: 'person' },
            { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
        ];
        this.loggedOutPages = [
            { title: 'Login', component: LoginPage, icon: 'log-in' },
            { title: 'Signup', component: SignupPage, icon: 'person-add' }
        ];
        // Call any initial plugins when ready
        platform.ready().then(function () {
            statusBar.styleDefault();
            splashScreen.hide();
        });
        // Check if the user has already seen the tutorial
        this.userData.checkHasSeenTutorial().then(function (hasSeenTutorial) {
            if (hasSeenTutorial === null) {
                // User has not seen tutorial
                _this.rootPage = TutorialPage;
            }
            else {
                // User has seen tutorial
                _this.rootPage = TabsPage;
            }
        });
        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then(function (hasLoggedIn) {
            _this.enableMenu(hasLoggedIn === true);
        });
        this.listenToLoginEvents();
    }
    ESSPL.prototype.openPage = function (page) {
        var _this = this;
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index });
        }
        else {
            this.nav.setRoot(page.component).catch(function () {
                console.log("Didn't set nav root");
            });
        }
        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            setTimeout(function () {
                _this.userData.logout();
            }, 1000);
        }
    };
    ESSPL.prototype.openTutorial = function () {
        this.nav.setRoot(TutorialPage);
    };
    ESSPL.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.enableMenu(true);
        });
        this.events.subscribe('user:signup', function () {
            _this.enableMenu(true);
        });
        this.events.subscribe('user:logout', function () {
            _this.enableMenu(false);
        });
    };
    ESSPL.prototype.enableMenu = function (loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    };
    return ESSPL;
}());
__decorate([
    ViewChild(Nav),
    __metadata("design:type", Nav)
], ESSPL.prototype, "nav", void 0);
ESSPL = __decorate([
    Component({
        templateUrl: 'app.html',
    }),
    __metadata("design:paramtypes", [Events,
        UserData,
        MenuController,
        Platform,
        StatusBar,
        SplashScreen])
], ESSPL);
export { ESSPL };
//# sourceMappingURL=app.component.js.map