var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('App', []);
var io = require('socket.io-client');
app.component('free', {
  templateUrl: '/free_chat.html',
  controller: 'freeChatController'
});
function freeChatController(){
  var socket = io.connect();
  socket.emit('join', 'free');
  socket.on('message', function(msg){
    $('#test').before('<div>'+msg+'</div>');
  });
}
