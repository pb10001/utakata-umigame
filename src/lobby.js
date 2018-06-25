var async = require('async');
var moment = require('moment');

var lobbyComponent = {
  templateUrl: 'lobby_chat.html',
  bindings: {},
  controller: function(socket, userService) {
    var allMessages = [];
    var self = this;
    this.messages = [];
    this.roomName = '';
    this.text = '';
    this.name = '';
    this.removePass = '';
    this.roster = [];
    this.$onInit = function() {
      this.name = userService.getName();
      this.removePass = userService.getRemovePass();
      this.roomName = userService.getRoom();
      this.page = 0;
      this.perPage = 10;
      this.setName();
      socket.emit('fetchLobby');
    };
    socket.on('connect', function() {
      socket.emit('join', 'LobbyChat');
      socket.emit('fetchLobby');
    });
    socket.on('lobbyChat', function(msg) {
      allMessages = msg;
      refresh(msg);
    });
    socket.on('roster', function(msg) {
      self.roster = msg;
    });
    this.send = function send() {
      var data = {
        type: 'lobbyChat',
        name: this.name,
        content: this.text,
        removePass: this.removePass
      };
      console.log('Sending message:', data);
      socket.emit('message', data);
      this.text = '';
    };
    this.setName = function setName() {
      socket.emit('identify', this.name);
      userService.setName(this.name);
    };
    this.setRemovePass = function setRemovePass() {
      userService.setRemovePass(this.removePass);
    };
    this.editChat = function editChat(id, content) {
      var data = {
        id: id,
        content: content,
        removePass: this.removePass
      };
      socket.emit('editLobby', data);
    };
    this.removeChat = function removeChat(id) {
      var data = {
        id: id,
        removePass: this.removePass
      };
      socket.emit('removeLobby', data);
    };
    this.zeroPage = function zeroPage() {
      this.page = 0;
      refresh(allMessages);
    };
    this.nextPage = function nextPage() {
      this.page += 1;
      refresh(allMessages);
    };
    this.prevPage = function prevPage() {
      if (this.page == 0) return;
      this.page -= 1;
      refresh(allMessages);
    };
    this.movePage = function movePage(num) {
      if (num < 0) return;
      this.page = num;
      console.log(num);
      refresh(allMessages);
    };
    function refresh(msg) {
      var tmp = [];
      //ページネーション
      for (var i = 0; i < self.perPage; i++) {
        tmp.push(msg[self.page * self.perPage + i]);
      }
      async.map(
        tmp,
        function(message, callback) {
          if (message) message.relDate = moment(message.date).fromNow();
          callback(null, message);
        },
        function(err, res) {
          console.log(res);
          self.messages = [];
          for (var key in res)
            if (res[key] !== undefined) self.messages.push(res[key]);
        }
      );
    }
  }
};
module.exports = lobbyComponent;
