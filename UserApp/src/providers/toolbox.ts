import { SettingsProvider as AppSettings} from './settings/settings';
import { Network } from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { Transfer } from 'ionic-native';
import { Http, Headers } from '@angular/http';
import {FormControl} from '@angular/forms';

export class Toolbox {


	constructor() {

	}

    // static fully_qualify_path(relative_path: string) {
    // 	let full_path = relative_path;
    // 	if (relative_path.indexOf("http") < 0) {
    // 		let protocol = "http://";
    // 		if (AppSettings.server_port == 443) {
    // 			protocol = "https://";
    // 		}
    // 		full_path = protocol + AppSettings.server_domain + ":" + AppSettings.server_port + relative_path;
    // 	}
    // 	return full_path;
    // }
    static getBloodGroupID(group): number {
    	let blood_group_id;
    	switch (group) {
    		case "A+":
    			blood_group_id = 1;
    			break;
    		case "A-":
    			blood_group_id = 2;
    			break;
    		case "B+":
    			blood_group_id = 3;
    			break;
    		case "B-":
    			blood_group_id = 4;
    			break;
    		case "AB+":
    			blood_group_id = 5;
    			break;
    		case "AB-":
    			blood_group_id = 6;
    			break;
    		case "O+":
    			blood_group_id = 7;
    			break;
    		case "O-":
    			blood_group_id = 8;
    			break;
    		
    		default:
    			return 0;
    	}
    	return blood_group_id;
    }

    static haveInternet(): boolean {
    	let network = new Network();
    	console.log("printing network type");
    	console.log(network.type);
    	if (network.type == "ethernet" || network.type == "wifi" || network.type == "2g" || network.type == "3g"
    		|| network.type == "4g" || network.type == "cellular") {
    		console.log("Have Internet");
    	return true;
    }
    else {
    	console.log("No Internet");
    	return false;
    }
}

// static listenNetwork(userdata: any, app_component: any) {
// 	let network = new Network();
// 	network.onDisconnect().subscribe(() => {
// 		console.log('network was disconnected');
// 		userdata.networkStatus = false;
// 		if (userdata.appInitialised && userdata.waitingForInternetPopup == undefined) {
// 			// Only show the "No internet" popup once if internet loss has already been detected.
// 			userdata.waitingForInternetPopup = userdata.pop_alert("Sorry", "An internet connection is required to use this app. " +
// 				"Once internet is available, this app will resume automatically.",
// 				[], false);
// 		}
// 		console.log("printing no internet popup");
// 		console.log(userdata.waitingForInternetPopup);
// 	});

// 	network.onConnect().subscribe(() => {
// 		console.log('network connected');
// 		userdata.networkStatus = true;
// 		if (userdata.waitingForInternet) {
// 			userdata.waitingForInternet = false;
// 			app_component.initializeApp();
// 		}
// 		else if (userdata.waitingForInternetPopup) {
// 			userdata.waitingForInternetPopup.dismiss();
// 			userdata.waitingForInternetPopup = undefined;
// 		}
// 	});
// }

static listenFirebaseNotification(platform: any, firebase: any, userdata: any, xml_rpc: any, navCtrl: any,
	message_page: any, topnavheader: any) {
	if (platform.is("ios")) {
		console.log("detected this phone is ios");
		firebase.grantPermission();
	}
	firebase.onTokenRefresh().subscribe((token) => {
		console.log("token refreshed");
		console.log(token);
		this.checkFirebaseToken(token, userdata, xml_rpc);
	},
	(error) => {
		console.log("error refreshing token");
		console.log(error);
	});

	firebase.onNotificationOpen().subscribe((notification) => {
		console.log("notification received");
		console.log(notification);
		topnavheader.RIGHTHANDBUTTONS.NOTIFICATION.unread_msg_number = topnavheader.RIGHTHANDBUTTONS.NOTIFICATION.unread_msg_number + 1;
		let alert = userdata.pop_alert("New message received", notification.title,
			[
			{
				text: 'See message',
				handler: () => {
					alert.dismiss().then(() => {
						navCtrl.push(message_page, {message_id: notification.message_id});
					});
					return false;
				}
			},
			{
				text: 'Dismiss',
				role: 'cancel'
			}
			])
		// acknowledge message at backend
		Promise.resolve("proceed")
		.then((proceed) => {
			console.log("acknowledging message");
			return this.acknowledge_message_sent(notification.message_id, userdata, xml_rpc);
		}).catch((error) => {
			console.log("Error acknowledging message");
		});
	},
	(error) => {
		console.log("error receiving notification");
		console.log(error);
	});
}

static checkFirebaseToken(actualFirebaseToken: string, userdata: any, xml_rpc: any) {
		/* Get firebase token then check if its different from the one stored in localdb
		If localdb firebase token is empty string, xmlrpc to backend to register new firebase token
		If localdb firebase token is not empty string and same as token, no action to be taken.
		If localdb firebase token is not empty string and different from token, xmlrpc to backend to update new token
		*/
		Promise.resolve("proceed")
		.then((res) => {
			return userdata.getValue("firebaseToken");
		}).then((localFirebaseToken: string) => {
			console.log("Local firebase token is: " + localFirebaseToken);
			console.log("Actual firebase token is: " + actualFirebaseToken);
			if (!localFirebaseToken) {
				// register new token to backend``
				console.log("registering new token");
				// save firebase token to localdb
				userdata.localdb.set("firebaseToken", actualFirebaseToken);
				return this.register_new_firebase_token(actualFirebaseToken, userdata, xml_rpc);
			}
			else if (localFirebaseToken && localFirebaseToken != actualFirebaseToken) {
				// update new token to backend
				console.log("updating new token");
				userdata.localdb.set("firebaseToken", actualFirebaseToken);
				return this.update_new_firebase_token(localFirebaseToken, actualFirebaseToken, userdata, xml_rpc);
			}
		}).catch((error) => {
			console.log("Error at checkFirebaseToken during app init");
			// don't crash app. Just proceed.
		});
	}

	static register_new_firebase_token(new_token:string, userdata: any, xml_rpc: any): Promise<any> {
		return new Promise((resolve, reject) => {
			let new_token_values = {
				user_id: userdata.uid,
				token: new_token
			}
			console.log("printing user credentials");
			console.log(userdata);
			xml_rpc.call_api("xt.firebase.token", "create_token", [new_token_values],{},
				(error, new_token_id) => {
					if (error) {
						console.log("Error at toolbox register_new_firebase_token()");
						console.log(error);
						reject(error);
					}
					else {
						resolve(new_token_id);
					}
				});
		});
	}

	static update_new_firebase_token(old_token:string, new_token:string, userdata: any, xml_rpc: any): Promise<any> {
		return new Promise((resolve, reject) => {
			let new_token_values = {
				user_id: userdata.uid,
				token: new_token
			}
			console.log("printing user credentials");
			console.log(userdata);
			xml_rpc.call_api("xt.firebase.token", "update_token", [old_token, new_token, userdata.uid],{},
				(error, result) => {
					if (error) {
						console.log("Error at toolbox update_new_firebase_token()");
						console.log(error);
						reject(error);
					}
					else {
						resolve("proceed");
					}
				});
		});
	}

	static acknowledge_message_sent(message_id: number, userdata: any, xml_rpc: any): Promise<any> {
		return new Promise((resolve, reject) => {
			xml_rpc.call_api("xt.notification.recipient", "set_sent", [message_id, userdata.partner_id],
				{},(error, user_data) => {
					if (error) {
						console.log("Error at toolbox acknowledge_message_sent()");
						console.log(error);
						reject(error);
					}
					else {
						resolve("proceed");
					}
				});
		});
	}

	static checkFileExist(dirPath: string, filename: string): Promise<any> {
		return new Promise((resolve, reject) => {
			let file = new File();
			console.log("trying to find this file: " + dirPath + filename);
			file.checkFile(dirPath, filename)
			.then((exist) => {
				resolve(exist);
			}).catch((error) => {
				console.log("Error at Toolbox checkFileExist");
				console.log(error);
				reject(error);
			});
		});
	}

	// static download_resource(resource_url, targetPath, filename): Promise<any> {
	// 	return new Promise((resolve, reject) => {
	// 		let fileTransfer = new Transfer();
	// 		console.log("filename:" + filename);
	// 		console.log("targetPath:" + targetPath);
	// 		resource_url = Toolbox.fully_qualify_path(resource_url);
	// 		fileTransfer.download(resource_url, targetPath + filename)
	// 		.then((fileEntry: any) => {
	// 			console.log('download complete, opening resource');
	// 			console.log(fileEntry);
	// 			resolve(fileEntry.nativeURL);
	// 		}).catch((error) => {
	// 			console.log("Error at toolbox download_resource()");
	// 			console.log(error);
	// 			reject(error);
	// 		});
	// 	});
	// }

	// static open_resource(resource_native_url): Promise<any> {
	// 	return new Promise((resolve, reject) => {
	// 		let resource_native_url_arr = resource_native_url.split(".");
	// 		let resource_file_type = resource_native_url_arr[resource_native_url_arr.length - 1];
	// 		let file_mime_type:string = "";
	// 		if (resource_file_type == "jpg" || resource_file_type == "jpeg") {
	// 			file_mime_type = "image/jpeg";
	// 		}
	// 		else if (resource_file_type == "png") {
	// 			file_mime_type = "image/png";
	// 		}
	// 		else if (resource_file_type == "pdf") {
	// 			file_mime_type = "application/pdf";
	// 		}
	// 		let fileopener = new FileOpener();
	// 		fileopener.open(resource_native_url, file_mime_type)
	// 		.then(() => {
	// 			console.log("resource opened");
	// 			resolve("proceed");
	// 		}).catch((error) => {
	// 			console.log("error opening resource");
	// 			console.log(error);
	// 			reject(error);
	// 		});
	// 	});
	// }

	static upload_photo_to_google_vision(photo: string, http: Http): Promise<any> {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append("Content-Type","application/json");
			let body = {
				"requests":[
				{
					"image":{
						"content":photo
					},
					"features":[
					{
						"type":"TEXT_DETECTION"
					},
					{
						"type":"LOGO_DETECTION"
                    }/*,
					{
                      "type":"LABEL_DETECTION"
                  }*/
                  ]
              }
              ]
          }

          http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAte0aN6JdRCHpehzpwmebaKeqolfgnk5o", JSON.stringify(body),
          	{headers: headers})
          .map(response => response.json())
          .subscribe(data => {
          	console.log("response from google vision");
          	console.log(data);
          	resolve(data);
          })
      });
	}

	// static get_remote_config(key: string, defaultValue: string, uid: number, xml_rpc: any, usercreator_uid: number): Promise<string> {
	// 	return new Promise((resolve, reject) => {
	// 		let value: string = defaultValue;
	// 		xml_rpc.call_api("xt.remote.config", "get_remote_config", [uid, key],{},
	// 			(error, config_value) => {
	// 				if (error) {
	// 					console.log("Error at toolbox get_remote_config() for " + key + ", uid:" + uid);
	// 					console.log(error);
	// 					reject(error);
	// 				}
	// 				else {
	// 					if (config_value) {
	// 						value = config_value;
	// 					}
	// 					resolve(value);
	// 				}
	// 			}, usercreator_uid, AppSettings.usercreator.password);
	// 	});
	// }

	static call_fb_api(fb: any, firebase: any): Promise<any> {
		return new Promise((resolve, reject) => {
			fb.api("/me?fields=id,name,birthday,gender,email,friends,picture.height(320).width(320)",
				['public_profile', 'user_friends', 'user_birthday'])
			.then((fb_data) => {
				console.log("Printing fb data");
				console.log(fb_data);
				resolve(fb_data);
			})
			.catch((error_msg) => {
				console.log("Facebook API error at login: " + error_msg);
				firebase.logError("Facebook API error at login: " + error_msg);
				reject(error_msg);
			});
		});
	}

	static update_fbuser_user_name(fb_data: any, xml_rpc: any, uid: number, firebase: any): Promise<string> {
		return new Promise((resolve, reject) => {
			// update user account in backend server
			let res_users_values = {
				name: fb_data.name
			}
			xml_rpc.call_api("res.users", "update_user", [uid, res_users_values], {},
				(error, result) => {
					if (error) {
						console.log("Error at update_fbuser_user_name while trying to update facebook user name");
						console.log(error);
						let error_msg = "Error at update_fbuser_user_name while trying to update facebook user name\n";
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


	static update_fbuser_partner_data(fb_data: any, xml_rpc: any, partner_id: number, firebase: any): Promise<string> {
		return new Promise((resolve, reject) => {
			// update user account in backend server
			let gender: string;
			let birthday: string;
			let image_url: string;
			let friends: Array<number> = [];
			if (fb_data.gender == "male" || fb_data.gender == "female") {
				gender = fb_data.gender;
			}
			if (fb_data.birthday.length == 10) {
				birthday = fb_data.birthday.substr(6, 4) + "-" + fb_data.birthday.substr(0, 2) +
				"-" + fb_data.birthday.substr(3, 2);
			}
			else if (fb_data.birthday.length == 4) {
				birthday = "1900" + "-" + fb_data.birthday.substr(0, 2) + "-" +
				fb_data.birthday.substr(3, 2);
			}
			if (fb_data.picture.data.url) {
				image_url = fb_data.picture.data.url
			}
			if (fb_data.friends.data.length > 0) {
				let counter = 0;
				for (let friend_obj of fb_data.friends.data) {
					friends[counter] = friend_obj.id;
					counter = counter + 1;
				}
			}
			let res_partner_values= {
				gender: gender,
				birthday: birthday,
				image_url: image_url,
				friends: friends
			}
			xml_rpc.call_api("res.partner", "update_partner", [partner_id, res_partner_values], {},
				(error, result) => {
					console.log(res_partner_values);
					if (error) {
						console.log("Error at login update_fbuser_partner_data");
						console.log(error);
						let error_msg = "Error at login update_fbuser_partner_data\n";
						error_msg = error_msg + error;
						firebase.logError(error_msg);
						reject(error);
					}
					else {
						console.log("result at toolbox update_fb_data="+result);
						resolve("proceed");
					}
				});
		});
	}

	static get_consumer_address_ids(xml_rpc: any, partner_id: number, firebase: any): Promise<any> {
		// Get array of address ids of this consumer
		return new Promise((resolve, reject) => {
			xml_rpc.call_api("res.partner", "read", [partner_id], {fields: ["c_address_ids"]},
				(error, address_ids) => {
					if (error) {
						console.log("error at new3fillDetails get_consumer_address_ids()");
						let error_msg = "error at new3fillDetails get_consumer_address_ids\n";
						error_msg = error_msg + error;
						firebase.logError(error_msg);
						reject(error);
					}
					else if (address_ids != "false" && (address_ids.c_address_ids instanceof Array &&
						address_ids.c_address_ids.length > 0)){
						console.log("consumer address ids fetched");
					resolve(address_ids.c_address_ids);
				}
				else {
					console.log("address_ids array is empty");
					console.log(address_ids);
					resolve([]);
				}
			});
		})
	}

	static get_consumer_addresses(xml_rpc: any, consumer_address_ids: any, firebase: any): Promise<any> {
		// Get array of address ids of this consumer
		return new Promise((resolve, reject) => {
			xml_rpc.call_api("res.address", "read", [consumer_address_ids], {fields: ["title"]},
				(error, addresses) => {
					if (error) {
						console.log("error at new3fillDetails get_consumer_address()");
						let error_msg = "error at new3fillDetails get_consumer_address\n";
						error_msg = error_msg + error;
						firebase.logError(error_msg);
						reject(error);
					}
					else {
						console.log("consumer addresses fetched");
						console.log(addresses);
						resolve(addresses);
					}
				});
		});
	}

	static get_available_warranties(xml_rpc: any, warranty_ids: any, firebase: any): Promise<any> {
		// Get array of available warranties for this selected product
		return new Promise((resolve, reject) => {
			xml_rpc.call_api("warranty.warranty", "read", [warranty_ids],
				{fields: ["id","title"]}, (error, warranties) => {
					if (error) {
						console.log("error at new3fillDetails get_available_warranties()");
						let error_msg = "error at new3fillDetails get_available_warranties()";
						error_msg = error_msg + error;
						firebase.logError(error_msg);
						reject(error);
					}
					else {
						console.log("available warranties fetched");
						console.log(warranties);
						resolve(warranties);
					}
				});
		});
	}

	static get_latest_app_version(xml_rpc: any,device_os: any): Promise<string> {
		return new Promise((resolve, reject) => {
			// update user account in backend server
			console.log(device_os)
			xml_rpc.call_api("xt.tracking.setting", "get_app_latest_version", [device_os], {},
				(error, result) => {
					if (error) {
						console.log("Error at get_latest_app_version while trying to check update for " + device_os);
						console.log(error);
					}
					else {
						console.log("Latest Version=" + result);
						resolve(result);
					}
				});
		});
	}


	static isValidMailFormat(control: FormControl){

		let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (control.value == "" || (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {

			return { "Please provide a valid email": true };
		}

		return null;
	}

	static isValidNumberFormat(control: FormControl){
		let NUMBER_REGEXP =  /^((\+91\s{0,1}\-\s{0,1})|(\+91{\s{0,1}})|(\+91\s{0,1})|(91\s{0,1})|(0))?(\d{10})$/;
		if (control.value == "" || (control.value.length < 10 || !NUMBER_REGEXP.test(control.value))) {

			return { "Please provide a valid number": true };
		}
		return null;
	}

	static isValidPasswordFormat(control: FormControl){
		let PASSWORD_REGEX = /(?=^.{6,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

		if (control.value == "" || !PASSWORD_REGEX.test(control.value)) {

			return { "Please provide a valid number": true };
		}
		return null;

	}

}
