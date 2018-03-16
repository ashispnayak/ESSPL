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
import { MenuController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
var TutorialPage = (function () {
    function TutorialPage(navCtrl, menu, storage) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.storage = storage;
        this.showSkip = true;
        this.slides = [
            {
                title: 'Welcome to <b>ESSPL</b>',
                description: 'ESSPL will help you to get a ride',
                image: 'assets/img/ica-slidebox-img-1.png',
            },
            {
                title: 'What is ESSPL?',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled i',
                image: 'assets/img/ica-slidebox-img-2.png',
            },
            {
                title: 'What is Ionic Platform?',
                description: 'The <b>Ionic Platform</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.',
                image: 'assets/img/ica-slidebox-img-3.png',
            }
        ];
    }
    TutorialPage.prototype.startApp = function () {
        this.navCtrl.push(TabsPage);
        this.storage.set('hasSeenTutorial', 'true');
    };
    TutorialPage.prototype.onSlideChangeStart = function (slider) {
        this.showSkip = !slider.isEnd;
    };
    TutorialPage.prototype.ionViewDidEnter = function () {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    };
    TutorialPage.prototype.ionViewWillLeave = function () {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    };
    return TutorialPage;
}());
TutorialPage = __decorate([
    Component({
        selector: 'page-tutorial',
        templateUrl: 'tutorial.html'
    }),
    __metadata("design:paramtypes", [NavController, MenuController, Storage])
], TutorialPage);
export { TutorialPage };
//# sourceMappingURL=tutorial.js.map