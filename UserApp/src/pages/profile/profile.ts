import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

	displayImage:any;
	displayName:any;
	displayEmail:any;
  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams) {
  	
  	 this.storage.get('imageUrl').then((val) => {
    this.displayImage = val;
  });
  	  this.storage.get('name').then((val) => {
    this.displayName = val;
  });
  	   this.storage.get('email').then((val) => {
    this.displayEmail = val;
  });
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
