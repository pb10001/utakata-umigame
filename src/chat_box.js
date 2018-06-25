var moment = require('moment');
module.exports = {
  templateUrl: 'chat_box.html',
  bindings: {
    msg: '<',
    parent: '<'
  },
  controller: function(socket) {
    var self = this;
    this.$onInit = function() {
      setInterval(clock, 1000);
    };
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
    function clock() {
      var val = moment(self.msg.date)
        .utcOffset('+09:00')
        .fromNow();
      if (document.getElementById('date' + self.msg.id))
        document.getElementById('date' + self.msg.id).textContent = val;
    }
  }
};
