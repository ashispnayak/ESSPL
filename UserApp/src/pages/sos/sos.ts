import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import { Geolocation } from '@ionic-native/geolocation';



/**
 * Generated class for the SosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sos',
  templateUrl: 'sos.html',
})
export class SosPage {
	long:any;
	lat:any;

  constructor(public navCtrl: NavController,     public geolocation: Geolocation,
 public api:ApiProvider, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SosPage');
  }
  sendSOS(){
  	 let alert = this.alertCtrl.create({
            title: 'ESSPL Travel',
            subTitle: 'Are You sure to send SOS Messages?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                       
                        this.getUserPosition();
                    
                    }
                },
                {
                    text: 'Cancel',
                    handler: () => {
                       
                    
                }
            }
            ]
        });
        alert.present();
  }
  getUserPosition(){
  	this.geolocation.getCurrentPosition().then((position) => {
  		this.lat = position.coords.latitude;
  		this.long = position.coords.longitude;
    
  	this.api.sendSosNotifications(this.long,this.lat).subscribe(response => {
            console.log(response);
        })

  })


}
}
