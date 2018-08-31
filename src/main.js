var app = require('./angular-init');
var chatComponent = require('./chat');
var chatBoxComponent = require('./chat_box');
var lobbyComponent = require('./lobby');
var mondaiLinkComponent = require('./mondai_link');
var configComponent = require('./config');
var editMondaiComponent = require('./edit_mondai');
var editAnswerComponent = require('./edit_answer');
var editLobbyComponent = require('./edit_lobby');
var userService = require('./user');
var http = require('http');
var io = require('socket.io-client');

//Load scss
require('./panel.scss');
require('./dialog.scss');
require('./chatbox.scss');

app.factory('socket', function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

app.component('links', {
  templateUrl: 'link.html',
  controller: ''
});
app.component('chat', chatComponent);
app.component('chatbox', chatBoxComponent);
app.component('lobby', lobbyComponent);
app.component('mondailink', mondaiLinkComponent);
app.component('config', configComponent);
app.component('editmondai', editMondaiComponent);
app.component('editanswer', editAnswerComponent);
app.component('editlobby', editLobbyComponent);
app.service('userService', userService);
