var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const Store = require('data-store');

http.listen(process.env.PORT || 8888);

app.use(express.static('public'));

const store = new Store({
  path: 'public/config.json'
});

var lastPosition = {
  x: 0,
  y: 0
};
console.log()

io.sockets.on('connection', function(socket) {
  socket.emit('update_position', lastPosition);
  socket.on('receive_position', function(data) {
    lastPosition = data;
    socket.broadcast.emit('update_position', data);
    store.set(data.target, lastPosition);
    // console.log(store.get(
    //   'last_position'
    // ));
  });
});

// Debugging

console.log('server listening on port 8888');

io.on('connection', function(socket) {
  console.log('+ user connected');
  socket.on('disconnect', function() {
    console.log('- user disconnected');
  });
});
