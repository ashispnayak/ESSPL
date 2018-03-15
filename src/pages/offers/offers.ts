import { Component } from '@angular/core';

import {ActionSheet, ActionSheetController, AlertController, App, ModalController, NavController } from 'ionic-angular';

// import moment from 'moment';

import { OffersDetailPage } from '../offers-detail/offers-detail';
import {AutocompletePage} from '../autocomplete/autocomplete';

import { OffersData } from '../../providers/offers-data';
import { UserData } from '../../providers/user-data';
import { Utility } from '../../providers/utility';



@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html'
})
export class OffersPage {

  offers = [];
  address;
  actionSheet: ActionSheet;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public offersData: OffersData,
    public user: UserData,
    public utility: Utility,
    public actionSheetCtrl: ActionSheetController
  ) {

    this.address = {
      place:{
        desc: '',
        lat: '',
        lng: ''
      } 
    };
  }

  ionViewDidLoad() {
    this.app.setTitle('Offers');    
    this.updateHangout();
  }

  updateHangout() {
    //Show loading
    var loading = this.utility.getLoader();
    loading.present();

    this.offersData.getOffers().subscribe(data => {
      this.offers = data;

      //Hide loading
      setTimeout(function(){
        loading.dismiss();
      },1000);

    });
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      if(data == undefined) return;
      this.address.place = data;
      this.updateHangout();

    });
    modal.present();
  }

  goToDetail(item) {
    let nav = this.app.getRootNav();
    nav.push(OffersDetailPage, item);
  } 

   openShare(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + "TEST",
      buttons: [
        {
          text: 'Copy Link',
          handler: ($event) => {
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + "TEST");
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }
}
