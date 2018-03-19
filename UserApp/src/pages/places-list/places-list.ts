import { Component } from '@angular/core';

import { ActionSheet, App, NavController } from 'ionic-angular';
// import { InAppBrowser } from 'ionic-native';

import { PlacesDetailPage } from '../places-detail/places-detail';


@Component({
  selector: 'page-places-list',
  templateUrl: 'places-list.html'
})
export class PlacesListPage {
  actionSheet: ActionSheet;
  speakers = [];

  constructor(public app: App, public navCtrl: NavController) {}

  ionViewDidLoad() {
  }

  goToDetail(item) {
   this.navCtrl.push(PlacesDetailPage, item);
  } 
  
}
