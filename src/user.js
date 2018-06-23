module.exports = function() {
  this.name = 'Anonymous';
  this.removePass = '';
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
};
