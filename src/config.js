var configComponent = {
  templateUrl: 'config.html',
  bindings: {},
  controller: function(userService) {
    this.$onInit = function() {
        this.name = userService.getName();
        this.removePass = userService.getRemovePass();
    };
    this.setName = function setName() {
      userService.setName(this.name);
    };
    this.setRemovePass = function setRemovePass() {
      userService.setRemovePass(this.removePass);
    };
  }
};
module.exports = configComponent;
