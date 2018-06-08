var $ = require('jquery');
var io = require('socket.io-client');
var crypto = require('crypto');
var chatController = function($routeParams, socket){
  var self = this;
  var room = $routeParams.room;
  this.messages = [];
  this.privateMessages = [];
  this.roster = [];
  this.name = '';
  this.text = '';
  this.answer = '';
  this.sender = '';
  this.mondai = {
    sender: '',
    content: ''
  };
  this.trueAns = '';
  this.ansContent = '';
  this.publicText = '';
  this.privateText = '';
  this.toId = -1;
  this.currentRoom = '-';
  this.isGoodSent = false;
  socket.on('connect', function() {
    self.setName();
    socket.emit('join', room);
  });
  socket.on('join', function(roomNum) {
    self.currentRoom = roomNum;
  });
  socket.on('mondai', function(msg) {
    self.mondai = msg || { sender: '-', content: 'クリックして問題文を入力' };
  });
  socket.on('trueAns', function(msg) {
    self.trueAns = msg || 'クリックして解説を入力';
  });
  socket.on('message', function(msg) {
    self.messages = msg;
    var elem = document.getElementById('question-area');
    elem.scrollTop = elem.scrollHeight;
  });

  socket.on('roster', function(names) {
    self.roster = names;
  });

  socket.on('chatMessage', function(msg) {
    self.privateMessages.push(msg);
    var elem = document.getElementById('private-chat-area');
    elem.scrollTop = elem.scrollHeight;
  });
  socket.on('clearChat', function() {
    var privates = self.privateMessages.filter(x => x.private);
    self.privateMessages = [];
    privates.forEach(function(item) {
      self.privateMessages.push(item);
    });
    console.log('clear chat');
  });
  socket.on('loadChat', function(msg) {
    self.privateMessages = [];
    msg.forEach(function(item) {
      self.privateMessages.push(item);
    });
  });
  socket.on('redirect', function(msg) {
    location.href = '/';
  });
  this.sendMondai = function sendMondai() {
    if (window.confirm('問題文が変更されます。続行しますか？')) {
      var data = {
        type: 'mondai',
        content: this.content,
        created_month: new Date().getMonth() + 1,
        created_date: new Date().getDate()
      };
      socket.emit('message', data);
    } else {
      window.alert('キャンセルしました。');
    }
  };

  this.sendTrueAns = function sendTrueAns() {
    if (window.confirm('正解が公開されます。続行しますか？')) {
      var data = {
        type: 'trueAns',
        content: this.ansContent
      };
      socket.emit('message', data);
    } else {
      window.alert('キャンセルしました。');
    }
  };

  this.send = function send() {
    var data = {
      type: 'question',
      question: this.text,
      answer: 'waiting an answer'
    };
    console.log('Sending message:', data);
    socket.emit('message', data);
    this.text = '';
  };

  this.sendAnswer = function sendAnswer() {
    var id = document.getElementById('ques_id_input').value || 0;
    var data = {
      type: 'answer',
      answerer: String(this.name || 'Anonymous'),
      id: id,
      answer: this.answer
    };
    console.log('Sending message:', data);
    socket.emit('message', data);
    this.answer = '';
  };
  this.sendPublicMessage = function sendPublicMessage() {
    var data = {
      type: 'publicMessage',
      content: this.publicText
    };
    console.log('Sending message:', data);
    socket.emit('message', data);
    this.publicText = '';
  };
  this.sendPrivateMessage = function sendPrivateMessage() {
    var data = {
      type: 'privateMessage',
      to: document.getElementById('toIdLabel').value,
      content: this.privateText
    };
    console.log('Sending message:', data);
    socket.emit('message', data);
    this.privateText = '';
  };
  this.setName = function setName() {
    var doc = this.name.split('#');
    if (doc.length == 2) {
      var sha1 = crypto.createHash('sha1');
      sha1.update(doc[1]);
      var hash = sha1.digest('hex');
      var txt = doc[0] + '◆' + window.btoa(hash).substr(1, 10);
    } else {
      var txt = doc[0];
    }
    socket.emit('identify', txt);
  };
  this.fetchData = function fetchData() {
    socket.emit('refresh', null);
  };
  this.quit = function quit() {
    socket.emit('disconnect');
    location.href = '/';
  };
  this.clearAll = function clearAll() {
    if (window.confirm('問題、質問、回答がすべて消えます。続行しますか？')) {
      socket.emit('clear');
    } else {
      window.alert('キャンセルしました。');
    }
  };
  this.onClick = function onClick() {
    $('.heart-animation').toggleClass('active');
    if (!this.isGoodSent) {
      socket.emit('good');
      this.isGoodSent = true;
    }
  };

};
module.exports = chatController;
