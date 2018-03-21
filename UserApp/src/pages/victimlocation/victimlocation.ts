import { Component ,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var google;


/**
 * Generated class for the VictimlocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-victimlocation',
  templateUrl: 'victimlocation.html',
})
export class VictimlocationPage {
	@ViewChild('map') mapElement: ElementRef;
	map:any;
	navData:any;
	lat:any;
	long:any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.navData = this.navParams.data;
  	this.lat = this.navData[0];
  	this.long = this.navData[1];

  }

  ionViewDidLoad(){
    this.loadMap();
  }
      loadMap(){
 
    let latLng = new google.maps.LatLng(this.lat, this.long);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var marker = new google.maps.Marker({ position: latLng, map: this.map, title: 'Victim Location!'});
 
  }

}
