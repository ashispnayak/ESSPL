import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { Storage } from '@ionic/storage';

import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { PlacesListPage } from '../pages/places-list/places-list';
import { AboutPage } from '../pages/about/about';
import { SubscribePage } from '../pages/subscribe/subscribe';
import { ContactPage } from '../pages/contact/contact';
import { MapPage } from '../pages/map/map';

import { UserData } from '../providers/userdata';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.html',
})

export class ESSPL {

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
  { title: 'ESSPL', component: TabsPage, icon: 'calendar' },
  { title: 'Places', component: PlacesListPage,  icon: 'md-globe' },
  { title: 'About', component: AboutPage, icon: 'information-circle' },
  { title: 'Subscribe', component: SubscribePage, icon: 'logo-rss' },    
  { title: 'Cotact', component: ContactPage, icon: 'md-mail' },

  ];
  loggedInPages: PageInterface[] = [
  { title: 'Account', component: AccountPage, icon: 'person' },
  { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
  { title: 'Login', component: LoginPage, icon: 'log-in' },
  
  ];
  rootPage: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    //public storage: Storage,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen
    ) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // Check if the user has already seen the tutorial
    this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => {
      if (hasSeenTutorial === null) {
        console.log(hasSeenTutorial);
        // User has not seen tutorial
        this.rootPage = MapPage;
      }
      else{
        // User has seen tutorial

        this.checkMore();
      }


      
    });


    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    this.listenToLoginEvents();
  }
  checkMore(){

    this.userData.hasLoggedIn().then((hasLoggedIn)=> {
      console.log(hasLoggedIn,'logIn');
      if(hasLoggedIn === 'true'){
        this.rootPage = TabsPage;
      }
      else  {
        //while running in phone
        /*this.rootPage = LoginPage;*/
        //while running in web
        this.rootPage = MapPage;
      }
    })
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });

    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}


