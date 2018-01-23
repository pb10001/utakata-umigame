var app = require('./angular-init');
var chatController = require('./chat');
function enterController(){
  this.roomName = '';
}
function publicController(){
  this.roomName = 'Public';
}
app.component('enter',{
	template: ['<h3 class="sawarabi">チャットをはじめる</h3>',
        '<div class="input-append">',
			  '<input ng-model="$ctrl.roomName" class="form-control" placeholder="Room Name">',
			  '<a class="btn btn-default" ng-href="/mondai/{{$ctrl.roomName}}">新規作成/入室</a>',
		      '</div>'].join(''),
  controller: enterController
});
app.component('public',{
  template:'<a class="btn btn-default" ng-href="/mondai/{{$ctrl.roomName}}">Publicルームへ</a>',
  controller: publicController
})
app.controller('ChatController', chatController);
