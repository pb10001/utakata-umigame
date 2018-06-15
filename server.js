var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var apis = require('./apis');
var socket = require('./socket');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(express.static(path.resolve(__dirname, 'client/js')));
router.use(express.static(path.resolve(__dirname, 'client/css')));
router.use('/puzzles', apis);
router.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/top_page.html');
});
router.get('/mondai/:room', function(req, res) {
  res.sendFile(__dirname + '/client/template.html');
});
router.get('/privacy_policy', function(req, res) {
  res.sendFile(__dirname + '/client/template.html');
});
router.get('/link', function(req, res) {
  res.sendFile(__dirname + '/client/template.html');
});
router.get('/lobby', function(req, res){
  res.sendFile(__dirname + '/client/lobby.html');
});


//Socket.io
io.on('connection', socket);


server.listen(
  process.env.PORT || 5000,
  process.env.IP || '0.0.0.0',
  function() {
    var addr = server.address();
    console.log('Chat server listening at', addr.address + ':' + addr.port);
  }
);
