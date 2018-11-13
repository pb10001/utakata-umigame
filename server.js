'use strict';
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

router.use(
  compression({
    threshold: 0,
    level: 9,
    memLevel: 9
  })
);

router.use(express.static(path.resolve(__dirname, 'client-beta/dist/client')));
router.use('/puzzles', apis);
router.get('/*', (req,res) => {
  res.sendFile(path.resolve(__dirname, 'client-beta/dist/client-beta/index.html'));
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
