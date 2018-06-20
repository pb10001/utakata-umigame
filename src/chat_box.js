module.exports = {
  templateUrl: 'chat_box.html',
  bindings: {
    msg: '<',
    parent: '<'
  },
  controller: function(socket) {
    this.getLink = function() {
      return '#' + this.msg.id;
    };
    this.remove = function remove(id) {
      var data = {
        id: id,
        removePass: this.parent.removePass
      };
      console.log(data);
      socket.emit('removeLobby', data);
    };
    this.editLobby = function() {
      this.msg.removePass = this.parent.removePass;
      console.log(this.msg);
      socket.emit('editLobby', this.msg);
    };
  }
};
