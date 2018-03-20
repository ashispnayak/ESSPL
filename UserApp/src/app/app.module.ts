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
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker} from '@ionic-native/google-maps';
//import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
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
import { RideDetailModalPage } from '../pages/ride-detail-modal/ride-detail-modal';

import { OffersData } from '../providers/offers-data';
import { UserData } from '../providers/userdata';
import { Utility } from '../providers/utility';
import { SpinnerProvider } from '../providers/spinner/spinner';
import { MapProvider } from '../providers/map/map';

import { ServiceProvider } from '../providers/service/service';

import { Connectivity } from '../services/connectivity';


export function provideStorage() {
 return new Storage({ name: 'esspldb' });
}

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
    AutocompletePage,
    RideDetailModalPage
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
    AutocompletePage,
    RideDetailModalPage
  ],
  providers: [
    StatusBar,
    Geolocation,
    Firebase,
    GooglePlus,
    SplashScreen,
    Connectivity,
    { provide: Storage, useFactory: provideStorage },
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserData, Utility, OffersData, SpinnerProvider, MapProvider,
    ServiceProvider,
    GoogleMaps
  ]
})
export class AppModule { }

