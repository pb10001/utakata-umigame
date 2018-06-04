var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('App', ['ngRoute']);
app.config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $routeProvider
      .when('/mondai', {
        redirectTo: '/'
      })
      .when('/mondai/:room', {
        templateUrl: '/mondai.html',
        controller: 'ChatController'
      })
      .when('/privacy_policy', {
        templateUrl: 'privacy_policy.html',
        controller: ''
      })
      .when('/link', {
        template: [
          '<div class="row">',
          '<links></links>',
          '<button class="btn btn-default" style="width:100%" onclick="location.href=\'/\'">Back</button>',
          '</div>'
        ].join(''),
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
//socket.ioの依存性注入
var io = require('socket.io-client');
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

module.exports = app;
