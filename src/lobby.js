var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('App', []);
var io = require('socket.io-client');
var lobbyChatController= function($scope){
  var socket = io.connect();
  $scope.messages = [];
  $scope.text = '';
  $scope.name = '';
  $scope.removePass = '';
  socket.on('connect', function() {
    socket.emit('join', 'LobbyChat');
    socket.emit('fetchLobby');
  });
  socket.on('lobbyChat', function(msg){
    $scope.messages = msg;
    $scope.$apply();
  });
  $scope.send = function send() {
    var data = {
      type: 'lobbyChat',
      name: $scope.name,
      content: $scope.text,
      removePass: $scope.removePass
    };
    console.log('Sending message:', data);
    socket.emit('message', data);
    $scope.text = '';
  };
  $scope.setName = function setName(){
    socket.emit('identify', $scope.name);
  };
  $scope.remove = function remove(id){
    var data = {
      id: id,
      removePass: $scope.removePass
    };
    socket.emit('removeLobby', data);
  };
};
app.controller("lobbyChatController", lobbyChatController);
