module.exports = function() {
  this.name = 'Anonymousでーす';
  this.removePass = '';
  this.getName = function() {
    return this.name;
  };
  this.setName = function(name) {
    this.name = name;
  };
};
