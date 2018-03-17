import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker} from '@ionic-native/google-maps';

import { Firebase } from '@ionic-native/firebase';

import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { SpinnerProvider } from '../../providers/spinner/spinner'
import { MapProvider } from '../../providers/map/map';
import { ServiceProvider } from '../../providers/service/service';
import { UserData } from '../../providers/userdata';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-map',
   templateUrl: 'map.html',
 })
 export class MapPage {

   @ViewChild('map') mapElement: ElementRef;
   @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
   @ViewChild('dropsearchbar', { read: ElementRef }) dropsearchbar: ElementRef;
   addressElement: HTMLInputElement = null;
   dropAddressElement: HTMLInputElement = null;

   directionsService = new google.maps.DirectionsService;
   directionsDisplay = new google.maps.DirectionsRenderer;

   map: any;
   address = '';
   origin_address = '';
   destination_address = '';
   place_id = '';
   origin_placeId = '';
   destination_placeId = '';
   public centerMarker :any;

   constructor(public navCtrl: NavController,
     public geolocation: Geolocation,
     public zone: NgZone,
     public platform: Platform,
     public localStorage: Storage,
     public mapService: MapProvider,
     public spinner: SpinnerProvider,
     public viewCtrl: ViewController,
     public navParams: NavParams,
     public firebase: Firebase,
     public serviceProvider: ServiceProvider,
     public userdata: UserData) {
     this.platform.ready().then(() => this.loadMaps());
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad MapPage');
   }

   loadMaps() {

     this.initializeMap();
     this.initAutocomplete();
     this.initAutocompleteDrop();

   }

   initializeMap() {
     console.log("2");
     let that = this;
     that.currentLocation();
     this.zone.run(() => {
       var mapEle = this.mapElement.nativeElement;
       this.map = new google.maps.Map(mapEle, {
         zoom: 16,
         mapTypeControl: false,
         center: { lat: 12.971599, lng: 77.594563 },
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
         disableDoubleClickZoom: false,
         disableDefaultUI: true,
         zoomControl: false,
         scaleControl: true,
       });


       // Map drag started
       this.map.addListener('dragstart', function() {
         console.log('Drag start');
       });
       // Map dragging
       this.map.addListener('drag', function() {
         that.address = 'Searching...';
       });
       //Reload markers every time the map moves
       this.map.addListener('dragend', function() {
         let map_center = that.getMapCenter();
         let latLngObj = {'lat': map_center.lat(), 'long': map_center.lng() };
         console.log(latLngObj);
         try{
           that.getAddress(latLngObj,'ORIGIN');
         }catch(exception){
           console.log(exception + "hauci");
         }
       });

       google.maps.event.addListenerOnce(this.map, 'idle', () => {
         google.maps.event.trigger(this.map, 'resize');
         mapEle.classList.add('show-map');
       });

       google.maps.event.addListener(this.map, 'bounds_changed', () => {
         this.zone.run(() => {
           this.resizeMap();
         });
       });


     });

     //new this.AutocompleteDirectionsHandler(this.map);
     this.directionsDisplay.setMap(this.map);
     this.centerMarker = document.getElementsByClassName("centerMarker"); 
   }

   initAutocomplete(): void {
     console.log("3");
     this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
     this.addressElement.setAttribute("id","origin_address");
     console.log(this.addressElement);
     this.createAutocomplete(this.addressElement,'ORIGIN').subscribe((location) => {
       //console.log('Searchdata' + location.lat());
       let latLngObj = {'lat': location.lat(), 'long': location.lng()};

       this.getAddress(latLngObj,'ORIGIN');
       let options = {
         center: location,
         zoom: 16
       };
       this.map.setOptions(options);
     });
   }

   initAutocompleteDrop(): void {
     console.log("4");
     this.addressElement = this.dropsearchbar.nativeElement.querySelector('.searchbar-input');
     this.addressElement.setAttribute("id","destination_address");
     console.log(this.addressElement);
     this.createAutocomplete(this.addressElement,'DESTINATION').subscribe((location) => {
       //console.log('Searchdata' + location.lat());
       let latLngObj = {'lat': location.lat(), 'long': location.lng()};
       this.getAddress(latLngObj,'DESTINATION');
       let options = {
         center: location,
         zoom: 16
       };
       this.map.setOptions(options);
     });
   }

   currentLocation() {
     console.log("5");
     this.spinner.load();
     this.geolocation.getCurrentPosition().then((position) => {
       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       let latLngObj = {'lat': position.coords.latitude, 'long': position.coords.longitude};
       // Display  Marker
       this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
       this.getAddress(latLngObj,'ORIGIN');
       this.spinner.dismiss();
       localStorage.setItem('current_latlong', JSON.stringify(latLngObj));
       this.getAddress(latLngObj,'ORIGIN');
       return latLngObj;

     }, (err) => {
       console.log(err);
     });
   }

   getAddress(latLngObj, purpose) {
     console.log("6" + purpose);
     // Get the address object based on latLngObj
     var place_id;
     this.mapService.getStreetAddress(latLngObj).subscribe(
       s_address => {
         if (s_address.status == "ZERO_RESULTS") {
           this.mapService.getAddress(latLngObj).subscribe(
             address => {
               this.address = address.results[0].formatted_address;
               place_id = (address.results[0].place_id);
               console.log(place_id);
               this.assignPlaceIds(place_id,purpose,this.address);
               this.getAddressComponentByPlace(address.results[0], latLngObj);
             },
             err => console.log("Error in getting the street address " + err)
             )
         } else {
           this.address = s_address.results[0].formatted_address;
           place_id = (s_address.results[0].place_id);
           console.log(place_id);
           this.assignPlaceIds(place_id,purpose,this.address);
           this.getAddressComponentByPlace(s_address.results[0], latLngObj);
         }

       },
       err => {
         console.log('No Address found ' + err);
       }
       );
   }

   assignPlaceIds(place_id,purpose,address){
     if(place_id != null){
       if(purpose == 'ORIGIN'){
         console.log("originwala");
         //document.getElementById("origin_address").innerText = address;
         this.origin_placeId = place_id;
       }else{
         console.log("destinationwala");
         //document.getElementById("destination_address").innerText = address;
         this.destination_placeId = place_id;
       }
     }else
     console.log("plaeId is null");

     if(this.origin_placeId!='' && this.destination_placeId!='')
       this.bookRide();
   }


   getMapCenter(){
     return this.map.getCenter()
   }

   createAutocomplete(addressEl: HTMLInputElement, purpose: String): Observable<any> {
     console.log("1");
     const autocomplete = new google.maps.places.Autocomplete(addressEl);
     autocomplete.bindTo('bounds', this.map);
     return new Observable((sub: any) => {
       google.maps.event.addListener(autocomplete, 'place_changed', () => {
         const place = autocomplete.getPlace();
         if (!place.geometry) {
           sub.error({
             message: 'Autocomplete returned place with no geometry'
           });
         } else {
           let latLngObj = {'lat': place.geometry.location.lat(), 'long': place.geometry.location.lng()}
           this.getAddress(latLngObj,purpose);
           sub.next(place.geometry.location);
         }
       });
     });
   }

   getAddressComponentByPlace(place, latLngObj) {
     var components;

     components = {};

     for(var i = 0; i < place.address_components.length; i++){
       let ac = place.address_components[i];
       components[ac.types[0]] = ac.long_name;
     }

     let addressObj = {
       street: (components.street_number) ? components.street_number : 'not found',
       area: components.route,
       city: (components.sublocality_level_1) ? components.sublocality_level_1 : components.locality,
       country: (components.administrative_area_level_1) ? components.administrative_area_level_1 : components.political,
       postCode: components.postal_code,
       loc: [latLngObj.long, latLngObj.lat],
       address: this.address
     }
     localStorage.clear();
     localStorage.setItem('carryr_customer', JSON.stringify(addressObj));
     return components;
   }

   resizeMap() {
     setTimeout(() => {
       google.maps.event.trigger(this.map, 'resize');
     }, 200);
   }

   closeModal() {
     this.viewCtrl.dismiss();
   }

   errorAlert(title, message) {
     alert('Error in Alert');
   }

   public  travelMode : any;
   bookRide() {
     console.log("7");
     this.travelMode = 'DRIVING';
     console.log(  this.origin_placeId);
     console.log( this.destination_placeId );

     if(this.origin_placeId == ''){
       alert("Please select pick up point");
       return;
     }

     if(this.destination_placeId == ''){
       alert("Please select drop point");
       return;
     }

     this.directionsService.route({
       origin: {'placeId': this.origin_placeId},
       destination: {'placeId': this.destination_placeId},
       travelMode: this.travelMode
     }, (response, status) => {
       var status2 : any;
       status2 = status;
       if (status2 === 'OK') {
         //hide the center marker
         //        this.centerMarker.visibility = 'hide';
         this.directionsDisplay.setDirections(response);
       } else {
         window.alert('Directions request failed due to ' + status);
       }
     });
   }
   httpGetAsync(theUrl, callback)
   {
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.onreadystatechange = function() { 
       if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
         callback(xmlHttp.responseText);
     }
     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
     xmlHttp.send(null);
   }


   fetchNearByRides(ride){

     Promise.resolve("proceed")
     .then((proceed) => {
       this.userdata.show_loading("Getting Rides");
       return this.serviceProvider.getRidesInformation();;
     }).then((result) => {
       //act as per results of api

       console.log(JSON.stringify(result));
       let rides =  JSON.stringify(result);
       var obj = JSON.parse(rides.toString());
       var carLocation, carName;
       for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                carLocation = (JSON.stringify(obj[key].location));
                carName = (JSON.stringify(obj[key].name));
                console.log(carLocation);
                this.placeRidesOnMap(carLocation,carName);
                break;
            }
        }

       //console.log(obj.car1);


       

       this.userdata.dismiss_loading();
       //return this.api.getMobileStatus(countryId,this.userdata.number);  
     }).catch((error) => {
       console.log("Error registering user" + error);
       console.log(JSON.stringify(error));
       this.userdata.dismiss_loading();
     });


     if(ride == 'RESERVE'){
       //get all the vehicles and show only having locations

     }
   }

   placeRidesOnMap(LatLng,carName){
     console.log(LatLng);
     let latLng = new google.maps.LatLng(LatLng.latitude, LatLng.longitude);

 // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: carName,
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: LatLng.latitude,
              lng: LatLng.longitude
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
   }

   updateRideLocationService(latitude,longitude,carname){

     Promise.resolve("proceed")
     .then((proceed) => {
       let body = {
         "latitude" : latitude,
         "logitude" : longitude
       };
       let values = {
         body : body,
         method : "put"
       };
       return this.serviceProvider.updateRideLocation(carname,values);;
     }).then((result) => {
       //act as per results of api

       console.log(JSON.stringify(result));
     }).catch((error) => {
       console.log("Error updating location of rider" + error);
       console.log(JSON.stringify(error));
     });

   }

   writeRidesData(userId, name, email, imageUrl) {
     this.firebase.getToken()
     .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
     .catch(error => console.error('Error getting token', error));

     this.firebase.onTokenRefresh()
     .subscribe((token: string) => console.log(`Got a new token ${token}`));
   }
 }
