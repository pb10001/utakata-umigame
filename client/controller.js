var app = angular.module('App', ['ngRoute']);
app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false    
  });
  $routeProvider
    .when('/',{
        templateUrl:'top_page.html',
        controller:''
    })
    .when('/mondai',{
        templateUrl : 'mondai.html',
        controller : 'ChatController'
    })
    .when('/privacy_policy',{
        templateUrl: 'privacy_policy.html',
        controller:''
    })
  }]).controller('ChatController', function chatController($scope){
  var socket = io.connect();
  $scope.messages = [];
  $scope.privateMessages = [];
  $scope.roster = [];
  $scope.name = '';
  $scope.text = '';
  $scope.answer = '';
  $scope.sender = '';
  $scope.mondai ={
      sender:'',
      content:''
  }
  $scope.ansContent='';
  $scope.publicText='';
  $scope.privateText='';
  $scope.toId=-1;
  $scope.currentRoom='-';
  socket.on('connect', function () {
    $scope.setName();
  });
  socket.on('join', function(roomNum){
    $scope.currentRoom=roomNum;
  });
  socket.on('mondai', function(msg){
    $scope.mondai = msg||{sender:"-",content:"クリックして問題文を入力"};
    $scope.$apply();
  });
  socket.on('trueAns', function(msg){
     $scope.trueAns=msg||"クリックして解説を入力";
     $scope.$apply();     
  });
  socket.on('message', function (msg) {
    $scope.messages=msg;
    $scope.$apply();
    var elem = document.getElementById('question-area');
    elem.scrollTop = elem.scrollHeight;
  });

  socket.on('roster', function (names) {
    $scope.roster = names;
    $scope.$apply();
  });

  socket.on('chatMessage', function(msg){
    $scope.privateMessages.push(msg);
    $scope.$apply();
    var elem = document.getElementById('private-chat-area');
    elem.scrollTop = elem.scrollHeight;
  });
  socket.on('clearChat', function(){
    var privates = $scope.privateMessages.filter(x=>x.private);
    $scope.privateMessages = [];
    privates.forEach(function(item){
        $scope.privateMessages.push(item);
    });
    $scope.$apply();      
    console.log('clear chat');
  });
  socket.on('loadChat', function(msg){
    $scope.privateMessages = [];
    msg.forEach(function(item){
        $scope.privateMessages.push(item);
    });
    $scope.$apply();
  });
  $scope.sendMondai = function sendMondai(){
    if(window.confirm('問題文が変更されます。続行しますか？')){
      var data = {
      type:"mondai",
      content:$scope.content
      }
    socket.emit("message",data);
    }
    else{
      window.alert('キャンセルしました。')
    }
  };
  
  $scope.sendTrueAns = function sendTrueAns(){
    if(window.confirm('正解が公開されます。続行しますか？')){
      var data = {
      type:"trueAns",
      content:$scope.ansContent
      }
      socket.emit("message",data);
    }
    else{
      window.alert('キャンセルしました。')
    }

  };
  
  $scope.send = function send() {
    var data = {
      type:"question",
      question:$scope.text,
      answer: "waiting an answer"
    }
    console.log('Sending message:',data);
    socket.emit('message', data);
    $scope.text = '';
  };
  
  $scope.sendAnswer = function sendAnswer() {
    var id = document.getElementById("id_input").value || 0;
    var data = {
      type:"answer",
      answerer: String($scope.name||"Anonymous"),
      id:id,
      answer: $scope.answer
    }
    console.log('Sending message:',data);
    socket.emit('message', data);
    $scope.answer = '';
  };
  $scope.sendPublicMessage = function sendPublicMessage(){
    var data = {
      type:"publicMessage",
      content:$scope.publicText
    }
    console.log('Sending message:', data);
    socket.emit('message', data);
    $scope.publicText='';
  };
  $scope.sendPrivateMessage = function sendPrivateMessage(){
    var data = {
        type:"privateMessage",
        to:document.getElementById("toIdLabel").value,
        content:$scope.privateText
    }
    console.log('Sending message:',data);
    socket.emit('message', data);
    $scope.privateText='';
  };
  $scope.setName = function setName() {
    socket.emit('identify', $scope.name);
  };
  $scope.fetchData = function fetchData(){
    socket.emit('refresh',null);
  };
  $scope.joinRoom = function joinRoom(){
    var roomNum= document.getElementById('room-number').value;
    socket.emit('join',roomNum);  
  };
  $scope.clearAll = function clearAll(){
    if(window.confirm('問題、質問、回答がすべて消えます。続行しますか？')){
      socket.emit('clear');
    }
    else{
      window.alert('キャンセルしました。')
    }
  };
});
