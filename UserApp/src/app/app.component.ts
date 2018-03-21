import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, App, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { Storage } from '@ionic/storage';
import {OneSignal} from '@ionic-native/onesignal';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { PlacesListPage } from '../pages/places-list/places-list';
import { AboutPage } from '../pages/about/about';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { SubscribePage } from '../pages/subscribe/subscribe';
import { ContactPage } from '../pages/contact/contact';
import { VictimlocationPage } from '../pages/victimlocation/victimlocation';
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
    { title: 'Contact', component: ContactPage, icon: 'md-mail' },
    
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', component: AccountPage, icon: 'person' },
    { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
  
  ];
  rootPage: any;
  notif:any;
 

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    //public storage: Storage,
    public app: App,
    public androidPermissions: AndroidPermissions,
    public onesignal: OneSignal,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen
  ) {
    
    // Call any initial plugins when ready
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
       
        var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
     this.userData.setValue("userNumber","7504429196");
    this.userData.setValue("userRating","4.1");
    this.userData.setValue("userStatus","Searching"); //Searching or Riding or Unavailable
    this.userData.setValue("userRideType","SHARE");

    window["plugins"].OneSignal
      .startInit("d19097c8-aa4f-4eeb-86d7-f79a56a32630", "691458927450")
     
      });
    this.onesignal.inFocusDisplaying(onesignal.OSInFocusDisplayOption.InAppAlert);


      // Retrieve the OneSignal user id and the device token
      this.onesignal.getIds()
      .then((ids) =>
      {
         console.log('getIds: ' + JSON.stringify(ids));
      });


      // When a push notification is received handle
      // how the application will respond
      this.onesignal.handleNotificationReceived()
      .subscribe((msg) =>
      {
        this.notif = true;
         // Log data received from the push notification service
         console.log('Notification received');
         console.dir(msg);
      });


      // When a push notification is opened by the user
      // handle how the application will respond
      this.onesignal.handleNotificationOpened()
      .subscribe((msg) =>
      {
        if(this.notif === true){
         // Log data received from the push notification service
          let payload = msg;
        console.log("hiiii");
      console.log(payload);
      this.redirectToPage(payload);
    }
      });



      // End plugin initialisation
      this.onesignal.endInit();


    // Check if the user has already seen the tutorial
    this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => {
      if (hasSeenTutorial === null) {
        console.log(hasSeenTutorial);
        // User has not seen tutorial
        this.rootPage = TutorialPage;
       

      }
      else{
                // User has seen tutorial
                
                this.rootPage = TutorialPage;
       // this.checkMore();
      }
    
     
      
    });


    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    this.listenToLoginEvents();
  }

  askForPermissions(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  result => console.log('Has permission?',result.hasPermission),
  err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
  );

  this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.GET_ACCOUNTS, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
  }

  redirectToPage(data){
     let type
    try {
      type = data.notification.payload.additionalData.root;
    } catch (e) {
      console.warn(e);
    }
    switch (type) {
      case 'victimLocation': {
        let list: any[] = [data.notification.payload.additionalData.lat,data.notification.payload.additionalData.long];
        this.app.getActiveNav().push(VictimlocationPage, list);
        break;
      } 
    }

  }
  checkMore(){

        this.userData.hasLoggedIn().then((hasLoggedIn)=> {
          console.log(hasLoggedIn,'logIn');
          if(hasLoggedIn === 'true'){
            this.rootPage = TabsPage;
          }
           else  {
        this.rootPage = LoginPage;
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


