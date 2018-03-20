import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { SettingsProvider as settings} from '../settings/settings';
import { Connectivity } from '../../services/connectivity';
import { UserData } from '../../providers/userdata';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServiceProvider {
    /**
    * Constructor method
    *
    * @Arguments:
    *    <http>: instance of Angular Http
    *
    * @Returns: InstabloodApiProvider instance
    */
    constructor(private http: Http, public connectivity: Connectivity,
        public userdata: UserData) {}

    /**
    * Method to check weeather a given string is 
    * JSON or not
    *
    * @Arguments: 
    *   <str>: String
    *
    * @Returns: boolean
    */
    public isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
    * Method to call the api
    *
    * @Arguments:
    *   <url>: partial url to be called
    *   <options>: Object containing the header, body etc.
    *
    * @Return: Prmose.
    */
    public callApi(url:string, options:any={}):Promise<any> {
        return new Promise((resolve, reject) => {
        	let baseURL:string = "https://esspl-testing.firebaseio.com";
            console.log(JSON.stringify(options));
            let fullUrl:string = baseURL
                               + "/" 
                               + url.replace(/^\//,'')
                               + ".json";
            let request:any;
            let body:any = "";
            let headers:Headers;
            let responseObj:any = {};

            headers = new Headers();
            headers.append("Content-Type","application/json");
            
            let reqOpt:RequestOptions = new RequestOptions({headers: headers});

            // If the given body is object, then convert
            // them into body.
            if (typeof(options.body) == "object") {
                body = JSON.stringify(options.body);
            }
            let requestMehod: string = (options.method) ? options.method.toLowerCase() : "get";
            switch(requestMehod) {
                case "get":
                    request = this.http.get(fullUrl, reqOpt);
                    break;
                case "post":
                    request = this.http.post(fullUrl, body, reqOpt);
                    break;
                case "put":
                    request = this.http.put(fullUrl, body, reqOpt);
                    break;
                case "delete":
                    request = this.http.delete(fullUrl, reqOpt);
                    break;
            }
            request.subscribe(data => {
                console.log(data);
                responseObj.status  = data.status;
                responseObj.isError = false;
                responseObj.headers = data.headers;
                responseObj.body    = (this.isJson(data.text())) ? data.json() : data.text();
                return resolve(responseObj.body);
            }, error => {
                console.log(JSON.stringify(error));
                responseObj.status  = error.status;
                responseObj.isError = true;
                responseObj.headers = error.headers;
                responseObj.body    = (this.isJson(error.text())) ? error.json() : error.text();
                return reject(responseObj);
            }); 
        });
    }

    getRidesInformation():Promise<any> { 
        return this.callApi("drivers");
    }

    updateRideLocation(number,values):Promise<any> { 
        return this.callApi("riders/" + number + "/location",values);
    }

    updateDriverLocation(driverNumber,values):Promise<any> { 
        return this.callApi("drivers/" + driverNumber + "/location",values);
    }

    openABooking(userNumber,values):Promise<any> { 
        return this.callApi("open_bookings/" + userNumber,values);
    }

    getMobileStatus(countryId,mobileNumber):Promise<any> { 
        return this.callApi("mobiles/" + mobileNumber + "/countries/" + countryId + "/status");
    }

    getAllCountries():Promise<any> { 
        return this.callApi("countries");
    }

    getCountryById(countryId:number):Promise<any> { 
        return this.callApi("countries/" + countryId);
    }

    getCurrentCountry():Promise<any> { 
        return this.callApi("current-ip-location");
    }

    getStates(countryId:number):Promise<any> { 
        return this.callApi("countries/" + countryId.toString() + "/states");
    }

    getState(stateId:number):Promise<any> { 
        return this.callApi("states/" + stateId.toString());
    }

    createUser(values: any):Promise<any> {
        return this.callApi("users/create",values);
    }  

    verifySignUpOTP(values: any):Promise<any> {
        return this.callApi("users/verify/signup/otp ",values);
    }  

    generateAuthToken(values: any):Promise<any>{
        return this.callApi("auth/tokens",values);
    }

    resetPassword(values: any): Promise<any>{
        return this.callApi("users/forgot/password",values);
    }

    setCurrentLocation(values : any):Promise<any>{
        return this.callApi("my/current/location",values);
    }

    getRefreshToken(values: any): Promise <any>{
        return this.callApi("auth/refresh/tokens",values);
    }
}

/**
      
    Method to get list of countries
        @Arguments: void
        @Returns: Promise
        getAllCountries()

    Method to get get country by id
        @Arguments: <countryId>: number
        @Returns: Promise
        getCountryById()

    Method to get country ip location
        @Arguments: void
        @Returns: Promise
        getCurrentCountry()

    Method to get states of a country
        @Arguments: <countryId>: number
        @Returns: Promise
        getStates()

    Method to get state of an country
        @Arguments:  <stateId>: number
        @Returns: Promise
        getState()


 */