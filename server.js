//#ef LIBRARIES
var express = require('express');
var app = express();
var path = require('path');
var timesyncServer = require('timesync/server'); //load ts library
var httpServer = require('http').createServer(app);
io = require('socket.io').listen(httpServer); //load socketIO library
//#endef END LIBRARIES

//#ef HTTP SERVER
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }`));
//#endef END HTTP SERVER

//#ef SERVE STATIC FILES THROUGH EXPRESS
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html')); //index.html in the public folder is the initial page served
});
//#endef END SERVER STATIC FILES

//#ef TIMESYNC SERVER
app.use('/timesync', timesyncServer.requestHandler); //initialize timesync server
//#endef END TIMESYNC SERVER

//#ef SOCKET IO
io.on('connection', function(socket) {

  socket.on('syncGo', function(data) { //This function runs  when a message with the tag 'syncGo' is received from a client

    //'data' is passed into this function and is an object
    //to reference data passed in use data.(key)
    let timestamp = data.timestamp;

    //Send a message back to all clients
    //(for some reason need to use socket.broadcaat and socket.emit, to send to all clients and sender)
    socket.broadcast.emit('syncGoBroadcast_fromServer', {
      timestamp: timestamp,
    });

    socket.emit('syncGoBroadcast_fromServer', {
      timestamp: timestamp,
    });

  }); // socket.on('syncGo', function(data) { //This function runs  when a message with the tag 'syncGo' is received from a client END

}); // End Socket IO
//#endef >> END SOCKET IO
