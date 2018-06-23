module.exports = function() {
  this.name = 'Anonymous';
  this.removePass = '';
  this.currentRoom = '';
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
};
