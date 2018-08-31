var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');

/* Load scss */
require('./nav.scss');
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
        template: '<chat></chat>'
      })
      .when('/mondai/lobbyChats', {
        redirectTo: '/mondai'
      })
      .when('/mondai/:room', {
        template: '<chat></chat>',
        controller: ''
      })
      .when('/edit_mondai',{
        template: '<editmondai></editmondai>',
        controller: ''
      })
      .when('/edit_answer',{
        template: '<editanswer></editanswer>',
        controller: ''
      })
      .when('/privacy_policy', {
        templateUrl: 'privacy_policy.html',
        controller: ''
      })
      .when('/link', {
        template: '<links></links>',
        controller: ''
      })
      .when('/lobby', {
        template: '<lobby></lobby>',
        controller: ''
      })
      .when('/config', {
        template: '<config></config>',
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
module.exports = app;
