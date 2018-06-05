var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('App', []);*/

var lobbyController= function lobbyController(socket){
  var allMessages = [];
  var self = this;
  this.messages = [];
  this.text = '';
  this.name = '';
  this.removePass = '';
  this.page = 0;
  this.perPage = 10;
  socket.on('connect', function() {
    socket.emit('join', 'LobbyChat');
    socket.emit('fetchLobby');
  });
  socket.on('lobbyChat',function(msg){
    allMessages = msg;
    refresh(msg);
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
  this.setName = function setName(){
    socket.emit('identify', this.name);
  };
  this.remove = function remove(id){
    var data = {
      id: id,
      removePass: this.removePass
    };
    socket.emit('removeLobby', data);
  };
  this.zeroPage = function zeroPage(){
    this.page = 0;
    refresh(allMessages);
  }
  this.nextPage = function nextPage(){
    this.page += 1;
    refresh(allMessages);
  }
  this.prevPage = function prevPage(){
    if(this.page == 0) return;
    this.page -= 1;
    refresh(allMessages);
  }
  this.quit = function quit() {
    socket.emit('disconnect');
    location.href = '/';
  };
  function refresh(msg){
    var tmp = [];
    for(var i=0; i < self.perPage; i++){
      tmp.push(msg[self.page*self.perPage + i]);
    }
    self.messages = tmp;
  }
};
module.exports = lobbyController;
