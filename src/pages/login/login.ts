import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { GooglePlus } from '@ionic-native/google-plus';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
import{ AngularFireModule } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { UserData } from '../../providers/userdata';

import firebase from 'firebase';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  displayName: any;
  email: any;
  imageUrl: any;
  hide:boolean;
  driverUser:boolean;
  rideUser:boolean;

  constructor(public navCtrl: NavController, public storage: Storage,
    public googleplus:GooglePlus, private loadingController:LoadingController,
    public http:Http, public userdata:UserData ) {
    this.driverUser=false;
    this.rideUser=false;
  }


      

  login(): void {
   
 // let headers = new Headers();
     //   headers.append('Content-Type','application/json');
  let loader = this.loadingController.create({
    content: 'Authenticating Google...',
  });
 
  
   
   this.googleplus.login({ 
      'webClientId': '691458927450-vuvkt752d0bs5p1bpe9qi01ouvjli8vm.apps.googleusercontent.com',
      'scopes': '',
       'offline':true


    }).then(res=>
    
    {
      this.displayName = res.displayName;
        this.email = res.email;
        this.imageUrl = res.imageUrl;
      loader.present().then(()=>{
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(suc=>{
      loader.dismiss();
      this.navCtrl.push(TabsPage);
     
     
  })
   }).catch(ns=>{alert("Google Authentication Unsuccessful...")
  })
  });
  
  }
  userType(type){
    this.hide=true;
    this.userdata.userType = type;
    this.storage.set("userType",type);
  }



}



