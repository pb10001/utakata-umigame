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
}
