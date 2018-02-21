var app = require('./angular-init');
var chatController = require('./chat');
var http = require('http');
//var puzzleUrl = "http://localhost:5000/";
var puzzleUrl = 'https://utakata-umigame.herokuapp.com/';
function enterController() {
  this.roomName = '';
}
function publicController() {
  this.roomName = 'Public';
}
function currentController() {
  http
    .get(puzzleUrl + 'puzzles?room=Public', res => {
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
    '<h3 class="sawarabi" style="color: #FFF; text-align: center;">チャットをはじめる</h3>',
    '<div class="input-append">',
    '<input ng-model="$ctrl.roomName" class="form-control" style="margin-bottom:10px;" placeholder="Room Name">',
    '<a class="btn btn-white" ng-href="/mondai/{{$ctrl.roomName}}">新規作成/入室</a>',
    '</div>'
  ].join(''),
  controller: enterController
});
app.component('public', {
  template:
    '<a class="btn btn-default" ng-href="/mondai/{{$ctrl.roomName}}">この問題を解く</a>',
  controller: publicController
});
app.component('current', {
  template:
    '<h3 class="sawarabi">- Publicで出題中 -</h3><h4 id="current-content" class="sawarabi" style="white-space: pre-wrap; text-align: center;"></h4>',
  controller: currentController
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
app.controller('ChatController', chatController);
