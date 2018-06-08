'use strict'
var express = require('express');
var router = express();
var client = require('./redis_client');
const chatKey = 'chats';
const questionKey = 'questions';

router.get('/', function(req, res){
  var response = {};
  const room = decodeURI(req.query.room);
  client.hgetall(room, function(err, doc) {
    response.mondai = doc;
    client.hgetall(chatKey, function(err, doc) {
      var chatMessages = [];
      for (var key in doc) {
        chatMessages.push(JSON.parse(doc[key]));
      }
      response.chat = chatMessages
        .filter(x => x.room == room)
        .sort(function(a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        });
      client.hgetall(questionKey, function(err, doc) {
        var messages = {};
        for (var key in doc) {
          messages[key] = JSON.parse(doc[key]);
        }
        response.question = msgInRoom(room, messages).sort(function(
          a,
          b
        ) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        });
        res.send(JSON.stringify(response));
      });
    });
  });
});
router.get('/update', function(req, res){
  var room = decodeURI(req.query.room);
  var name = req.query.name || 'Anonymous on Desktop';
  var content = req.query.content || '';
  var trueAns = req.query.trueAns || '';
  var question = req.query.question || '';
  var answer = req.query.answer || '';
  var chat = req.query.chat || '';
  if (room != null) {
    client.hgetall(room, function(err, doc) {
      if (content != '') {
        var doc = {
          room: room,
          sender: name,
          content: String(content || 'クリックして問題文を入力'),
          trueAns: trueAns[room] || 'クリックして解説を入力',
          created_month: '0',
          created_date: '0'
        };
        mondai[room] = doc;
        client.hmset(room, doc);
        sendMessages('mondai', sockets, room, mondai[room]);
      } else if (trueAns != '') {
        doc.sender = name;
        doc.trueAns = trueAns;
        mondai[room] = doc;
        trueAns[room] = doc.trueAns;
        client.hmset(room, doc);
        sendMessages('trueAns', sockets, room, doc.trueAns);
      } else if (question != '') {
        var id = maxId(messages) + 1;
        var max = Math.max.apply(
          null,
          msgInRoom(room, messages).map(x => x.questionNum)
        );
        if (max >= 0) var questionNum = max + 1;
        else var questionNum = 1;
        var text = question;
        var answer = 'waiting';
        var answerer = '-';
        var data = {
          room: room,
          id: id,
          questionNum: questionNum,
          name: name,
          text: text,
          answerer: answerer,
          answer: answer
        };
        messages[id] = data;
        //messages.push(data);
        client.hset(questionKey, data.id, JSON.stringify(data));
        sendMessages("messages", sockets, room, msgInRoom(room, messages));
      } else if (chat != '') {
        var max = Math.max.apply(null, chatMessages.map(x => x.id));
        if (max >= 0) var chatNum = max + 1;
        else var chatNum = 1;
        var data = {
          id: chatNum,
          room: room,
          private: false,
          sent_from: name,
          sent_to: 'All in ' + room,
          content: chat
        };
        client.hset(chatKey, data.id, JSON.stringify(data));
        chatMessages.push(data);
        for (var key in sockets) {
          sockets[key].emit('chatMessage', data);
        }
      } else if (answer != '') {
        console.log('running:', answer);
        var id = parseInt(req.query.id);
        messages[id].answer = req.query.answer;
        messages[id].answerer = name;
        sendMessages("messages", sockets, room, msgInRoom((room, messages)));
        var data = messages[id];
        console.log('data:', data);
        client.hset(questionKey, id, JSON.stringify(data));
      }
    });
  }
  res.send('Done');
});
router.get('/lobby_chat', function(req, res){
  /* Redisに追加する */
});
function msgInRoom(room, messages) {
  //部屋を指定して質問の配列を取り出す
  var array = [];
  for (var key in messages) {
    if (messages[key].room == room) array.push(messages[key]);
  }
  return array;
}
function sendMessages(type, sockets, room, messages){
  //質問を送信する
  for (var key in sockets) {
    if (sockets[key].room != room) continue;
    sockets[key].emit(type , messages);
  }  
}

module.exports = router;
