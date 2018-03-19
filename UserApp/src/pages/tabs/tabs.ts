import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams } from 'ionic-angular';

import { MapPage } from '../map/map';
import { OffersPage } from '../offers/offers';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = MapPage;
  tab2Root: any = OffersPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams, public storage: Storage) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
        

  }
  

}
