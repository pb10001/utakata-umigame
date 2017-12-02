//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
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
    
    socket.on('join', function(roomId){
        socket.leave(socket.room);
        socket.room=roomId;
        socket.join(roomId);
        console.log(io.sockets.manager.rooms);
        socket.emit("mondai", mondai[roomId]);
        socket.emit("trueAns", trueAns[roomId]);
        socket.emit('message', messages.filter(x=>x.room==roomId));
        socket.emit('loadChat', chatMessages.filter(x=>x.room==roomId));
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
        mondai[socket.room] ={
            sender:socket.name,
            content:String(msg.content||"クリックして問題文を入力")
        };
        console.log('room',socket.room);
        socket.emit("mondai",mondai[socket.room]);
        socket.broadcast.to(socket.room).emit("mondai", mondai[socket.room]);
      }
      else if(msg.type == "trueAns"){
        trueAns[socket.room] = String(msg.content||"クリックして解説を入力");
        socket.emit("trueAns", trueAns[socket.room]);
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
        }
      }
      else if(msg.type=="publicMessage"){
          var data={
              room:socket.room,
              private:false,
              sent_from:socket.name,
              sent_to:"All",
              content:msg.content
          }
          chatMessages.push(data);
          socket.emit("chatMessage", data);
          socket.broadcast.to(socket.room).emit("chatMessage", data);
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
      mondai[socket.room]=null;
      trueAns[socket.room]=null;
      messages.filter(x=>x.room==socket.room).forEach(function(item){
        messages.splice(item,1);
      });
      chatMessages.filter(x=>x.room==socket.room).forEach(function(item){
        chatMessages.splice(item,1);
      });
      socket.emit("mondai",mondai[socket.room]);
      socket.emit("trueAns",trueAns[socket.room]);
      socket.emit("message",messages.filter(x=>x.room==socket.room));
      socket.emit("clearChat");
      socket.broadcast.to(socket.room).emit("mondai",mondai[socket.room]);
      socket.broadcast.to(socket.room).emit("trueAns",trueAns[socket.room]);
      socket.broadcast.to(socket.room).emit('message', messages.filter(x=>x.room==socket.room));
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
