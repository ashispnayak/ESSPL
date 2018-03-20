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

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public view: ViewController,
  	public userdata: UserData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RideDeatilModalPage');
  }

  dismiss(){
  	this.view.dismiss();
  }

}
