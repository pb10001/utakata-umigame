var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');

$(document).on('click', '.heart-animation', function(){
  $('.heart-animation').toggleClass('active');
});

var app = angular.module('App', ['ngRoute']);
app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false    
  });
  $routeProvider
    .when('/',{
        templateUrl:'/top_page_beta.html',
        controller:''
    })
    .when('/mondai/:room',{
        templateUrl : '/mondai.html',
        controller : 'ChatController'
    })
    .when('/privacy_policy',{
        templateUrl: 'privacy_policy.html',
        controller:''
    })
	.otherwise({
		redirectTo: '/'
	});
  }]);
  
module.exports = app;