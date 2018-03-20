import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, ActionSheetController, ModalController, ModalOptions  } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker} from '@ionic-native/google-maps';

import { Firebase } from '@ionic-native/firebase';

import { Observable } from 'rxjs/Observable';
import { SpinnerProvider } from '../../providers/spinner/spinner'
import { MapProvider } from '../../providers/map/map';
import { ServiceProvider } from '../../providers/service/service';
import { UserData } from '../../providers/userdata';
import { RideDetailModalPage } from '../ride-detail-modal/ride-detail-modal';

declare var google;


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

   map2: GoogleMap;
   map: any;
   marker: any;
   address = '';
   origin_address = '';
   destination_address = '';
   place_id = '';
   origin_placeId = '';
   destination_placeId = '';
   origin_latitude = '';
   origin_longitude = '';
   destination_latitude = '';
   destination_longitude = '';
   public centerMarker :any;
   public driverInformation :any;

   public idealMiniCar : any;
   public idealSuvCar : any;
   public idealAuto : any;

   public distancesOfDrivers = [];
   public durationOfDrivers = [];

   public autoIdeal = {
     time : 1000, //in mins
     number : 0,
     distance : 0, //in meters
     rate : 0,
     numberOfVehicles : 0
   };
   public suvIdeal = {
     time : 1000,
     number : 0,
     distance : 0,
     rate : 0,
     numberOfVehicles : 0

   };
   public miniCarIdeal = {
     time : 1000,
     number : 0,
     distance : 0,
     rate : 0,
     numberOfVehicles : 0

   };

   public routeDistance : string;
   public routeTime : any;

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
     public userdata: UserData,
     public storage: Storage,
     public actionSheetCtrl: ActionSheetController,
     public modalCtrl: ModalController) {
     this.platform.ready().then(() => this.loadMaps());
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad MapPage');
     //this.loadMap();
   }

   loadMaps() {
     this.storage.set('hasLoggedIn', 'true');
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
         zoom: 14,
         mapTypeControl: false,
         center: { lat: 12.971599, lng: 77.594563 },
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
         disableDoubleClickZoom: false,
         disableDefaultUI: true,
         zoomControl: false,
         scaleControl: true,
       });

       // let CentralPark = new google.maps.LatLng(parseFloat("20.296139201680244"),parseFloat("85.82539810688479"));
       // console.log(CentralPark.toString);
       // let marker = new google.maps.Marker({
         //   position: CentralPark,
         //   map: this.map
         // });

         // console.log(marker.getMap);
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
           // try{
             //   that.getAddress(latLngObj,'ORIGIN');
             // }catch(exception){
               //   console.log(exception + "hauci");
               // }
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

     //update user location every 15 seconds
     this.updateRiderLocationService();
     //get all the riders nearby
     this.fetchNearByRides('RESERVE');
   }

   initAutocomplete(): void {
     //console.log("3");
     this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
     this.addressElement.setAttribute("id","origin_address");
     //console.log(this.addressElement);
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
     //console.log("4");
     this.addressElement = this.dropsearchbar.nativeElement.querySelector('.searchbar-input');
     this.addressElement.setAttribute("id","destination_address");
     //console.log(this.addressElement);
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

     this.spinner.load();
     this.geolocation.getCurrentPosition().then((position) => {
       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       let latLngObj = {'lat': position.coords.latitude, 'long': position.coords.longitude};
       // Display  Marker
       this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
       this.getAddress(latLngObj,'ORIGIN');
       localStorage.setItem('current_latlong', JSON.stringify(latLngObj));
       this.spinner.dismiss();
       return latLngObj;

     }, (err) => {
       console.log(err);
     });
   }

   getCurrentLocation(): Promise<any> {
     // this.userdata.show_loading("Searching You...");
     return new Promise((resolve, reject) => {
       this.geolocation.getCurrentPosition()
       .then((position) => {
         let latLngObj = {'lat': position.coords.latitude, 'long': position.coords.longitude};
         // this.userdata.dismiss_loading();
         resolve(latLngObj);
       }, (error) => {
         reject(error);
       });
     });
   }



   getAddress(latLngObj, purpose) {
     console.log("6" + purpose);
     // Get the address object based on latLngObj
     var place_id;
     let location: any;
     this.mapService.getStreetAddress(latLngObj).subscribe(
       s_address => {
         if (s_address.status == "ZERO_RESULTS") {
           this.mapService.getAddress(latLngObj).subscribe(
             address => {
               this.address = address.results[0].formatted_address;
               place_id = (address.results[0].place_id);
               location = (address.results[0].geometry.location);
               console.log(address.results[0].geometry.location);
               console.log("44");
               this.assignPlaceIds(place_id,purpose,this.address,location);
               this.getAddressComponentByPlace(address.results[0], latLngObj);
             },
             err => console.log("Error in getting the street address " + err)
             )
         } else {
           this.address = s_address.results[0].formatted_address;
           place_id = (s_address.results[0].place_id);
           location = (s_address.results[0].geometry.location);
           console.log("45");
           this.assignPlaceIds(place_id,purpose,this.address,location);
           this.getAddressComponentByPlace(s_address.results[0], latLngObj);
         }

       },
       err => {
         console.log('No Address found ' + err);
       }
       );
   }

   assignPlaceIds(place_id,purpose,address,location){
     console.log("called");
     if(place_id != null){
       if(purpose == 'ORIGIN'){
         console.log("originwala",location);
         //document.getElementById("origin_address").innerText = address;
         this.origin_placeId = place_id;
         this.origin_latitude = location.lat;
         this.origin_longitude = location.lng;
         this.checkDriversInformation(this.origin_latitude,this.origin_longitude);
         //this.calculateDistanceOfDrivers(this.origin_latitude,this.origin_longitude);
       }else{
         console.log("destinationwala");
         //document.getElementById("destination_address").innerText = address;
         this.destination_latitude = location.lat;
         this.destination_longitude = location.lng;
         this.destination_placeId = place_id;
       }
     }else
     console.log("plaeId is null");

     if(this.origin_placeId!='' && this.destination_placeId!='')
       this.ridePath();
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
   ridePath() {
     console.log("7");
     this.travelMode = 'DRIVING';
     console.log(this.origin_placeId);
     console.log(this.destination_placeId );

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
         console.log(JSON.stringify(response));
         this.routeDistance = response.routes[0].legs[0].distance.value;
         this.routeTime = response.routes[0].legs[0].duration.value;
         console.log(this.routeDistance,this.routeTime );
         this.directionsDisplay.setDirections(response);
       } else {
         //window.alert('Directions request failed due to ' + status);
         this.userdata.pop_alert("No Routes Found!","Sorry, we are unable to find any routes",['Ok']);
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
     console.log(this.origin_latitude,this.origin_longitude,"eita");
     Promise.resolve("proceed")
     .then((proceed) => {
       this.userdata.show_loading("Getting Nearby Rides");
       return this.serviceProvider.getRidesInformation();;
     }).then((result) => {

       //console.log(JSON.stringify(result));
       let drivers =  JSON.stringify(result);
       var obj = JSON.parse(drivers.toString());
       var carLocation, carName, carNumber, carRate, carVehicle, i=0, type;
       let latitude : any, longitude: any;
       for (var key in obj) {
         if (obj.hasOwnProperty(key)) {

           carName = (JSON.stringify(obj[key].name));
           latitude = (JSON.stringify(obj[key].location.latitude));
           longitude = (JSON.stringify(obj[key].location.longitude));
           type = (JSON.stringify(obj[key].type));
           carNumber = (JSON.stringify(obj[key].number));
           carRate = (JSON.stringify(obj[key].rate));
           carVehicle = (JSON.stringify(obj[key].vehicle));

           setTimeout(this.placeRidesOnMap(latitude,longitude,carName), i++ * 500);
         }
       }

       this.userdata.dismiss_loading();
       this.driverInformation = obj;
     }).then((proceed) => {
       //this.userdata.show_loading("Getting Nearby Rides");
       //return this.serviceProvider.getRidesInformation();;
     }).catch((error) => {
       console.log("Error registering user" + error);
       console.log(JSON.stringify(error));
       this.userdata.dismiss_loading();
     });


     if(ride == 'RESERVE'){
       //get all the vehicles and show only having locations

     }
   }

   placeRidesOnMap(latitude,longitude,carName){
     let location = new google.maps.LatLng((latitude),(longitude));
     var image = '../../assets/img/reservecar.png';
     this.marker = new google.maps.Marker({
       position: location,
       map: this.map,
       title: carName,
       draggable: true,
       animation: google.maps.Animation.BOUNCE,
       icon: image
     });

     //this.marker.addListener('click', this.toggleBounce);
     //console.log(marker.getMap);
   }
   toggleBounce() {
     if (this.marker.getAnimation() !== null) {
       this.marker.setAnimation(null);
     } else {
       this.marker.setAnimation(google.maps.Animation.BOUNCE);
     }
   }

   updateDriverLocationService(latitude,longitude,driverNumber){

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
       return this.serviceProvider.updateDriverLocation(driverNumber,values);;
     }).then((result) => {
       //act as per results of api

       console.log(JSON.stringify(result));
     }).catch((error) => {
       console.log("Error updating location of rider" + error);
       console.log(JSON.stringify(error));
     });

   }

   updateRiderLocationService(){
     var userNumber;

     Promise.resolve("proceed")
     .then((proceed) => {
       //TODO : to be removed once login is done
       return this.userdata.setValue("userNumber","7504429196");
     })
     .then((proceed) => {

       return this.userdata.getValue("userNumber");
     }).then((result) => {
       userNumber = result;
       return this.getCurrentLocation();
     }).then((latLngObj : any) => {
       console.log(latLngObj);
       console.log(JSON.stringify(latLngObj));
       let body = {
         "latitude" : latLngObj.lat,
         "logitude" : latLngObj.long
       };
       let values = {
         body : body,
         method : "put"
       };
       return this.serviceProvider.updateRideLocation(userNumber,values);
     }).then((result) => {
       //act as per results of api
       console.log(JSON.stringify(result));
       //setTimeout(this.updateRiderLocationService(),10000);
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

   zoomToLocation(latitude,longitude,zoom) {
     var location = new google.maps.LatLng(latitude, longitude);
     this.map.setCenter(location);
     this.map.setZoom(zoom);
   }

   bookARide(vehicleNumber: number){
     //post location, name, rating to open_bookings
     console.log(vehicleNumber);
     if(this.destination_latitude == '' || this.destination_longitude ==''){
       this.userdata.pop_alert("No Rides!","Please select your origin/destination address!",['OK']);
       return;
     }

     var userNumber, userRating, userRideType, userStatus;
     Promise.resolve("proceed")
     .then((proceed) => {
       //TODO : to be removed once login is done
       return this.userdata.setValue("userNumber","7504429196");
     }).then((proceed) => {
       this.userdata.show_loading("Getting A Ride...");
       return this.userdata.getValue("userRating");
     }).then((result) => {
       userRating = result;
       return this.userdata.getValue("userStatus");
     }).then((result) => {
       userStatus = result;
       return this.userdata.getValue("userNumber");
     }).then((result) => {
       userNumber = result;

       let location = {
         "latitude" : this.origin_latitude,
         "logitude" : this.origin_longitude
       };
       let body = {
         location : location,
         userRating : userRating,
         userStatus : userStatus,
         bookingStatus : "open", //open, cancelled
         vehicleNumber : (vehicleNumber.toString().replace("\"","")).replace("\"","")
       }
       let values = {
         body : body,
         method : "put"
       };
       return this.serviceProvider.openABooking(userNumber,values);
     }).then((result) => {
       //act as per results of api
       console.log(JSON.stringify(result));
       this.zoomToLocation(this.origin_latitude,this.origin_longitude,20);
       this.userdata.dismiss_loading();
       this.checkDriverStatus(1);
       //setTimeout(this.updateRiderLocationService(),10000);
     }).catch((error) => {
       this.userdata.dismiss_loading();
       console.log("Error updating location of rider" + error);
       console.log(JSON.stringify(error));
     });

   }
   checkDriverStatus(purpose){

     Promise.resolve("proceed")
     .then((proceed) => {
       //TODO : to be removed once login is done
       return this.userdata.setValue("userNumber","7504429196");
     }).then((proceed) => {
       if(purpose == 1)
         this.userdata.pop_alert("Waiting for Ride", "Setting up the driver",['OK']);
     }).then((proceed) => {
       return this.userdata.getValue("userNumber");
     }).then((result) => {

       return this.serviceProvider.checkBookingStatus(result);
     }).then((result) => {
       console.log(result);
       let value = JSON.parse(JSON.stringify(result));
       console.log(value.bookingStatus);
       if(value.bookingStatus == "open")
         setTimeout(this.checkDriverStatus(0),5000);
       else if(value.bookingStatus == "cancelled"){
         this.userdata.pop_alert("Cancelled","Booking has been cancelled",['OK']);
                    this.autoIdeal = {
             time : 1000, //in mins
             number : 0,
             distance : 0, //in meters
             rate : 0,
             numberOfVehicles : 0
           };
           this.suvIdeal = {
             time : 1000,
             number : 0,
             distance : 0,
             rate : 0,
             numberOfVehicles : 0

           };
           this.miniCarIdeal = {
             time : 1000,
             number : 0,
             distance : 0,
             rate : 0,
             numberOfVehicles : 0

           };
       }
       else if(value.bookingStatus == "accepted")
         this.userdata.pop_alert("Coming Soon!", "Your cab is arriving in " + this.userdata.eta,['OK']);
       else
         console.log("Error in reponse of checkBooking");
     }).then((proceed) => {
       //act as per results of api
       
       //setTimeout(this.updateRiderLocationService(),10000);
     }).catch((error) => {
       this.userdata.dismiss_loading();
       console.log("Error checkDriverStatus" + error);
       console.log(JSON.stringify(error));
     });
   }
   rideType(){
     this.userdata.rideType = this.userdata.rideType == "Reserve" ? "Share" : "Reserve";
     this.userdata.setValue("rideType",this.userdata.rideType);

   }

   openChooseRide() {
     //post location, name, rating to open_bookings
     console.log(this.origin_longitude,this.origin_latitude);
     if(this.destination_latitude == '' || this.destination_longitude ==''){
       this.userdata.pop_alert("No Rides!","Please select your origin/destination address!",['OK']);
       return;
     }

     let autoAvailability = this.autoIdeal.numberOfVehicles != 0;
     let autoAvailabilityText = autoAvailability ? "" : "(Not Available)";

     let miniCarAvailability = this.miniCarIdeal.numberOfVehicles != 0;
     let miniCarAvailabilityText = miniCarAvailability ? "" : "(Not Available)";

     let suvAvailability = this.suvIdeal.numberOfVehicles != 0;
     let suvAvailabilityText = suvAvailability ? "" : "(Not Available)";     

     let bottomSheet = this.actionSheetCtrl.create({
       title: 'Choose Your Ride',
       buttons: [
       {
         text: 'Auto' + autoAvailabilityText,
         handler: () => {
           console.log('Auto clicked');
           if(autoAvailability){
             this.openRideEstimateModal(this.autoIdeal.number,this.autoIdeal.time,this.autoIdeal.distance,this.autoIdeal.rate);
           }else
           this.userdata.pop_alert("No Rides","Sorry, no auto is available!",['OK']);
         }
       },{
         text: 'Mini Car' + miniCarAvailabilityText,
         handler: () => {
           console.log('Car clicked');
           if(miniCarAvailability)  
             this.openRideEstimateModal(this.miniCarIdeal.number,this.miniCarIdeal.time,this.miniCarIdeal.distance,this.miniCarIdeal.rate);
           else
             this.userdata.pop_alert("No Rides","Sorry, no minicar is available!",['OK']);
         }
       },{
         text: 'SUV' + suvAvailabilityText,
         handler: () => {
           console.log('SUV clicked');
           if(suvAvailability)
             this.openRideEstimateModal(this.suvIdeal.number,this.suvIdeal.time,this.suvIdeal.distance,this.suvIdeal.rate);
           else
             this.userdata.pop_alert("No Rides","Sorry, no SUV is available!",['OK']);
         }
       },{
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
       ]
     });

     bottomSheet.present();
     
   }

   openRideEstimateModal(vehicleNumber : number, vehicleTime, vehicleDistance, vehicleRate : number) {
     console.log(vehicleNumber);
     const modalOptions : ModalOptions = {
       enableBackdropDismiss : false
     }

     const modalData = {
       number : vehicleNumber,
       time : vehicleTime,
       distance : this.routeDistance,
       rate : vehicleRate
     }
     let modal = this.modalCtrl.create(RideDetailModalPage,{ data: modalData }, modalOptions);
     modal.onDidDismiss(data => {
       console.log(data);
       if(data == 'confirmed')
         this.bookARide(vehicleNumber);
     });
     modal.present();
   }

   checkDriversInformation(origin_latitude,origin_longitude){

     let TIME_IN_MS = 3000;
     let hideFooterTimeout = setTimeout( () => {
       console.log("waiting for driversInformation");
       if(this.driverInformation == undefined)
         this.checkDriversInformation(origin_latitude,origin_longitude);
       else{
         console.log("found driversInformation");
         this.calculateDistanceOfDrivers(origin_latitude,origin_longitude);
       }
     }, TIME_IN_MS);

   }

   calculateDistanceOfDrivers(origin_latitude,origin_longitude){


     var originOfDrivers  = [];
     var destinationOfUser = [];
     Promise.resolve("proceed")
     .then((proceed) => {
       console.log("Calculating drivers distances");
       return this.driverInformation;
     }).then((result) => {

       var carLocation, carName, carNumber, carRate, carVehicle, i=0, type;
       let latitude : any, longitude: any;

       var destination = new google.maps.LatLng(origin_latitude,origin_longitude);
       console.log(this.driverInformation);
       for (var key in result) {
         if (result.hasOwnProperty(key)) {

           latitude = (JSON.stringify(result[key].location.latitude));
           longitude = (JSON.stringify(result[key].location.longitude));

           carNumber = (JSON.stringify(result[key].number));
           carVehicle = (JSON.stringify(result[key].vehicle));

           var origin = new google.maps.LatLng(latitude,longitude);

           originOfDrivers.push(origin);
           destinationOfUser.push(destination);
         }
       }
     }).then((proceed) => {
       //console.log(JSON.stringify(originOfDrivers),JSON.stringify(destinationOfUser));
       return this.googleDistanceMatrix(originOfDrivers,destinationOfUser);
     }).then((result) => {
       console.log(result);
     }).catch((error) => {
       console.log("Error calculateDistanceOfDrivers() " + error);
       console.log(JSON.stringify(error));
       this.userdata.dismiss_loading();
     });
     
   }



   googleDistanceMatrix(originOfDrivers,destinationOfUser){
     //   var origin1 = new google.maps.LatLng((20.29175783652327),(85.82564004167955));
     //   var origin2 = new google.maps.LatLng((20.309201610785635),(85.8206288749398));
     //  // var orgina = [];
     //  // orgina.push(origin1);
     //  // orgina.push(origin2);

     //   var destinationA = new google.maps.LatLng((20.4625053),(85.8828848));
     //   var destinationB = new google.maps.LatLng((21.4625054),(85.8828848));
     // console.log(JSON.stringify(originOfDrivers),JSON.stringify(destinationOfUser));

     var distancesOfDrivers = [];
     var durationOfDrivers = [];
     var callback = function (response,status) {
       // console.log(JSON.stringify(response));
       if (status == 'OK') {


         let origins = response.originAddresses;
         let destinations = response.destinationAddresses;
         for (var i = 0; i < origins.length; i++) {
           var results = response.rows[i].elements;
           var element = results[0];
           if(element.status != 'OK')
             break;
           let distance = element.distance.value;
           let duration = element.duration.value;

           distancesOfDrivers.push(distance);
           durationOfDrivers.push(duration);

         }
       }
     }
     // create a function and pass in the callback method.
     function add(callback: (response,status) => void) {
       let service = new google.maps.DistanceMatrixService();
       service.getDistanceMatrix(
       {
         origins: originOfDrivers,
         destinations: destinationOfUser,
         travelMode: 'DRIVING'
       }, callback, function(returnValue) {
         // use the return value here instead of like a regular (non-evented) return value
         console.log(returnValue);
         console.log("hauciiii0");
       });
     }

     add(callback);

     setTimeout( () => {
       console.log("Waiting for checkDistanceDuration");
       this.extractIdealRides(distancesOfDrivers,durationOfDrivers);
     }, 2000);

   }


   extractIdealRides(distancesOfDrivers,durationOfDrivers){

     console.log(distancesOfDrivers,durationOfDrivers);
     var originOfDrivers  = [];
     var destinationOfUser = [];
     Promise.resolve("proceed")
     .then((proceed) => {
       console.log("Finding ideal drivers");
       return this.driverInformation;
     }).then((result) => {

       let carLocation, carName, carNumber, carRate, carVehicle, i=0, type;
       let latitude : any, longitude: any;
       this.autoIdeal.time = 1000;
       this.miniCarIdeal.time = 1000;
       this.suvIdeal.time = 1000;

       console.log(this.driverInformation);

       for (var key in result) {
         if (result.hasOwnProperty(key)) {

           carNumber = (JSON.stringify(result[key].number));
           carVehicle = (JSON.stringify(result[key].vehicle));
           carRate = (JSON.stringify(result[key].rate));

           if(distancesOfDrivers[i] < 5000 && durationOfDrivers[i] < 1000){
             console.log(carVehicle,distancesOfDrivers[i],durationOfDrivers[i]);
             if((carVehicle == '0') && (this.autoIdeal.time  > durationOfDrivers[i])){
               this.autoIdeal.time = durationOfDrivers[i];
               this.autoIdeal.number = carNumber;
               this.autoIdeal.distance = distancesOfDrivers[i];
               this.autoIdeal.rate = carRate;
               this.autoIdeal.numberOfVehicles++;
             }else if((carVehicle == '1') && (this.miniCarIdeal.time > durationOfDrivers[i])){
               this.miniCarIdeal.time = durationOfDrivers[i];
               this.miniCarIdeal.number = carNumber;
               this.miniCarIdeal.distance = distancesOfDrivers[i];
               this.miniCarIdeal.rate = carRate;
               this.miniCarIdeal.numberOfVehicles++;
             }else if((carVehicle == '2') && (this.suvIdeal.time > durationOfDrivers[i])){
               this.suvIdeal.time = durationOfDrivers[i];
               this.suvIdeal.number = carNumber;
               this.suvIdeal.distance = distancesOfDrivers[i];
               this.suvIdeal.rate = carRate;
               this.suvIdeal.numberOfVehicles++;
             }else{
               console.log("Not Ideal Vehicle ");
               //this.userdata.pop_alert("No Service Found!", "Sorry, we are unable to find any rides.",['OK']);
             }
           }
           else
             console.log("Too Far Away", distancesOfDrivers[i]);
           i++;
         }
       }
     }).then((proceed) => {
       if(this.autoIdeal.numberOfVehicles == 0 && this.miniCarIdeal.numberOfVehicles == 0 && this.suvIdeal.numberOfVehicles == 0){
         this.userdata.pop_alert("No Rides Found!", "Sorry, we were unable to find any rides nearby",['OK']);
       }else{
         console.log("Auto -> ",this.autoIdeal.time,this.autoIdeal.distance,this.autoIdeal.rate,this.autoIdeal.number);
         console.log("MiniCar -> ",this.miniCarIdeal.time,this.miniCarIdeal.distance,this.miniCarIdeal.rate,this.miniCarIdeal.number);
         console.log("SUV -> ",this.suvIdeal.time,this.suvIdeal.distance,this.suvIdeal.rate,this.suvIdeal.number);
       }
     }).catch((error) => {
       console.log("Error findIdealRides()" + error);
       console.log(JSON.stringify(error));
       this.userdata.dismiss_loading();
     });
     
   }

 }
