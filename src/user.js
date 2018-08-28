/* global localStorage */
module.exports = function() {
  /* ユーザー設定をカプセル化 */
  this.name = '';
  this.removePass = '';
  this.currentRoom = '';
  this.storage = localStorage;
  this.getName = function() {
    if(this.name) return this.name;
    else if(this.storage.name) return this.storage.name;
    else return '';
  };
  this.setName = function(name) {
    this.name = name;
    this.storage.name = name;
  };
  this.getRemovePass = function() {
    if(this.removePass) return this.removePass;
    else if(this.storage.removePass) return this.storage.removePass;
    else return '';
  };
  this.setRemovePass = function(removePass) {
    this.removePass = removePass;
    this.storage.removePass = removePass;
  };
  this.getRoom = function() {
    if(this.currentRoom) return this.currentRoom;
    else if(this.storage.currentRoom) return this.storage.currentRoom;
    else return '';
  };
  this.setRoom = function(room) {
    this.currentRoom = room;
    this.storage.currentRoom = room;
  };
  this.getPerPage = function() {
    if(this.perPage) return this.perPage;
    else if(this.storage.perPage) return this.storage.perPage;
    else return 10;
  };
  this.setPerPage = function(value) {
    this.perPage = value;
    this.storage.perPage = value;
  };
};
