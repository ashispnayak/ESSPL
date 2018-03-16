var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Utility } from '../../providers/utility';
var SubscribePage = (function () {
    function SubscribePage(navParams, viewCtrl, utility) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.utility = utility;
    }
    SubscribePage.prototype.subscribe = function () {
        //Show loading
        var loading = this.utility.getLoader();
        loading.present();
        //Hide loading
        setTimeout(function () {
            loading.dismiss();
        }, 1000);
    };
    return SubscribePage;
}());
SubscribePage = __decorate([
    Component({
        selector: 'page-subscribe',
        templateUrl: 'subscribe.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        ViewController,
        Utility])
], SubscribePage);
export { SubscribePage };
//# sourceMappingURL=subscribe.js.map