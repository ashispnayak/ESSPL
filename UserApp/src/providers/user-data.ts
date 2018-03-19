import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public events: Events, public storage: Storage) {}

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

  setDisplayName(resName){
  this.storage.set('Name', resName);
  }
  setDisplayEmail(resEmail){
    this.storage.set('Email', resEmail);
  }
  setDisplayImage(resImage){
    this.storage.set('ImageUrl', resImage);
  }
  

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username) {
    this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };
  getName(){
    return this.storage.get('name').then((value)=>{
      return value;
    });
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get('hasLoggedIn').then((value) => {
      console.log('hello');
      console.log(value);
      return value;
    });
  };



  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };
}
