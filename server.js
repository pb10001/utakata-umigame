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
var mondai ={};
var trueAns={};
var messages = [];
var chatMessages = [];
var sockets = [];
var user_id = 0;

const chatKey = 'chats';
const questionKey = 'questions';

chat=io.on('connection', function (socket) {
    user_id+=1;
    socket.user_id=user_id;
    sockets.push(socket);
    socket.on('join', function(roomName){
        socket.leave(socket.room);
		var roomId =String(roomName||"Public");
		//DBのキー衝突を避ける
		if(roomId=='chats'||roomId == 'questions'){
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
		client.lrange(chatKey, 0, -1, function(err, docs){
			chatMessages = [];
			docs.forEach(function(item){
				var obj = JSON.parse(item);
				chatMessages.push(obj);
			});
			console.log(chatMessages.filter(x=>x.room == roomId));
			socket.emit('loadChat', chatMessages.filter(x=>x.room == roomId).sort(function(a,b){
					if(a.id<b.id) return -1;
					if(a.id > b.id) return 1;
					return 0;
				}));
		});
		client.hgetall(questionKey, function(err, doc){
			messages = [];
			for(key in doc){
				messages.push(JSON.parse(doc[key]));
			}
			socket.emit('message', messages.filter(x=>x.room == roomId).sort(function(a,b){
					if(a.id<b.id) return -1;
					if(a.id > b.id) return 1;
					return 0;
				}));
		});
		/*client.lrange('questions', 0, -1, function(err, docs){
			messages = [];
			docs.forEach(function(item){
				var obj = JSON.parse(item);
				if(messages.filter(x=>parseInt(x.id)).indexOf(parseInt(obj.id)) == -1){
					messages.push(obj);
				}
			});
			socket.emit('message', messages.filter(x=>x.room == roomId).sort(function(a,b){
					if(a.id<b.id) return -1;
					if(a.id > b.id) return 1;
					return 0;
				}));
		});*/
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
        socket.emit('message', messages.filter(x=>x.room==socket.room));
      socket.emit('loadChat', chatMessages);
      updateRoster();
    });
    socket.on('message', function (msg) {
      if (msg.type =="mondai") {
		var doc = {
			room: socket.room,
            sender:socket.name,
            content:String(msg.content||"クリックして問題文を入力"),
			trueAns: "クリックして解説を入力",
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
			doc.trueAns = msg.content;
			client.hmset(socket.room, doc);
		});
        socket.broadcast.to(socket.room).emit("trueAns", trueAns[socket.room]);
      }
      else if(msg.type =="question"){
        var id = messages.length+1;
		var questionNum = messages.filter(x=>x.room == socket.room).length+1;
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
        messages.push(data);
		client.hset('questions', data.id, JSON.stringify(data));
		//client.rpush('questions', JSON.stringify(data));
        socket.emit('message', messages.filter(x=>x.room==socket.room));
        socket.broadcast.to(socket.room).emit('message', messages.filter(x=>x.room==socket.room));
      }
      else if(msg.type=="answer"){
        if(msg.id!=0&&msg.id<=messages.length){
          var id = msg.id;
          messages[id-1].answer = msg.answer;
          messages[id-1].answerer =msg.answerer;
          socket.emit('message', messages.filter(x=>x.room==socket.room));
          socket.broadcast.to(socket.room).emit('message', messages.filter(x=>x.room==socket.room));
		  var data = messages[id-1];
		  /*client.del('questions');
		  messages.forEach(function(item){
			client.rpush('questions', JSON.stringify(item));
		  });*/
		  client.hset(questionKey, data.id, JSON.stringify(data));
        }
      }
      else if(msg.type=="publicMessage"){
		  client.llen(chatKey,function(err, count){
			var data={
			  id: count,
              room:socket.room,
              private:false,
              sent_from:socket.name,
              sent_to:"All",
              content:msg.content
		  }
		  client.rpush(chatKey, JSON.stringify(data));
		  chatMessages.push(data);
		  socket.emit("chatMessage", data);
		  socket.broadcast.to(socket.room).emit("chatMessage", data);
		  });
      }
      else if(msg.type=="privateMessage"){
          console.log(msg.to);
          var sendTo =sockets.filter(function(elem){
                return elem.user_id==msg.to;
          })[0]||null;
          if(sendTo!=null){
            if(socket.user_id!=sendTo.user_id){                
              var sendData={
                  private:true,
                  sent_from:"You",
                  sent_to:sendTo.name,
                  content:msg.content
              }
              var receiveData={
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
	  for(var i = 0;i<messages.length;i++){
		  if(messages[i].room==room){
			  messages.splice(i--,1);
		  }
	  }
	  for(i=0;i<chatMessages.length;i++){
		  if(chatMessages[i].room==room){
			  chatMessages.splice(i--,1);
		  }
	  }
      socket.emit("mondai",mondai[room]);
      socket.emit("trueAns",trueAns[room]);
      socket.emit("message",messages.filter(x=>x.room==room));
      socket.emit("clearChat");
      socket.broadcast.to(socket.room).emit("mondai",mondai[room]);
      socket.broadcast.to(socket.room).emit("trueAns",trueAns[room]);
      socket.broadcast.to(socket.room).emit('message', messages.filter(x=>x.room==room));
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

server.listen(process.env.PORT || 5000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
