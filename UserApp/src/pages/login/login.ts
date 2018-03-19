import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { GooglePlus } from '@ionic-native/google-plus';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
import{ AngularFireModule } from 'angularfire2';
import { Storage } from '@ionic/storage';
import {AngularFireDatabase} from 'angularfire2/database';

import firebase from 'firebase';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  hide:boolean;
  driverUser:boolean;
  rideUser:boolean;
  arr:any;

  constructor(public navCtrl: NavController, private db:AngularFireDatabase, public storage: Storage,public googleplus:GooglePlus, private loadingController:LoadingController, public http:Http  ) {
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
     
        this.storage.set('name', res.displayName);
        this.storage.set('email', res.email);
        this.storage.set('imageUrl', res.imageUrl);



      loader.present().then(()=>{
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(suc=>{
        if(this.driverUser === true){
        this.db.list("/Drivers/").valueChanges().subscribe(data =>{
          this.arr=data;
          console.log(this.arr);
          

      });
        this.db.list("/Drivers/").push(res.email);
      }
        else if(this.rideUser === true){
          this.db.list("/Users/").valueChanges().subscribe(data =>{
          this.arr=data;
          console.log(this.arr);
          
        });
          this.db.list("/Users/").push(res.email);
        }
      loader.dismiss();
      this.navCtrl.push(TabsPage);
     
     
  })
   }).catch(ns=>{alert("Google Authentication Unsuccessful...")
  })
  });
  
  }
  driver(){
    this.hide=true;
    this.driverUser=true;
    console.log(this.driverUser);
  }
  ride_user(){
    this.hide=true;
    this.rideUser=true;
    console.log(this.rideUser);
  }



}



