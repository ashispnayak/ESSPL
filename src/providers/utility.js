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
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
var Utility = (function () {
    function Utility(storage, loadingCtrl) {
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
    }
    //Show/hide loading
    Utility.prototype.getLoader = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        return loader;
        //loader.present();
    };
    return Utility;
}());
Utility = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Storage, LoadingController])
], Utility);
export { Utility };
//# sourceMappingURL=utility.js.map