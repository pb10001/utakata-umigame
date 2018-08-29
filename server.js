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

var compression = require('compression');

router.use(compression({
  threshold: 0,
  level: 9,
  memLevel: 9
}));

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(express.static(path.resolve(__dirname, 'client/js')));
router.use(express.static(path.resolve(__dirname, 'client/css')));
router.use('/puzzles', apis);
router.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/top_page.html');
});
router.get('/mondai', function(req, res) {
  res.sendFile(__dirname + '/client/template.html');
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
router.get('/lobby', function(req, res) {
  res.sendFile(__dirname + '/client/template.html');
});
router.get('/config', function(req, res) {
  res.sendFile(__dirname + '/client/template.html');
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
