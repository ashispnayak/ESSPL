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
import { AlertController, LoadingController, Platform, ToastController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
var UserData = (function () {
    /*
    The fields in localdb:
    - access token
    - refresh token
    - expiry date of refresh token
    - number
    - password
    - firebaseToken
    */
    function UserData(localdb, alertCtrl, loadingCtrl, platform, firebase, toastCtrl, storage) {
        this.localdb = localdb;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.platform = platform;
        this.firebase = firebase;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        // For network monitoring
        // networkStatus true means internet connection available, vice versa.
        this.networkStatus = false;
        this.waitingForInternet = false;
        this.appInitialised = false;
        this.exitDialog = false;
        this.loadingShown = false;
        this.country = -1;
        this.blood_group_id = 0;
        this.countryDisplay = "Select Your Country";
        this.registeredUser = false;
        this.error_show = {
            "title": "Hang On!",
            "message": "Some error occured! Contact info@invincix.com, if this error keeps on repeating."
        };
        this._favorites = [];
        this.HAS_LOGGED_IN = 'hasLoggedIn';
        this.HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
        this.db = "dev";
        this.products = [];
        this.cartnumber = 0;
    }
    UserData.prototype.getValue = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.localdb.get(key).then(function (value) {
                resolve(value);
            }, function (error) {
                reject(error);
            });
        });
    };
    UserData.prototype.setErrorAlert = function (title, message) {
        this.error_show.title = title;
        this.error_show.message = message;
        return this.error_show;
    };
    UserData.prototype.isValidNumberFormat = function (number, NUMBER_REGEXP) {
        return new Promise(function (resolve, reject) {
            console.log(typeof NUMBER_REGEXP);
            if (number == "" || !NUMBER_REGEXP.test(number)) {
                reject("Invalid Number");
            }
            else {
                resolve(true);
            }
        });
    };
    UserData.prototype.pop_alert = function (title, subtitle, buttons, enableBackdropDismiss) {
        if (enableBackdropDismiss == undefined) {
            enableBackdropDismiss = true;
        }
        var alertOptions = {
            title: title,
            subTitle: subtitle,
            buttons: buttons,
            enableBackdropDismiss: enableBackdropDismiss
        };
        var alertBox = this.alertCtrl.create(alertOptions);
        alertBox.present();
        return alertBox;
    };
    UserData.prototype.show_loading = function (content) {
        if (!content) {
            content = "Loading. Please wait...";
        }
        this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: content,
            duration: 20000,
            dismissOnPageChange: true
        });
        this.loading.present();
        this.loadingShown = true;
    };
    UserData.prototype.dismiss_loading = function () {
        this.loading.dismiss();
        this.loadingShown = false;
    };
    UserData.prototype.reset_all_properties = function () {
        this.name = "";
        this.email = "";
        this.number = "";
        this.password = "";
        this.fbUserID = "";
        this.fbAccessToken = "";
        this.partner_id = undefined;
        this.products = [];
        this.cartnumber = 0;
        this.item_receipt_photo = undefined;
        this.avatar_image = undefined;
        this.countriesInfo = "";
        this.localdb.clear();
    };
    // static deserialize_products(jsonObjects):Array<Product> {
    //   let products = [];
    //   for (let jsonObj of jsonObjects) {
    //     let product;
    //     product.deserialize(jsonObj);
    //     products.push(product);
    //   }
    //   return products;
    // }
    // set_selected_product(product: Product) {
    //     // wipe out the current selected_product data first
    //     this.selected_product = undefined;
    //     this.selected_product = new Product();
    //   this.selected_product.deserialize(product);
    // }
    // showHideAdBanner() {
    // 	if (this.platform.is("ios")) {
    // 		/* Hack to hide then show ad banner so that App View can resize window to prevent
    // 		content from being overlapped by Ad banner .*/
    // 		this.admob.hideBanner();
    // 		this.admob.showBanner(this.admob.AD_POSITION.BOTTOM_CENTER);
    // 	}
    // }
    UserData.process_messages_read_state = function (messages) {
        if (messages === void 0) { messages = []; }
        for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
            var message = messages_1[_i];
            if (message.state == "Sent") {
                message.read_state = "unread";
            }
            else {
                message.read_state = "read";
            }
        }
        return messages;
    };
    UserData.prototype.unregister_firebase_token = function (xml_rpc, uid, token, firebase) {
        return new Promise(function (resolve, reject) {
            xml_rpc.call_api("res.users", "unregister_firebase_token", [uid, token], {}, function (error, proceed) {
                if (error) {
                    console.log("Error at userdata unregister_firebase_token()");
                    console.log(error);
                    var error_msg = "Error at userdata unregister_firebase_token()\n";
                    error_msg = error_msg + error;
                    firebase.logError(error_msg);
                    reject(error);
                }
                else {
                    resolve("proceed");
                }
            });
        });
    };
    UserData.prototype.presentToast = function (message, time, place) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: time,
            position: place
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    UserData.prototype.hasFavorite = function (sessionName) {
        return (this._favorites.indexOf(sessionName) > -1);
    };
    ;
    UserData.prototype.addFavorite = function (sessionName) {
        this._favorites.push(sessionName);
    };
    ;
    UserData.prototype.removeFavorite = function (sessionName) {
        var index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    };
    ;
    UserData.prototype.login = function (username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        //this.events.publish('user:login');
    };
    ;
    UserData.prototype.signup = function (username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        //this.events.publish('user:signup');
    };
    ;
    UserData.prototype.logout = function () {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        //this.events.publish('user:logout');
    };
    ;
    UserData.prototype.setUsername = function (username) {
        this.storage.set('username', username);
    };
    ;
    UserData.prototype.getUsername = function () {
        return this.storage.get('username').then(function (value) {
            return value;
        });
    };
    ;
    // return a promise
    UserData.prototype.hasLoggedIn = function () {
        return this.storage.get(this.HAS_LOGGED_IN).then(function (value) {
            return value === true;
        });
    };
    ;
    UserData.prototype.checkHasSeenTutorial = function () {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then(function (value) {
            return value;
        });
    };
    ;
    return UserData;
}());
UserData = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Storage, AlertController,
        LoadingController, Platform,
        Firebase, ToastController,
        Storage])
], UserData);
export { UserData };
//# sourceMappingURL=userdata.js.map