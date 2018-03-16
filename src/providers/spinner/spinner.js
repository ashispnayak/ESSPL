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
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the SpinnerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var SpinnerProvider = (function () {
    function SpinnerProvider(http, loadingCtrl) {
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        console.log('Hello SpinnerProvider Provider');
    }
    SpinnerProvider.prototype.load = function () {
        this.loader = this.loadingCtrl.create({
            content: ''
        });
        this.loader.present();
    };
    SpinnerProvider.prototype.dismiss = function () {
        if (this.loader) {
            this.loader.dismiss();
            this.loader = null;
        }
    };
    return SpinnerProvider;
}());
SpinnerProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, LoadingController])
], SpinnerProvider);
export { SpinnerProvider };
//# sourceMappingURL=spinner.js.map