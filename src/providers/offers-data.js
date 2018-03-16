var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
var OffersData = (function () {
    function OffersData(http) {
        this.http = http;
    }
    OffersData.prototype.load = function () {
        if (this.data) {
            return Observable.of(this.data);
        }
        else {
            return this.http.get('assets/data/offers.json')
                .map(this.processData);
        }
    };
    OffersData.prototype.processData = function (data) {
        this.data = data.json();
        return this.data;
    };
    OffersData.prototype.getOffers = function () {
        return this.load().map(function (data) {
            return data.offers;
        });
    };
    OffersData.prototype.getMap = function () {
        return this.load().map(function (data) {
            return data.map;
        });
    };
    return OffersData;
}());
OffersData = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], OffersData);
export { OffersData };
//# sourceMappingURL=offers-data.js.map