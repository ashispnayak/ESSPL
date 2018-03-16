var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
var AutocompletePage = (function () {
    function AutocompletePage(viewCtrl, zone) {
        this.viewCtrl = viewCtrl;
        this.zone = zone;
        this.service = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }
    AutocompletePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AutocompletePage.prototype.chooseItem = function (item) {
        var map = new google.maps.Map(document.createElement('div'));
        var googlePlacesService = new google.maps.places.PlacesService(map);
        var thisViewCtrl = this.viewCtrl;
        googlePlacesService.getDetails({
            placeId: item.place_id
        }, function (details, status) {
            if (details) {
                item.lat = details.geometry.location.lat;
                item.lng = details.geometry.location.lng;
                thisViewCtrl.dismiss(item);
            }
        });
    };
    AutocompletePage.prototype.updateSearch = function () {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        var me = this;
        this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'US' } }, function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                return;
            }
            me.autocompleteItems = [];
            me.zone.run(function () {
                if (predictions != null) {
                    predictions.forEach(function (prediction) {
                        me.autocompleteItems.push({ desc: prediction.description,
                            place_id: prediction.place_id,
                            lat: "",
                            lng: ""
                        });
                    });
                }
            });
        });
    };
    return AutocompletePage;
}());
AutocompletePage = __decorate([
    Component({
        templateUrl: 'autocomplete.html'
    }),
    __metadata("design:paramtypes", [ViewController, NgZone])
], AutocompletePage);
export { AutocompletePage };
//# sourceMappingURL=autocomplete.js.map