var editComponent = {
  templateUrl: 'edit_mondai.html',
  bindings: {},
  controller: function(socket, userService) {
    this.$onInit = function() {
      this.room = userService.getRoom();
      this.subject = 'ロビー';
      this.content = userService.getCurrentContent();
      this.id = userService.getId();
      this.callback = '/lobby';
      this.removePass = userService.getRemovePass();
    };
    this.send = function send(id, content) {
      var data = {
        id: this.id,
        content: this.content,
        removePass: this.removePass
      };
      console.log('sending', data);
      socket.emit('editLobby', data);
    };
  }
};
module.exports = editComponent;