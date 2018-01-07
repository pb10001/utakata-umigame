const mongoURI = process.env.MONGODB_URI;
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var Datastore = require('nedb');
var db = {};
/*db.mondai = new Datastore({
	filename: 'mondai.db',
	autoload: true
});*/
db.chat = new Datastore({
	filename: 'chat.db',
	autoload: true
});
db.question = new Datastore({
	filename: 'question.db',
	autoload: true
});

//mongoose
var mongoose = require('mongoose');
var MondaiSchema = {
	room: String,
	sender: String,
	content:String,
	trueAns: String,
	created_month: Number,
	created_date:Number
};
mongoose.model('Mondai', MondaiSchema);
mongoose.connect(mongoURI);
db.mondai = mongoose.model('Mondai');

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

chat=io.on('connection', function (socket) {
    user_id+=1;
    socket.user_id=user_id;
    sockets.push(socket);
    socket.on('join', function(roomName){
        socket.leave(socket.room);
		var roomId =String(roomName||"Public"); 
        socket.room=roomId;
        socket.join(roomId);
        console.log(io.sockets.manager.rooms);
		db.mondai.findOne({room: roomId}, function(err, doc){
			socket.emit("mondai", doc);
			if(doc != null)
				socket.emit("trueAns", doc.trueAns);
			else
				socket.emit("trueAns", null);
		});
		db.chat.find({room: roomId}).sort({id: 1}).exec(function(err, docs){
			socket.emit('loadChat', docs);
		});
		db.question.find({room: roomId}).sort({id: 1}).exec(function(err, docs){
			socket.emit('message', docs);
			messages = docs;
		});
        //socket.emit('message', messages.filter(x=>x.room==roomId));
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
		Object.keys(mondai).forEach(function(room){
			var nowMonth = new Date().getMonth()+1;
			var nowDate = new Date().getDate();
			if(mondai[room]!=null){
				var cMonth = mondai[room].created_month;
				var cDate = mondai[room].created_date;
			}
			/*if(cMonth!=null&&(nowDate - cDate > 3 || nowMonth != cMonth)){
				mondai[room]=null;
				trueAns[room]=null;
				messages.filter(x=>x.room==room).forEach(function(item){
					messages.splice(item,1);
				});
				chatMessages.filter(x=>x.room==room).forEach(function(item){
					chatMessages.splice(item,1);
				});
				console.log('removed');
				socket.emit("mondai",mondai[room]);
				socket.emit("trueAns",trueAns[room]);
				socket.emit("message",messages.filter(x=>x.room==room));
				socket.emit("clearChat");
				socket.broadcast.to(room).emit("mondai",mondai[room]);
				socket.broadcast.to(room).emit("trueAns",trueAns[room]);
				socket.broadcast.to(room).emit('message', messages.filter(x=>x.room==room));
				socket.broadcast.to(room).emit("clearChat");
			}*/
		});
		var doc = {
			room: socket.room,
            sender:socket.name,
            content:String(msg.content||"クリックして問題文を入力"),
			trueAns: "クリックして解説を入力",
			created_month:msg.created_month,
			created_date:msg.created_date
        };
		var mondai = new Mondai(doc);
		mondai.save(function(err) {
			if (err) { console.log(err); }
		});
		db.mondai.count({room: socket.room}, (err, count)=>{
			console.log("count=", count);
			if(count==0)
				db.mondai.update(doc, {upsert: true});
			else{
				db.mondai.update({room: socket.room}, {$set: {content: msg.content}});
			}
		});
		
        mondai[socket.room] = doc;
        console.log('room',socket.room);
        socket.emit("mondai",mondai[socket.room]);
        socket.broadcast.to(socket.room).emit("mondai", mondai[socket.room]);
      }
      else if(msg.type == "trueAns"){
        trueAns[socket.room] = String(msg.content||"クリックして解説を入力");
        socket.emit("trueAns", trueAns[socket.room]);
		db.mondai.update({room: socket.room}, {$set: {trueAns: msg.content}});
        socket.broadcast.to(socket.room).emit("trueAns", trueAns[socket.room]);
      }
      else if(msg.type =="question"){
        var id = messages.length+1;
        var text = msg.question;
        var answer = "waiting";
        var answerer = "-";
        var data = {
          room: socket.room,
          id: id,
          name: socket.name,
          text: text,
          answerer: answerer,
          answer: answer
        };
		db.question.insert(data);
        messages.push(data);
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
		  db.question.update({id : parseInt(id)}, data, {upsert: true}, function(err, items){});
        }
      }
      else if(msg.type=="publicMessage"){
		  db.chat.count({room: socket.room},function(err, count){
			var data={
			  id: count,
              room:socket.room,
              private:false,
              sent_from:socket.name,
              sent_to:"All",
              content:msg.content
		  }
		  db.chat.insert(data);
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
