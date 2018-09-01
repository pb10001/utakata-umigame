module.exports = {
  templateUrl: 'chat_box.html',
  bindings: {
    msg: '<',
    parent: '<',
    editable: '<'
  },
  controller: function(socket, userService) {
    this.$onInit = function() {};
    this.getLink = function() {
      return '#' + this.msg.id;
    };
    this.remove = function() {
      this.parent.removeChat(this.msg.id);
    };
    this.editLobby = function() {
      console.log(this.msg);
      this.parent.editChat(this.msg.id, this.msg.content);
    };
    this.setId = function(id) {
      userService.setId(id);
      userService.setCurrentContent(this.msg.content);
    };
  }
};
