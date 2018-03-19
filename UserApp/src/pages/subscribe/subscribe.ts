import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Utility } from '../../providers/utility';

@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html'
})
export class SubscribePage {
  
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public utility: Utility,
  ) {
    
  }

  subscribe(){
    //Show loading
    var loading = this.utility.getLoader();
    loading.present();

    //Hide loading
      setTimeout(function(){
        loading.dismiss();
      },1000);

  }
}
