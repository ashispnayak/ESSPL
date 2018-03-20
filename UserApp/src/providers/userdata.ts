import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, Loading, Platform, ToastController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class UserData {

  public userType: string; //rider or driver
  public rideType: string = "Reserve"; // share or reserve
  public rideExpense: string = "50";
  public eta: string = "3mins";//expected time of arrival
  public distance: string = "4km"; //journey distance

  public db: string;
  public uid: number;
  public dob: string;
  
  public name: string;
  public gender: string;
  public email: string;
  public number: string;
  public password: string;
  public fbUserID: string;
  public fbAccessToken: string;
  public usercreator_uid: number;
  public partner_id: number;
  public avatar_image: string;
  public products: any;
  public cartnumber: number;
  // For storing New Item data temporarily until ready to create new item at backend
  public item_receipt_photo: string;
  public item_product_photo: string;
  public loading: Loading;
  // For network monitoring
  // networkStatus true means internet connection available, vice versa.
  public networkStatus: boolean = false;
  public waitingForInternet: boolean = false;
  public waitingForInternetPopup: any;
  public appInitialised: boolean = false;
  public exitDialog: boolean = false;
  public loadingShown: boolean = false;
  public selected_product: any;
  public countriesInfo: any;
  public country: number = -1;
  public blood_group_id: number = 0;
  public countryDisplay: any= "Select Your Country";
  public registeredUser: boolean = false;

  public access_token: string;
  public refresh_token: string;
  public expired_on: string;
  public created_on: string;
  public latitude:string;
  public longitude: string;

  public error_show = {
    "title" : "Hang On!",
    "message": "Some error occured! Contact info@invincix.com, if this error keeps on repeating."
  };
  /*
  The fields in localdb:
  - access token
  - refresh token
  - expiry date of refresh token
  - number
  - password
  - firebaseToken
  */

  constructor(public localdb: Storage, public alertCtrl: AlertController, 
    private loadingCtrl: LoadingController, private platform: Platform, 
    private firebase: Firebase, private toastCtrl: ToastController,
    public storage: Storage) {
    this.db = "dev";
    this.products = [];
    this.cartnumber = 0;
  }


  getValue(key): Promise<any> {
    return new Promise((resolve, reject) => {
      this.localdb.get(key).then((value) => {
        resolve(value);
      }, (error) => {
        reject(error);
      });
    });
  }

  setValue(key,data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.localdb.set(key,data).then((value) => {
        resolve(value);
      }, (error) => {
        reject(error);
      });
    });
  }

  setErrorAlert(title: string,message: string){
    this.error_show.title = title;
    this.error_show.message = message;
    return this.error_show;
  }

  isValidNumberFormat(number,NUMBER_REGEXP : RegExp): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(typeof NUMBER_REGEXP);
      if (number == "" || !NUMBER_REGEXP.test(number)) {
        reject("Invalid Number");
      }else{
        resolve(true);
      }
      
    });
  }


  pop_alert(title: string, subtitle: string, buttons: Array<any>, enableBackdropDismiss?: boolean): any {
    if (enableBackdropDismiss == undefined) {
      enableBackdropDismiss = true;
    }
    let alertOptions = {
      title: title,
      subTitle: subtitle,
      buttons: buttons,
      enableBackdropDismiss: enableBackdropDismiss
    };
    let alertBox = this.alertCtrl.create(alertOptions);
    alertBox.present();
    return alertBox;
  }

  show_loading(content?: string) {
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
  }

  dismiss_loading() {
      this.loading.dismiss();
      this.loadingShown = false;
  }

  reset_all_properties() {
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
  }


	static process_messages_read_state(messages: Array<any> = []) {
		for (let message of messages) {
			if (message.state == "Sent") {
				message.read_state = "unread";
			}
			else {
				message.read_state = "read";
			}
		}
		return messages;
	}

  unregister_firebase_token(xml_rpc: any, uid: number, token: string, firebase: any): Promise<any> {
    return new Promise((resolve, reject) => {
      xml_rpc.call_api("res.users", "unregister_firebase_token", [uid, token], {},
      (error, proceed) => {
        if (error) {
          console.log("Error at userdata unregister_firebase_token()");
          console.log(error);
          let error_msg = "Error at userdata unregister_firebase_token()\n";
          error_msg = error_msg + error;
          firebase.logError(error_msg);
          reject(error);
        }
        else {
          resolve("proceed");
        }
      });
    });
  }


  presentToast(message: string, time: number, place: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: time,
      position: place
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
 _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    //this.events.publish('user:login');
  };

  signup(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    //this.events.publish('user:signup');
  };

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    //this.events.publish('user:logout');
  };

  setUsername(username) {
    this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };
}
