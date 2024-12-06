
// Keep track of our socket connection
var socket;

var blob;

var blobs = [];
var zoom = 1;




function setup() {
  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < 200; i++) {
    var x = random(-width, width); // Génère une position aléatoire dans les limites de la fenêtre
    var y = random(-height, height);
    var r = 2;
    blobs.push(new Blob('', x, y, r));
    console.log(blobs);
  }
  
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');

  blob = new Blob(random(width), random(height), 8);
  // Make a little object with  and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('start', data);


  socket.on('heartbeat', function(data) {
    //console.log(data);
    blobs = data;
  });
}



function draw() {
  background(0);
  console.log(blob.pos.x, blob.pos.y);

  translate(width / 2, height / 2);
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
    if (id.substring(2, id.length) !== socket.id) {
      fill(0, 0, 255);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

      fill(255);
      textAlign(CENTER);
      textSize(4);
      text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r);
    }
  }



  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
  
    // Ensure we're not checking the blob against itself
    if (id.substring(2, id.length) !== socket.id) {
      var d = dist(blob.pos.x, blob.pos.y, blobs[i].x, blobs[i].y);
  
      // Check if the blobs are colliding
      if (d < blob.r + blobs[i].r) {
  
        // Check if the blob can eat the other blob (at least 10% smaller)
        if (blob.r > blobs[i].r * 1.1) {
          
          // Grow the blob slightly when it eats another blob
          blob.r += 0.01;  // You can adjust this value as needed
          
          blobs.splice(i, 1);

        }
      }
    }
  }
  
  

  blob.show();
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('update', data);
}