var blobs = [];
const size = require('window-size');
const windowWidth = size.width;
const windowHeight = size.height;

function Blob(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
}



// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
var server = app.listen(process.env.PORT || 3000, listen);

// This callback just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', blobs);  // Envoie de la liste des blobs à chaque client
}

// WebSocket connection handler
io.sockets.on('connection', function(socket) {
  console.log('We have a new client: ' + socket.id);

  socket.on('start', function(data) {
    console.log(socket.id + ' ' + data.x + ' ' + data.y + ' ' + data.r);
    var blob = new Blob(socket.id, data.x, data.y, data.r);
    blobs.push(blob);
  });

  socket.on('update', function(data) {
    var blob;
    for (var i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blob = blobs[i];
      }
    }
    blob.x = data.x;
    blob.y = data.y;
    blob.r = data.r;
  });

  // Événement pour manger un autre blob
  socket.on('eat', function(eatenBlobId) {
    // Trouver le blob mangé et le supprimer de la liste
    blobs = blobs.filter(blob => blob.id !== eatenBlobId);
    
    // Envoyer la nouvelle liste de blobs à tous les clients
    io.sockets.emit('heartbeat', blobs);
  });

  // Gérer la déconnexion d'un client
  socket.on('disconnect', function() {
    console.log('Client has disconnected');
    // Retirer le blob du client déconnecté
    for (var i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blobs.splice(i, 1);
      }
    }
    // Envoyer la mise à jour à tous les clients
    io.sockets.emit('heartbeat', blobs);
  });
});
