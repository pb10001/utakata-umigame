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
var mondai ={
    sender:"",
    content:"クリックして問題文を入力"
}
var trueAns="クリックして解説を入力";
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    socket.emit("mondai", mondai);
    socket.emit("trueAns", trueAns);
    messages.forEach(function (data) {
      socket.emit('message', messages);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      if (msg.type =="mondai") {
        mondai ={
            sender:String(msg.mondai.sender||"Anonymous"),
            content:String(msg.mondai.content||"クリックして問題文を入力")
        };
        broadcast("mondai", mondai);
      }
      else if(msg.type == "trueAns"){
        trueAns = String(msg.content||"クリックして解説を入力");
        broadcast("trueAns", trueAns);
      }
      else if(msg.type =="question"){
        var id = messages.length+1;
        var text = msg.question;
        var answer = "waiting";
        var answerer = "-";
        var data = {
          id: id,
          name: socket.name,
          text: text,
          answerer: answerer,
          answer: answer
        };
        messages.push(data);
        broadcast('message', messages);
      }
      else if(msg.type=="answer"){
        if(msg.id!=0&&msg.id<=messages.length){
          var id = msg.id;
          messages[id-1].answer = msg.answer;
          messages[id-1].answerer =msg.answerer;
          broadcast('message',messages);
        }
      }

    });
    socket.on('clear',function(){
      mondai={
          sender:"Anonymous",
          content:"クリックして問題文を入力"
      };
      trueAns="クリックして解説を入力";
      messages=[];
      broadcast("mondai",mondai);
      broadcast("trueAns",trueAns);
      broadcast("message",messages);
    });
    socket.on('identify', function (name) {
      socket.name = String(name || 'Anonymous');
      updateRoster();
    });
  });
function updateRoster() {
  async.map(
    sockets,function(socket,callback){
      callback(null,socket.name);
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
