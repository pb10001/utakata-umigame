import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  storage = localStorage;
  constructor() { }
  setName (value) {
    this.storage.name = value;
  }
  getName () {
    return this.storage.name;
  }
  setRemovePass (value) {
    this.storage.removePass = value;
  }
  getRemovePass () {
    return this.storage.removePass;
  }
  setRoom (value) {
    this.storage.room = value;
  }
  getRoom () {
    return this.storage.room;
  }
  setCurrentContent (value) {
    this.storage.currentContent = value;
  }
  getCurrentContent () {
    return this.storage.currentContent;
  }
}
