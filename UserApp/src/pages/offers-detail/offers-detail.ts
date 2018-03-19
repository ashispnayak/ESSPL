import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-offers-detail',
  templateUrl: 'offers-detail.html'
})
export class OffersDetailPage {
  offer: any;

  constructor(public navParams: NavParams) {
    this.offer = navParams.data;
  }
}
