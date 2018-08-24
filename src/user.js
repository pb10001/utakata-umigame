module.exports = function() {
  this.name = '';
  this.removePass = '';
  this.currentRoom = '';
  this.getName = function() {
    if(this.name) return this.name;
    else if(sessionStorage.name) return sessionStorage.name;
    else return 'Anonymous';
  };
  this.setName = function(name) {
    this.name = name;
    sessionStorage.name = name;
  };
  this.getRemovePass = function() {
    if(this.removePass) return this.removePass;
    else if(sessionStorage.removePass) return sessionStorage.removePass;
    else return '';
  };
  this.setRemovePass = function(removePass) {
    this.removePass = removePass;
    sessionStorage.removePass = removePass;
  };
  this.getRoom = function() {
    return this.currentRoom;
  };
  this.setRoom = function(room) {
    this.currentRoom = room;
  };
  this.getPerPage = function() {
    if(this.perPage) return this.perPage;
    else if(sessionStorage.perPage) return sessionStorage.perPage;
    else return 10;
  };
  this.setPerPage = function(value) {
    this.perPage = value;
    sessionStorage.perPage = value;
  };
};
