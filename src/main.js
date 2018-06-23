var app = require('./angular-init');
var chatComponent = require('./chat');
var chatBoxComponent = require('./chat_box');
var lobbyComponent = require('./lobby');
var mondaiLinkComponent = require('./mondai_link');
var userService = require('./user');
var http = require('http');
//socket.ioの依存性注入
var io = require('socket.io-client');
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
  template: [
    '<div class="sawarabi">',
    '<div class="sawarabi">',
    '<h3 class="sawarabi">',
    '<a target="_blank" href="https://github.com/pb10001/utakata-umigame/wiki">Wiki</a>',
    '</h3>',
    '<h3 class="sawarabi">',
    '<a target="_blank" href="https://github.com/pb10001/utakata-umigame/wiki/利用規約">利用規約</a>',
    '</h3>',
    '<h3>他サイトへのリンク</h3>',
    '<p>',
    '<a target="_blank" href="http://www.cindythink.com">Cindy</a>',
    '<a target="_blank" href="https://wiki3.jp/cindy-lat">(Wiki)</a>',
    '</p>',
    '<p>',
    '<a target="_blank" href="http://openumigame.sakura.ne.jp/openumi/">Openウミガメ R鯖</a>',
    '</p>',
    '<p>',
    '<a target="_blank" href="http://sui-hei.net">ラテシン</a>',
    '</p>',
    '</div>',
    '</div>'
  ].join(''),
  controller: ''
});
app.component('chat', chatComponent);
app.component('chatbox', chatBoxComponent);
app.component('lobby', lobbyComponent);
app.component('mondailink', mondaiLinkComponent);
app.service('userService', userService);