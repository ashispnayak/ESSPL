import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import {HttpModule} from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ESSPL } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Network } from '@ionic-native/network';
//import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { OffersPage } from '../pages/offers/offers';
import { OffersDetailPage } from '../pages/offers-detail/offers-detail';
import { SubscribePage } from '../pages/subscribe/subscribe';
import { SignupPage } from '../pages/signup/signup';
import { ContactPage } from '../pages/contact/contact';
import { PlacesListPage } from '../pages/places-list/places-list';
import { PlacesDetailPage } from '../pages/places-detail/places-detail';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';

import { OffersData } from '../providers/offers-data';
import { UserData } from '../providers/userdata';
import { Utility } from '../providers/utility';
import { SpinnerProvider } from '../providers/spinner/spinner';
import { MapProvider } from '../providers/map/map';
import { ServiceProvider } from '../providers/service/service';

import { Connectivity } from '../services/connectivity';

import firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBl-oMY2Gva1w9j4lA2sC_IUnYr3odMDBI",
    authDomain: "esspl-testing.firebaseapp.com",
    databaseURL: "https://esspl-testing.firebaseio.com",
    projectId: "esspl-testing",
    storageBucket: "esspl-testing.appspot.com",
    messagingSenderId: "57228223183"
  };
  firebase.initializeApp(config);

export function provideStorage() {
 return new Storage({ name: 'esspldb' });
}

@NgModule({
  declarations: [
    ESSPL,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    OffersPage,
    SubscribePage,
    OffersDetailPage,
    SignupPage,
    ContactPage,
    PlacesListPage,
    PlacesDetailPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    AutocompletePage
  ],
  imports: [BrowserModule ,HttpModule,
    IonicModule.forRoot(ESSPL),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ESSPL,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    OffersPage,
    SubscribePage,
    OffersDetailPage,
    SignupPage,
    ContactPage,
    PlacesListPage,
    PlacesDetailPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    AutocompletePage
  ],
  providers: [
    StatusBar,
    Geolocation,
    Firebase,
    SplashScreen,
    Connectivity,
    { provide: Storage, useFactory: provideStorage },
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserData, Utility, OffersData, SpinnerProvider, MapProvider,
    ServiceProvider
    
  ]
})
export class AppModule { }

