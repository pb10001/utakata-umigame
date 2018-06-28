var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('App', []);
var http = require('http');

//Load scss
require('./top.scss');

function enterController() {
  this.roomName = '';
  this.getRoomName = function() {
    console.log(this.roomName);
    return encodeURI(this.roomName).replace(/\//g, '');
  };
}
function currentController() {
  http
    .get('/puzzles?room=Public', res => {
      var body = '';
      res.setEncoding('utf8');

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', res => {
        res = JSON.parse(body);
        document.getElementById('current-content').textContent =
          res.mondai.content;
      });
    })
    .on('error', e => {
      console.log('error:', e.message); //エラー時
    });
}
app.component('enter', {
  template: [
    '<div class="input-append">',
    '<input ng-model="$ctrl.roomName" class="form-control" style="margin-bottom:10px; color:#FFF; background: #333; opacity: 0.8;" placeholder="Room Name">',
    '<a class="btn btn-white" ng-href="/mondai/{{$ctrl.getRoomName()}}">新規作成/入室</a>',
    '</div>'
  ].join(''),
  controller: enterController
});
app.component('public', {
  template: '<a class="btn btn-white" href="/lobby">はじめる</a>'
});
app.component('current', {
  template:
    '<h3 class="sawarabi">- Publicで出題中 -</h3><h4 id="current-content" class="sawarabi" style="white-space: pre-wrap; text-align: center;"></h4>',
  controller: currentController
});
