import { Component, NgZone } from '@angular/core';
import { ViewController  } from 'ionic-angular';
import {googlemaps} from 'googlemaps';

@Component({
    templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
    autocompleteItems;
    autocomplete;
    service = new google.maps.places.AutocompleteService();

    constructor(public viewCtrl: ViewController, private zone: NgZone) {
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        let map = new google.maps.Map(document.createElement('div'));
        var googlePlacesService = new google.maps.places.PlacesService(map);
        var thisViewCtrl= this.viewCtrl;
        googlePlacesService.getDetails({
            placeId: item.place_id
        }, function (details, status) {
            
            if (details) {                
                item.lat = details.geometry.location.lat;
                item.lng = details.geometry.location.lng;
                thisViewCtrl.dismiss(item);
            }
        });
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'US' } }, function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                return;
            }

            me.autocompleteItems = [];
            me.zone.run(function () {
                if (predictions != null) {
                    predictions.forEach(function (prediction) {
                        me.autocompleteItems.push(
                            {   desc: prediction.description, 
                                place_id: prediction.place_id,
                                lat:"",
                                lng:""
                            }
                            );
                    });
                }
            });
        });
    }
}