var app = require('./angular-init');
var chatController = require('./chat');
function enterController(){
    this.roomName = '';
}
app.component('enter',{
	template: ['<div class="input-append">',
			  '<input ng-model="$ctrl.roomName" class="form-control" placeholder="Room Name">',
			  '<a class="btn btn-default" ng-href="/mondai/{{$ctrl.roomName}}">新規作成/入室</a>',
		      '</div>'].join(''),
  controller: enterController
});
app.controller('ChatController', chatController);