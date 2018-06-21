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
    this.remove = function() {
      this.parent.remove(this.msg.id);
    };
    this.editLobby = function() {
      console.log(this.msg);
      this.parent.edit(this.msg.id, this.msg.content);
    };
  }
};
