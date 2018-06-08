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
        template: '<chat></chat>',
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
      .when('/lobby', {
        templateUrl: '/lobby.html',
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
module.exports = app;
