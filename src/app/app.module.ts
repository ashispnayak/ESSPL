import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import{ AngularFireModule } from 'angularfire2';
import { HttpModule } from '@angular/http';
import firebase from 'firebase';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';


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
    MyApp,
    HomePage,
    DashboardPage
  ],
  imports: [
    BrowserModule,
        HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
     GooglePlus
  ]
})
export class AppModule {}
