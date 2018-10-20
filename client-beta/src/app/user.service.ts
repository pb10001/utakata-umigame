import { Injectable } from '@angular/core';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  storage: User;
  constructor() {
    if (localStorage.user) {
      this.load();
    } else {
      this.storage = {
        name: '',
        room: '',
        removePass: '',
        currentContent: ''
      };
      this.save();
    }
  }
  setName (value) {
    this.storage.name = value;
    this.save();
  }
  getName () {
    this.load();
    return this.storage.name;
  }
  setRemovePass (value) {
    this.storage.removePass = value;
    this.save();
  }
  getRemovePass () {
    this.load();
    return this.storage.removePass;
  }
  setRoom (value) {
    this.storage.room = value;
    this.save();
  }
  getRoom () {
    this.load();
    return this.storage.room;
  }
  setCurrentContent (value) {
    this.storage.currentContent = value;
    this.save();
  }
  load () {
    this.storage = JSON.parse(localStorage.user);
  }
  save () {
     localStorage.user = JSON.stringify(this.storage);
  }
  getCurrentContent () {
    return this.storage.currentContent;
  }
}
