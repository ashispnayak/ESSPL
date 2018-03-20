import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserData } from '../../providers/userdata';


/**
 * Generated class for the RideDeatilModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
   selector: 'page-ride-detail-modal',
   templateUrl: 'ride-detail-modal.html',
 })
 export class RideDetailModalPage {

   public rideInformation : any;
   public rideRate : string;
   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public view: ViewController,
     public userdata: UserData) {

     this.rideInformation = navParams.get('data');
     this.userdata.distance = (this.rideInformation.distance/1000).toFixed(2) + " km";
     let date = new Date(null);
     date.setSeconds(this.rideInformation.time); // specify value for SECONDS here
     console.log(date.toISOString());
     let result = date.toISOString().substr(14, 2);
     this.userdata.eta = result + " mins";
     console.log(typeof this.rideInformation.rate);
     let expense : number;
     expense = this.rideInformation.rate;
     console.log(((this.rideInformation.rate)), parseInt((this.rideInformation.rate)),expense, parseInt(this.userdata.distance));
     //let expense = parseInt(this.userdata.distance) *  parseInt(this.rideInformation.rate);
     this.userdata.rideExpense = "₹ " + parseInt(this.userdata.distance) * this.userdata.autoRate;

   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad RideDeatilModalPage');
   }

   dismissModal(purpose){
     console.log("clickedss");
     if(purpose)
       this.view.dismiss('confirmed');
     else
       this.view.dismiss('cancelled');
   }

 }
