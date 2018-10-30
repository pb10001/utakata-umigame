"use strict";

var async = require('async');
var client = require('./redis_client');
var moment = require('moment');
var messages = {};
var chatMessages = [];
var lobbyChats = [];
var sockets = [];
var user_id = 0;

const chatKey = 'chats';
const questionKey = 'questions';
const lobbyChatKey = 'LobbyChat';
module.exports = function(socket) {
  user_id += 1;
  socket.user_id = user_id;
  sockets.push(socket);
  socket.on('join', function(roomName) {
    socket.leave(socket.room);
    var roomId = String(roomName || 'Public');
    if (roomId == chatKey || roomId == questionKey) {
      roomId = 'Public';
    }
    //入室
    socket.room = roomId;
    socket.join(roomId);
    client.hgetall(roomId, function(err, doc) {
      socket.emit('mondai', doc);
      if (doc != null) socket.emit('trueAns', doc.trueAns);
      else socket.emit('trueAns', null);
    });
    client.hgetall(chatKey, function(err, doc) {
      chatMessages = [];
      for (var key in doc) {
        var msg = JSON.parse(doc[key]);
        msg.name = msg.sent_from + ' → ' + msg.sent_to;
        chatMessages.push(msg);
      }
      socket.emit(
        'loadChat',
        chatMessages.filter(x => x.room == roomId).sort(function(a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        })
      );
    });
    client.hgetall(questionKey, function(err, doc) {
      messages = {};
      for (var key in doc) {
        messages[key] = JSON.parse(doc[key]);
      }
      socket.emit(
        'refreshMessage',
        msgInRoom(socket.room, messages).sort(function(a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        })
      );
    });
    socket.emit('join', roomId);
    updateRoster();
  });
  socket.on('disconnect', function() {
    sockets.splice(sockets.indexOf(socket), 1);
    socket.leave(socket.currentRoom);
    updateRoster();
  });
  socket.on('refresh', function() {
    socket.emit('refreshMessage', msgInRoom(socket.room, messages));
    socket.emit('loadChat', msgInRoom(socket.room, chatMessages));
    updateRoster();
  });
  socket.on('fetchLobby', function() {
    client.hgetall('lobbyChats', function(err, docs) {
      lobbyChats = [];
      for (var key in docs) {
        var msg = JSON.parse(docs[key]);
        var dif = ((new Date() - new Date(msg.date)) / 1000 / 60 / 60 + 9) / 24; //タイムゾーン
        if (dif <= 7) {
          //7日以内のログを残す
          lobbyChats.push(msg);
        } else {
          client.hdel('lobbyChats', msg.id);
        }
        socket.emit('lobbyChat', reverseById(lobbyChats));
      }
    });
  });
  socket.on('removeLobby', function(data) {
    client.hget('lobbyChats', data.id, function(err, res) {
      if (res != null) {
        var doc = JSON.parse(res);
        console.log(doc.removePass);
        if (doc.removePass === data.removePass) {
          client.del('lobbyChats');
          var tmp = [];
          for (var key in lobbyChats) {
            if (lobbyChats[key].id != data.id) {
              client.hset(
                'lobbyChats',
                lobbyChats[key].id,
                JSON.stringify(lobbyChats[key])
              );
              tmp.push(lobbyChats[key]);
            }
          }
          lobbyChats = tmp;
          console.log(lobbyChats);
          // socket.emit('lobbyChat', reverseById(lobbyChats));
          to('LobbyChat', 'lobbyChat', reverseById(lobbyChats));
        }
      }
    });
  });
  socket.on('editLobby', function(data) {
    for (var key in lobbyChats) {
      if (
        lobbyChats[key].id == data.id &&
        lobbyChats[key].removePass === data.removePass
      ) {
        lobbyChats[key].content = data.content;
        client.hset('lobbyChats', data.id, JSON.stringify(lobbyChats[key]));
      }
    }
    socket.emit('lobbyChat', reverseById(lobbyChats));
    to('LobbyChat', 'lobbyChat', reverseById(lobbyChats));
  });
  socket.on('editMondaiChat', function(data) {
    for (var key in chatMessages) {
      var obj = chatMessages[key];
      if (obj.id === data.id && obj.removePass === data.removePass) {
        obj.content = data.content;
        client.hset(chatKey, data.id, JSON.stringify(obj));
        chatMessages[key] = obj;
      }
    }
    // socket.emit('chatMessage', obj);
    to(obj.room, 'chatMessage', obj);
  });
  socket.on('removeMondaiChat', function(data) {
    client.hdel(chatKey, data.id);
    for(var key in chatMessages){
      if(chatMessages[key].id == data.id)
        delete chatMessages[key];
    }
    // socket.emit('loadChat', msgInRoom(socket.room, chatMessages));
    to('LobbyChat', 'loadChat', msgInRoom(socket.room, chatMessages));
  });

  socket.on('mondaiMessage', msg => {
    client.hgetall(socket.room, (err, doc) => {
      if (doc) {
        if (doc.removePass !== msg.removePass) {
          return;
        }
      }
      if (!msg.room) {
        console.log('no matching room');
        return;
      }
      let data = {
        room: msg.room,
        sender: msg.name || 'Anonymous',
        removePass: msg.removePass,
        content: String(msg.content || '問題文'),
        trueAns: String(msg.trueAns || '解説'),
        created_month: msg.created_month.toString(),
        created_date: msg.created_date.toString()
      };
      client.hmset(msg.room, data);
      console.log('added', data);
      // socket.emit('mondai', data);
      to(msg.room, 'mondai', data);
    });
  });
  socket.on('trueAnsMessage', function(msg) {
    // trueAns[socket.room] = String(msg.content || 'クリックして解説を入力');
    client.hgetall(socket.room, function(err, doc) {
      if (doc == null) {
      } else {
        doc.trueAns = msg.content;
        client.hmset(socket.room, doc);
        // socket.emit('trueAns', doc);
        to(socket.room, 'trueAns', doc.trueAns);
      }
    });
  });
  socket.on('questionMessage', function(msg) {
    var id = maxId(messages) + 1;
    var max = Math.max.apply(
      null,
      msgInRoom(socket.room, messages).map(x => x.questionNum)
    );
    if (max >= 0) var questionNum = max + 1;
    else var questionNum = 1;
    var text = msg.question;
    var answer = 'waiting';
    var answerer = '-';
    var data = {
      room: socket.room,
      id: id,
      questionNum: questionNum,
      name: socket.name,
      text: text,
      answerer: answerer,
      answer: answer
    };
    messages[id] = data;
    client.hset('questions', data.id, JSON.stringify(data));
    // socket.emit('message', msgInRoom(socket.room, messages));
    to(socket.room, 'message', msgInRoom(socket.room, messages));
    /* sockets.forEach(sock => {
      if (sock.room == socket.room) {
        sock.emit('message', msgInRoom(socket.room, messages));
      }
    }); */
  });
  socket.on('answerMessage', function(msg) {
    console.log('answer: ', msg);
    if (msg.id != 0) {
      var id = parseInt(msg.id);
      messages[id].answer = msg.answer;
      messages[id].answerer = msg.answerer;
      messages[id].isGood = msg.isGood;
      messages[id].isTrueAns = msg.isTrueAns;
      //socket.emit('message', msgInRoom(socket.room, messages));
      to(socket.room, 'message', msgInRoom(socket.room, messages));
      /* sockets.forEach(sock => {
        if (sock.room == socket.room) {
          sock.emit('message', msgInRoom(socket.room, messages));
        }
      }); */
      var data = messages[id];
      client.hset(questionKey, id, JSON.stringify(data));
    }
  });
  socket.on('publicChatMessage', function(msg) {
    sendMessage(socket, msg, chatMessages, client);
  });
  socket.on('privateChatMessage', function(msg) {
    console.log(msg.to);
    var sendTo =
      sockets.filter(function(elem) {
        return elem.user_id == msg.to;
      })[0] || null;
    if (sendTo != null) {
      if (socket.user_id != sendTo.user_id) {
        var sendData = {
          id: -1,
          private: true,
          name: 'You → ' + sendTo.name,
          sent_from: 'You',
          sent_to: sendTo.name,
          content: msg.content
        };
        var receiveData = {
          id: -1,
          private: true,
          name: socket.name + ' → You',
          sent_from: socket.name,
          sent_to: 'You',
          content: msg.content
        };
        socket.emit('chatMessage', sendData);
        sendTo.emit('chatMessage', receiveData);
      }
    }
  });

  socket.on('lobbyMessage', function(msg) {
    /* ロビー */
    var max =
      lobbyChats != null ? Math.max.apply(null, lobbyChats.map(x => x.id)) : 0;
    var chatNum = max >= 0 ? max + 1 : 1;
    var data = {
      id: chatNum,
      name: msg.name,
      content: msg.content,
      removePass: msg.removePass,
      link: msg.link,
      date: moment()
        .utcOffset('+09:00')
        .format('YYYY/MM/DD HH:mm:ss')
    };
    client.hset('lobbyChats', data.id, JSON.stringify(data));
    client.hgetall('lobbyChats', function(err, docs) {
      lobbyChats = [];
      for (var key in docs) {
        var msg = JSON.parse(docs[key]);
        lobbyChats.push(msg);
      }
      socket.emit('lobbyChat', reverseById(lobbyChats));
      to('LobbyChat', 'lobbyChat', reverseById(lobbyChats));
    });
  });
  socket.on('clear', function(removePass) {
    var room = socket.room;
    client.hgetall(room, (err, doc) => {
      if (doc.removePass !== removePass) {
        console.log('invalid removepass');
        return;
      }
      client.del(room);
      deleteMessages(room, messages, questionKey);
      deleteMessages(room, chatMessages, chatKey);
      socket.emit('mondai', {});
      socket.emit('trueAns', '');
      socket.emit('message', []);
      socket.emit('clearChat');
      to(socket.room,'mondai', {});
      to(socket.room, 'trueAns', "");
      to(socket.room,'message', []);
      to(socket.room,'clearChat', {});
    });
  });
  socket.on('identify', function(name) {
    socket.name = String(name || 'Anonymous');
    updateRoster();
  });

  /* utility functions */
  function updateRoster() {
    async.map(
      sockets,
      function(socket, callback) {
        callback(null, { id: socket.user_id, name: socket.name });
      },
      function(err, names) {
        broadcast('roster', names);
      }
    );
  }
  function deleteMessages(room, messages, type) {
    for (var key in messages) {
      if (messages[key].room == room) {
        client.hdel(type, messages[key].id);
        delete messages[key];
      }
    }
  }
  function broadcast(event, data) {
    sockets.forEach(function(socket) {
      socket.emit(event, data);
    });
  }
  function to(room, msg, data) {
    sockets.forEach(socket => {
      if(socket.room == room) {
        socket.emit(msg, data);
      }
    })
  }
  function msgInRoom(room, messages) {
    //部屋を指定して質問の配列を取り出す
    var array = [];
    for (var key in messages) {
      if (messages[key].room == room) array.push(messages[key]);
    }
    return array;
  }

  function maxId(messages) {
    var max = 0;
    for (var key in messages) {
      var id = parseInt(key);
      if (id >= max) max = id;
    }
    return max;
  }
  function reverseById(array) {
    //降順で並び替え
    return array.sort(function(a, b) {
      if (a.id < b.id) return 1;
      else if (a.id > b.id) return -1;
      else return 0;
    });
  }
  function sendMessage(socket, msg, chatMessages, client) {
    var max = Math.max.apply(null, chatMessages.map(x => x.id));
    if (max >= 0) var chatNum = max + 1;
    else var chatNum = 1;
    var data = {
      id: chatNum,
      room: socket.room,
      private: false,
      name: socket.name + ' → All in ' + socket.room,
      sent_from: socket.name,
      sent_to: 'All in ' + socket.room,
      removePass: msg.removePass,
      content: msg.content,
      date: moment()
        .utcOffset('+09:00')
        .format('YYYY/MM/DD HH:mm:ss')
    };
    client.hset(chatKey, data.id, JSON.stringify(data));
    chatMessages.push(data);
    // socket.emit('chatMessage', data);
    to(socket.room, 'chatMessage', data);
  }
};
