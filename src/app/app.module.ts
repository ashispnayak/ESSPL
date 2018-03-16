import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ESSPL } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { OffersPage } from '../pages/offers/offers';
import { OffersDetailPage } from '../pages/offers-detail/offers-detail';
import { SubscribePage } from '../pages/subscribe/subscribe';
import { GooglePlus } from '@ionic-native/google-plus';
import{ AngularFireModule } from 'angularfire2';
import { ContactPage } from '../pages/contact/contact';
import { PlacesListPage } from '../pages/places-list/places-list';
import { PlacesDetailPage } from '../pages/places-detail/places-detail';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';

import { OffersData } from '../providers/offers-data';
import { UserData } from '../providers/user-data';
import { Utility } from '../providers/utility';
import { SpinnerProvider } from '../providers/spinner/spinner';
import { MapProvider } from '../providers/map/map';
export const firebaseConfig={
   apiKey: "AIzaSyBrBaAvyALhPRjfg41qCf5isMMyaffIebE",
    authDomain: "esspl-c3a5b.firebaseapp.com",
    databaseURL: "https://esspl-c3a5b.firebaseio.com",
    projectId: "esspl-c3a5b",
    storageBucket: "esspl-c3a5b.appspot.com",
    messagingSenderId: "691458927450"
}
firebase.initializeApp(firebaseConfig)

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
    IonicStorageModule.forRoot(),
     AngularFireModule.initializeApp(firebaseConfig)
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
    GooglePlus,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserData, Utility, OffersData, SpinnerProvider, MapProvider
    
  ]
})
export class AppModule { }

