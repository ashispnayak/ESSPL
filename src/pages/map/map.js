var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { MapProvider } from '../../providers/map/map';
import { ServiceProvider } from '../../providers/service/service';
import { UserData } from '../../providers/userdata';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MapPage = (function () {
    function MapPage(navCtrl, geolocation, zone, platform, localStorage, mapService, spinner, viewCtrl, navParams, firebase, serviceProvider, userdata) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.geolocation = geolocation;
        this.zone = zone;
        this.platform = platform;
        this.localStorage = localStorage;
        this.mapService = mapService;
        this.spinner = spinner;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.firebase = firebase;
        this.serviceProvider = serviceProvider;
        this.userdata = userdata;
        this.addressElement = null;
        this.dropAddressElement = null;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.address = '';
        this.origin_address = '';
        this.destination_address = '';
        this.place_id = '';
        this.origin_placeId = '';
        this.destination_placeId = '';
        this.platform.ready().then(function () { return _this.loadMaps(); });
    }
    MapPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MapPage');
    };
    MapPage.prototype.loadMaps = function () {
        this.initializeMap();
        this.initAutocomplete();
        this.initAutocompleteDrop();
    };
    MapPage.prototype.initializeMap = function () {
        var _this = this;
        console.log("2");
        var that = this;
        that.currentLocation();
        this.zone.run(function () {
            var mapEle = _this.mapElement.nativeElement;
            _this.map = new google.maps.Map(mapEle, {
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
            _this.map.addListener('dragstart', function () {
                console.log('Drag start');
            });
            // Map dragging
            _this.map.addListener('drag', function () {
                that.address = 'Searching...';
            });
            //Reload markers every time the map moves
            _this.map.addListener('dragend', function () {
                var map_center = that.getMapCenter();
                var latLngObj = { 'lat': map_center.lat(), 'long': map_center.lng() };
                console.log(latLngObj);
                try {
                    that.getAddress(latLngObj, 'ORIGIN');
                }
                catch (exception) {
                    console.log(exception + "hauci");
                }
            });
            google.maps.event.addListenerOnce(_this.map, 'idle', function () {
                google.maps.event.trigger(_this.map, 'resize');
                mapEle.classList.add('show-map');
            });
            google.maps.event.addListener(_this.map, 'bounds_changed', function () {
                _this.zone.run(function () {
                    _this.resizeMap();
                });
            });
        });
        //new this.AutocompleteDirectionsHandler(this.map);
        this.directionsDisplay.setMap(this.map);
        this.centerMarker = document.getElementsByClassName("centerMarker");
    };
    MapPage.prototype.initAutocomplete = function () {
        var _this = this;
        console.log("3");
        this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
        this.addressElement.setAttribute("id", "origin_address");
        console.log(this.addressElement);
        this.createAutocomplete(this.addressElement, 'ORIGIN').subscribe(function (location) {
            //console.log('Searchdata' + location.lat());
            var latLngObj = { 'lat': location.lat(), 'long': location.lng() };
            _this.getAddress(latLngObj, 'ORIGIN');
            var options = {
                center: location,
                zoom: 16
            };
            _this.map.setOptions(options);
        });
    };
    MapPage.prototype.initAutocompleteDrop = function () {
        var _this = this;
        console.log("4");
        this.addressElement = this.dropsearchbar.nativeElement.querySelector('.searchbar-input');
        this.addressElement.setAttribute("id", "destination_address");
        console.log(this.addressElement);
        this.createAutocomplete(this.addressElement, 'DESTINATION').subscribe(function (location) {
            //console.log('Searchdata' + location.lat());
            var latLngObj = { 'lat': location.lat(), 'long': location.lng() };
            _this.getAddress(latLngObj, 'DESTINATION');
            var options = {
                center: location,
                zoom: 16
            };
            _this.map.setOptions(options);
        });
    };
    MapPage.prototype.currentLocation = function () {
        var _this = this;
        console.log("5");
        this.spinner.load();
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var latLngObj = { 'lat': position.coords.latitude, 'long': position.coords.longitude };
            // Display  Marker
            _this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            _this.getAddress(latLngObj, 'ORIGIN');
            _this.spinner.dismiss();
            localStorage.setItem('current_latlong', JSON.stringify(latLngObj));
            _this.getAddress(latLngObj, 'ORIGIN');
            return latLngObj;
        }, function (err) {
            console.log(err);
        });
    };
    MapPage.prototype.getAddress = function (latLngObj, purpose) {
        var _this = this;
        console.log("6" + purpose);
        // Get the address object based on latLngObj
        var place_id;
        this.mapService.getStreetAddress(latLngObj).subscribe(function (s_address) {
            if (s_address.status == "ZERO_RESULTS") {
                _this.mapService.getAddress(latLngObj).subscribe(function (address) {
                    _this.address = address.results[0].formatted_address;
                    place_id = (address.results[0].place_id);
                    console.log(place_id);
                    _this.assignPlaceIds(place_id, purpose, _this.address);
                    _this.getAddressComponentByPlace(address.results[0], latLngObj);
                }, function (err) { return console.log("Error in getting the street address " + err); });
            }
            else {
                _this.address = s_address.results[0].formatted_address;
                place_id = (s_address.results[0].place_id);
                console.log(place_id);
                _this.assignPlaceIds(place_id, purpose, _this.address);
                _this.getAddressComponentByPlace(s_address.results[0], latLngObj);
            }
        }, function (err) {
            console.log('No Address found ' + err);
        });
    };
    MapPage.prototype.assignPlaceIds = function (place_id, purpose, address) {
        if (place_id != null) {
            if (purpose == 'ORIGIN') {
                console.log("originwala");
                //document.getElementById("origin_address").innerText = address;
                this.origin_placeId = place_id;
            }
            else {
                console.log("destinationwala");
                //document.getElementById("destination_address").innerText = address;
                this.destination_placeId = place_id;
            }
        }
        else
            console.log("plaeId is null");
        if (this.origin_placeId != '' && this.destination_placeId != '')
            this.bookRide();
    };
    MapPage.prototype.getMapCenter = function () {
        return this.map.getCenter();
    };
    MapPage.prototype.createAutocomplete = function (addressEl, purpose) {
        var _this = this;
        console.log("1");
        var autocomplete = new google.maps.places.Autocomplete(addressEl);
        autocomplete.bindTo('bounds', this.map);
        return new Observable(function (sub) {
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    sub.error({
                        message: 'Autocomplete returned place with no geometry'
                    });
                }
                else {
                    var latLngObj = { 'lat': place.geometry.location.lat(), 'long': place.geometry.location.lng() };
                    _this.getAddress(latLngObj, purpose);
                    sub.next(place.geometry.location);
                }
            });
        });
    };
    MapPage.prototype.getAddressComponentByPlace = function (place, latLngObj) {
        var components;
        components = {};
        for (var i = 0; i < place.address_components.length; i++) {
            var ac = place.address_components[i];
            components[ac.types[0]] = ac.long_name;
        }
        var addressObj = {
            street: (components.street_number) ? components.street_number : 'not found',
            area: components.route,
            city: (components.sublocality_level_1) ? components.sublocality_level_1 : components.locality,
            country: (components.administrative_area_level_1) ? components.administrative_area_level_1 : components.political,
            postCode: components.postal_code,
            loc: [latLngObj.long, latLngObj.lat],
            address: this.address
        };
        localStorage.clear();
        localStorage.setItem('carryr_customer', JSON.stringify(addressObj));
        return components;
    };
    MapPage.prototype.resizeMap = function () {
        var _this = this;
        setTimeout(function () {
            google.maps.event.trigger(_this.map, 'resize');
        }, 200);
    };
    MapPage.prototype.closeModal = function () {
        this.viewCtrl.dismiss();
    };
    MapPage.prototype.errorAlert = function (title, message) {
        alert('Error in Alert');
    };
    MapPage.prototype.bookRide = function () {
        var _this = this;
        console.log("7");
        this.travelMode = 'DRIVING';
        console.log(this.origin_placeId);
        console.log(this.destination_placeId);
        if (this.origin_placeId == '') {
            alert("Please select pick up point");
            return;
        }
        if (this.destination_placeId == '') {
            alert("Please select drop point");
            return;
        }
        this.directionsService.route({
            origin: { 'placeId': this.origin_placeId },
            destination: { 'placeId': this.destination_placeId },
            travelMode: this.travelMode
        }, function (response, status) {
            var status2;
            status2 = status;
            if (status2 === 'OK') {
                //hide the center marker
                //        this.centerMarker.visibility = 'hide';
                _this.directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    };
    MapPage.prototype.httpGetAsync = function (theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    };
    MapPage.prototype.fetchNearByRides = function (ride) {
        var _this = this;
        Promise.resolve("proceed")
            .then(function (proceed) {
            _this.userdata.show_loading("Getting Rides");
            return _this.serviceProvider.getRidesInformation();
            ;
        }).then(function (result) {
            //act as per results of api
            console.log(JSON.stringify(result));
            var rides = JSON.stringify(result);
            console.log(result[0]);
            var list = [];
            var usersJson = Array.of(result);
            console.log(usersJson);
            usersJson.forEach(function (element) {
                console.log(location);
            });
            _this.userdata.dismiss_loading();
            //return this.api.getMobileStatus(countryId,this.userdata.number);  
        }).catch(function (error) {
            console.log("Error registering user" + error);
            console.log(JSON.stringify(error));
            _this.userdata.dismiss_loading();
        });
        if (ride == 'RESERVE') {
            //get all the vehicles and show only having locations
        }
    };
    MapPage.prototype.placeRidesOnMap = function (LatLng, carName) {
        var marker = new google.maps.Marker({
            position: LatLng,
            map: this.map,
            title: carName
        });
    };
    MapPage.prototype.updateRideLocationService = function (latitude, longitude, carname) {
        var _this = this;
        Promise.resolve("proceed")
            .then(function (proceed) {
            var body = {
                "latitude": latitude,
                "logitude": longitude
            };
            var values = {
                body: body,
                method: "put"
            };
            return _this.serviceProvider.updateRideLocation(carname, values);
            ;
        }).then(function (result) {
            //act as per results of api
            console.log(JSON.stringify(result));
        }).catch(function (error) {
            console.log("Error updating location of rider" + error);
            console.log(JSON.stringify(error));
        });
    };
    MapPage.prototype.writeRidesData = function (userId, name, email, imageUrl) {
        this.firebase.getToken()
            .then(function (token) { return console.log("The token is " + token); }) // save the token server-side and use it to push notifications to this device
            .catch(function (error) { return console.error('Error getting token', error); });
        this.firebase.onTokenRefresh()
            .subscribe(function (token) { return console.log("Got a new token " + token); });
    };
    return MapPage;
}());
__decorate([
    ViewChild('map'),
    __metadata("design:type", ElementRef)
], MapPage.prototype, "mapElement", void 0);
__decorate([
    ViewChild('searchbar', { read: ElementRef }),
    __metadata("design:type", ElementRef)
], MapPage.prototype, "searchbar", void 0);
__decorate([
    ViewChild('dropsearchbar', { read: ElementRef }),
    __metadata("design:type", ElementRef)
], MapPage.prototype, "dropsearchbar", void 0);
MapPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-map',
        templateUrl: 'map.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Geolocation,
        NgZone,
        Platform,
        Storage,
        MapProvider,
        SpinnerProvider,
        ViewController,
        NavParams,
        Firebase,
        ServiceProvider,
        UserData])
], MapPage);
export { MapPage };
//# sourceMappingURL=map.js.map