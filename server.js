var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//connect to redis
//参考：https://qiita.com/5a3i/items/224ee1ea234d90d9dd7a
var redis = require("redis"),
    url   = require("url")
if (process.env.REDISTOGO_URL) {
    var rtg    = url.parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);

    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
}
client.on("error", function (err) {
	console.log("Error " + err);
});

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
router.get('/puzzles',function(req, res){
  var response = {};
  client.hgetall(req.query.room, function(err, doc){
    response.mondai = doc;
    client.hgetall(chatKey, function(err, doc){
      chatMessages = [];
      for(var key in doc){
        chatMessages.push(JSON.parse(doc[key]));
      }
      response.chat = chatMessages.filter(x=>x.room == req.query.room).sort(function(a,b){
          if(a.id<b.id) return -1;
          if(a.id > b.id) return 1;
          return 0;
        });
      client.hgetall(questionKey, function(err, doc){
        messages = {};
        for(var key in doc){
          messages[key] = JSON.parse(doc[key]);
        }
        response.question = msgInRoom(req.query.room, messages).sort(function(a,b){
            if(a.id<b.id) return -1;
            if(a.id > b.id) return 1;
            return 0;
          });
        res.send(JSON.stringify(response));
      });
    });
  });
});
router.get('/puzzles/update', function(req, res){
  var room = req.query.room;
  var name = req.query.name||"Anonymous on Desktop";
  var content = req.query.content||'';
  var trueAns = req.query.trueAns||'';
  var question = req.query.question||'';
  var answer = req.query.answer||'';
  var chat = req.query.chat||'';
  if(room!=null){
    client.hgetall(room, function(err, doc){
      if(content != ''){
        var doc = {
    			room: room,
          sender:name,
          content:String(content||"クリックして問題文を入力"),
    			trueAns: trueAns[room]||"クリックして解説を入力",
    			created_month:'0',
    			created_date:'0'
        };
        mondai[room] = doc;
        client.hmset(room, doc);
        for(var key in sockets){
          if(sockets[key].room == room)
            sockets[key].emit("mondai",mondai[room]);
        }
      }
      else if(trueAns != ''){
        doc.sender = name;
        doc.trueAns = trueAns;
        mondai[room] = doc;
        trueAns[room] = doc.trueAns;
        client.hmset(room, doc);
        for(var key in sockets){
          if(sockets[key].room == room)
            sockets[key].emit("trueAns",doc.trueAns);
        }
      }
      else if(question != ''){
        var id = maxId(messages)+1;
            var max = Math.max.apply(null, msgInRoom(room, messages).map(x=>x.questionNum));
        if(max>=0)
          var questionNum = max+1;
        else
          var questionNum = 1;
        var text = question;
        var answer = "waiting";
        var answerer = "-";
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
        for(var key in sockets){
          if(sockets[key].room == room)
            sockets[key].emit("message", msgInRoom(room, messages));
        }
      }
      else if(chat != ''){
        var max = Math.max.apply(null, chatMessages.map(x=>x.id));
        if(max >=0)
          var chatNum = max +1;
        else
          var chatNum = 1;
        var data={
          id: chatNum,
          room:room,
          private:false,
          sent_from:name,
          sent_to:"All in "+  room,
          content:chat
        }
        client.hset(chatKey, data.id, JSON.stringify(data));
        chatMessages.push(data);
        for(var key in sockets){
          sockets[key].emit("chatMessage", data);
        }
      }
      else if(answer != ''){
        console.log("running:", answer);
        var id = parseInt(req.query.id);
        messages[id].answer = req.query.answer;
        messages[id].answerer = name;
        for(var key in sockets){
          if(sockets[key].room == room)
            sockets[key].emit("message", msgInRoom(room, messages));
        }
  		  var data = messages[id];
        console.log("data:",data);
  		  client.hset(questionKey, id, JSON.stringify(data));
      }
    });
  }
  res.send("Done");
});
var mondai ={};
var trueAns={};
var messages = {};
//var messages = [];
var questions = [];
var chatMessages = [];
var sockets = [];
var user_id = 0;

const chatKey = 'chats';
const questionKey = 'questions';

io.on('connection', function (socket) {
    user_id+=1;
    socket.user_id=user_id;
    sockets.push(socket);
    socket.on('join', function(roomName){
        socket.leave(socket.room);
		var roomId =String(roomName||"Public");
		//DBのキー衝突を避ける
		if(roomId.match(/[^A-Za-z0-9]+/)){
			socket.emit('redirect');
			return;
		}
		if(roomId==chatKey||roomId == questionKey){
			roomId = 'Public';
		}
		//入室
        socket.room=roomId;
        socket.join(roomId);
        console.log(io.sockets.manager.rooms);
		client.hgetall(roomId, function(err, doc){
			socket.emit("mondai", doc);
			if(doc != null)
				socket.emit("trueAns", doc.trueAns);
			else
				socket.emit("trueAns",null);
		});
		client.hgetall(chatKey, function(err, doc){
			chatMessages = [];
			for(var key in doc){
				chatMessages.push(JSON.parse(doc[key]));
			}
			socket.emit('loadChat', chatMessages.filter(x=>x.room == roomId).sort(function(a,b){
					if(a.id<b.id) return -1;
					if(a.id > b.id) return 1;
					return 0;
				}));
		});
		client.hgetall(questionKey, function(err, doc){
			messages = {};
			//messages = [];
			for(var key in doc){
				//messages.push(JSON.parse(doc[key]));
				messages[key] = JSON.parse(doc[key]);
			}
			socket.emit('message', msgInRoom(socket.room, messages).sort(function(a,b){
					if(a.id<b.id) return -1;
					if(a.id > b.id) return 1;
					return 0;
				}));
		});
        socket.emit('join', roomId);
        updateRoster();
    });
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      socket.leave(socket.currentRoom);
      updateRoster();
    });
    socket.on('refresh',function(){
        socket.emit("mondai", mondai[socket.room]);
        socket.emit("trueAns", trueAns[socket.room]);
        socket.emit('message', msgInRoom(socket.room, messages));
      socket.emit('loadChat', chatMessages);
      updateRoster();
    });
    socket.on('good', function(){
      var msg ={
        content: "「Good!」を送信しました。"
      };
      sendMessage(socket, msg, chatMessages, client);
    });
    socket.on('message', function (msg) {
      if (msg.type =="mondai") {
    		var doc = {
    			room: socket.room,
          sender:socket.name,
          content:String(msg.content||"クリックして問題文を入力"),
    			trueAns: trueAns[socket.room]||"クリックして解説を入力",
    			created_month:msg.created_month.toString(),
    			created_date:msg.created_date.toString()
        };
	      client.hmset(socket.room, doc);
        mondai[socket.room] = doc;
        console.log('room',socket.room);
        socket.emit("mondai",mondai[socket.room]);
        socket.broadcast.to(socket.room).emit("mondai", mondai[socket.room]);
      }
      else if(msg.type == "trueAns"){
        trueAns[socket.room] = String(msg.content||"クリックして解説を入力");
        socket.emit("trueAns", trueAns[socket.room]);
        client.hgetall(socket.room, function(err, doc){
          if(doc==null){

          }
          else{
            doc.trueAns = msg.content;
            client.hmset(socket.room, doc);
          }
        });
        socket.broadcast.to(socket.room).emit("trueAns", trueAns[socket.room]);
      }
      else if(msg.type =="question"){
		var id = maxId(messages)+1;
        var max = Math.max.apply(null, msgInRoom(socket.room, messages).map(x=>x.questionNum));
		if(max>=0)
			var questionNum = max+1;
		else
			var questionNum = 1;
        var text = msg.question;
        var answer = "waiting";
        var answerer = "-";
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
        //messages.push(data);
		client.hset('questions', data.id, JSON.stringify(data));
        socket.emit('message', msgInRoom(socket.room, messages));
        socket.broadcast.to(socket.room).emit('message', msgInRoom(socket.room, messages));
      }
      else if(msg.type=="answer"){
		  console.log('answer: ', msg);
        if(msg.id!=0){
          var id = parseInt(msg.id);
          messages[id].answer = msg.answer;
          messages[id].answerer =msg.answerer;
          //messages[id-1].answer = msg.answer;
          //messages[id-1].answerer =msg.answerer;
          socket.emit('message', msgInRoom(socket.room, messages));
          socket.broadcast.to(socket.room).emit('message', msgInRoom(socket.room, messages));
		  var data = messages[id];
		  client.hset(questionKey, id, JSON.stringify(data));
        }
      }
      else if(msg.type=="publicMessage"){
        sendMessage(socket, msg, chatMessages, client);
      }
      else if(msg.type=="privateMessage"){
          console.log(msg.to);
          var sendTo =sockets.filter(function(elem){
                return elem.user_id==msg.to;
          })[0]||null;
          if(sendTo!=null){
            if(socket.user_id!=sendTo.user_id){
              var sendData={
				  id: -1,
                  private:true,
                  sent_from:"You",
                  sent_to:sendTo.name,
                  content:msg.content
              }
              var receiveData={
				  id: -1,
                  private:true,
                  sent_from:socket.name,
                  sent_to:"You",
                  content:msg.content
              }
              socket.emit("chatMessage", sendData);
              sendTo.emit("chatMessage", receiveData);
            }
          }
      }

    });
    socket.on('clear',function(){
      var room = socket.room;
	  mondai[room]=null;
      trueAns[room]=null;
	  client.del(room);
	  for(var key in messages){
		  if(messages[key].room == room){
			  client.hdel(questionKey, messages[key].id);
        delete messages[key];
		  }
	  }
	  for(var key in chatMessages){
		if(chatMessages[key].room ==room){
			client.hdel(chatKey, chatMessages[key].id);
      delete chatMessages[key];
		}
	  }
      socket.emit("mondai",mondai[room]);
      socket.emit("trueAns",trueAns[room]);
      socket.emit("message",[]);
      socket.emit("clearChat");
      socket.broadcast.to(socket.room).emit("mondai",mondai[room]);
      socket.broadcast.to(socket.room).emit("trueAns",trueAns[room]);
      socket.broadcast.to(socket.room).emit('message', []);
      socket.broadcast.to(socket.room).emit("clearChat");
    });
    socket.on('identify', function (name) {
      socket.name = String(name || 'Anonymous');
      updateRoster();
    });
  });
function updateRoster() {
  async.map(
    sockets,function(socket,callback){
      callback(null,{id:socket.user_id,name:socket.name});
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}
function msgInRoom(room, messages){
  //部屋を指定して質問の配列を取り出す
	var array = [];
	for(var key in messages){
		if(messages[key].room == room)
			array.push(messages[key]);
	}
	return array;
}

function maxId(messages){
	var max = 0;
	for(var key in messages){
		var id = parseInt(key);
		if(id >= max)
			max = id;
	}
	return max;
}

function sendMessage(socket, msg, chatMessages, client){
  var max = Math.max.apply(null, chatMessages.map(x=>x.id));
  if(max >=0)
  var chatNum = max +1;
  else
  var chatNum = 1;
  var data={
    id: chatNum,
    room:socket.room,
    private:false,
    sent_from:socket.name,
    sent_to:"All in "+  socket.room,
    content:msg.content
  }
  client.hset(chatKey, data.id, JSON.stringify(data));
  chatMessages.push(data);
  socket.emit("chatMessage", data);
  socket.broadcast.to(socket.room).emit("chatMessage", data);
}

server.listen(process.env.PORT || 5000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
