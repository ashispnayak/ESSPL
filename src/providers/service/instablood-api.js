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
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SettingsProvider as settings } from '../settings/settings';
import { Connectivity } from '../../services/connectivity';
import { UserData } from '../../providers/userdata';
var InstabloodApiProvider = (function () {
    /**
    * Constructor method
    *
    * @Arguments:
    *    <http>: instance of Angular Http
    *
    * @Returns: InstabloodApiProvider instance
    */
    function InstabloodApiProvider(http, connectivity, userdata) {
        this.http = http;
        this.connectivity = connectivity;
        this.userdata = userdata;
    }
    /**
    * Method to check weeather a given string is
    * JSON or not
    *
    * @Arguments:
    *   <str>: String
    *
    * @Returns: boolean
    */
    InstabloodApiProvider.prototype.isJson = function (str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    };
    /**
    * Method to call the api
    *
    * @Arguments:
    *   <url>: partial url to be called
    *   <options>: Object containing the header, body etc.
    *
    * @Return: Prmose.
    */
    InstabloodApiProvider.prototype.callApi = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            console.log(options);
            var fullUrl = settings.API_URL.replace(/\/$/, '')
                + "/"
                + settings.API_VERSION
                + "/"
                + url.replace(/^\//, '');
            var request;
            var body = "";
            var headers;
            var responseObj = {};
            headers = new Headers();
            headers.append("INSTABLOOD-APP-ID", settings.API_ID);
            headers.append("INSTABLOOD-SECRET", settings.API_SECRET);
            headers.append("Content-Type", "application/json");
            // If the headers provided in options is 
            // object then include them in header also.
            if (typeof (options.headers) == "object") {
                for (var key in options.headers) {
                    headers.append(key, options.headers[key]);
                }
            }
            var reqOpt = new RequestOptions({ headers: headers });
            // If the given body is object, then convert
            // them into body.
            if (typeof (options.body) == "object") {
                body = JSON.stringify(options.body);
            }
            var requestMehod = (options.method) ? options.method.toLowerCase() : "get";
            switch (requestMehod) {
                case "get":
                    request = _this.http.get(fullUrl, reqOpt);
                    break;
                case "post":
                    request = _this.http.post(fullUrl, body, reqOpt);
                    break;
                case "put":
                    request = _this.http.put(fullUrl, body, reqOpt);
                    break;
                case "delete":
                    request = _this.http.delete(fullUrl, reqOpt);
                    break;
            }
            request.subscribe(function (data) {
                console.log(data);
                responseObj.status = data.status;
                responseObj.isError = false;
                responseObj.headers = data.headers;
                responseObj.body = (_this.isJson(data.text())) ? data.json() : data.text();
                return resolve(responseObj);
            }, function (error) {
                console.log(JSON.stringify(error));
                responseObj.status = error.status;
                responseObj.isError = true;
                responseObj.headers = error.headers;
                responseObj.body = (_this.isJson(error.text())) ? error.json() : error.text();
                return reject(responseObj);
            });
        });
    };
    InstabloodApiProvider.prototype.getMobileStatus = function (countryId, mobileNumber) {
        return this.callApi("mobiles/" + mobileNumber + "/countries/" + countryId + "/status");
    };
    InstabloodApiProvider.prototype.getAllCountries = function () {
        return this.callApi("countries");
    };
    InstabloodApiProvider.prototype.getCountryById = function (countryId) {
        return this.callApi("countries/" + countryId);
    };
    InstabloodApiProvider.prototype.getCurrentCountry = function () {
        return this.callApi("current-ip-location");
    };
    InstabloodApiProvider.prototype.getStates = function (countryId) {
        return this.callApi("countries/" + countryId.toString() + "/states");
    };
    InstabloodApiProvider.prototype.getState = function (stateId) {
        return this.callApi("states/" + stateId.toString());
    };
    InstabloodApiProvider.prototype.createUser = function (values) {
        return this.callApi("users/create", values);
    };
    InstabloodApiProvider.prototype.verifySignUpOTP = function (values) {
        return this.callApi("users/verify/signup/otp ", values);
    };
    InstabloodApiProvider.prototype.generateAuthToken = function (values) {
        return this.callApi("auth/tokens", values);
    };
    InstabloodApiProvider.prototype.resetPassword = function (values) {
        return this.callApi("users/forgot/password", values);
    };
    InstabloodApiProvider.prototype.setCurrentLocation = function (values) {
        return this.callApi("my/current/location", values);
    };
    InstabloodApiProvider.prototype.getRefreshToken = function (values) {
        return this.callApi("auth/refresh/tokens", values);
    };
    return InstabloodApiProvider;
}());
InstabloodApiProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, Connectivity,
        UserData])
], InstabloodApiProvider);
export { InstabloodApiProvider };
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
//# sourceMappingURL=instablood-api.js.map