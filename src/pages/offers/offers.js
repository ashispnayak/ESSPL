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
import { ActionSheetController, AlertController, App, ModalController, NavController } from 'ionic-angular';
// import moment from 'moment';
import { OffersDetailPage } from '../offers-detail/offers-detail';
import { AutocompletePage } from '../autocomplete/autocomplete';
import { OffersData } from '../../providers/offers-data';
import { UserData } from '../../providers/user-data';
import { Utility } from '../../providers/utility';
var OffersPage = (function () {
    function OffersPage(alertCtrl, app, modalCtrl, navCtrl, offersData, user, utility, actionSheetCtrl) {
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.offersData = offersData;
        this.user = user;
        this.utility = utility;
        this.actionSheetCtrl = actionSheetCtrl;
        this.offers = [];
        this.address = {
            place: {
                desc: '',
                lat: '',
                lng: ''
            }
        };
    }
    OffersPage.prototype.ionViewDidLoad = function () {
        this.app.setTitle('Offers');
        this.updateHangout();
    };
    OffersPage.prototype.updateHangout = function () {
        var _this = this;
        //Show loading
        var loading = this.utility.getLoader();
        loading.present();
        this.offersData.getOffers().subscribe(function (data) {
            _this.offers = data;
            //Hide loading
            setTimeout(function () {
                loading.dismiss();
            }, 1000);
        });
    };
    OffersPage.prototype.showAddressModal = function () {
        var _this = this;
        var modal = this.modalCtrl.create(AutocompletePage);
        modal.onDidDismiss(function (data) {
            if (data == undefined)
                return;
            _this.address.place = data;
            _this.updateHangout();
        });
        modal.present();
    };
    OffersPage.prototype.goToDetail = function (item) {
        var nav = this.app.getRootNav();
        nav.push(OffersDetailPage, item);
    };
    OffersPage.prototype.openShare = function (item) {
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Share ' + "TEST",
            buttons: [
                {
                    text: 'Copy Link',
                    handler: function ($event) {
                        if (window['cordova'] && window['cordova'].plugins.clipboard) {
                            window['cordova'].plugins.clipboard.copy('https://twitter.com/' + "TEST");
                        }
                    }
                },
                {
                    text: 'Share via ...'
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    };
    return OffersPage;
}());
OffersPage = __decorate([
    Component({
        selector: 'page-offers',
        templateUrl: 'offers.html'
    }),
    __metadata("design:paramtypes", [AlertController,
        App,
        ModalController,
        NavController,
        OffersData,
        UserData,
        Utility,
        ActionSheetController])
], OffersPage);
export { OffersPage };
//# sourceMappingURL=offers.js.map