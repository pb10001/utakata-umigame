module.exports = function() {
  this.name = '';
  this.removePass = '';
  this.currentRoom = '';
  this.perPage = 10;
  this.getName = function() {
    return this.name;
  };
  this.setName = function(name) {
    this.name = name;
  };
  this.getRemovePass = function() {
    return this.removePass;
  };
  this.setRemovePass = function(removePass) {
    this.removePass = removePass;
  };
  this.getRoom = function() {
    return this.currentRoom;
  };
  this.setRoom = function(room) {
    this.currentRoom = room;
  };
  this.getPerPage = function() {
    return this.perPage;
  };
  this.setPerPage = function(value) {
    this.perPage = value;
  };
};
