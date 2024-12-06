function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);

  // Update position based on mouse movement
  this.update = function() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.div(20);
    newvel.limit(0.5);
    this.vel.lerp(newvel, 0.1);
    this.pos.add(this.vel);
  };

  // Check if this blob eats another blob
  this.eats = function(other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r) {
      var sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum / PI);  // Update radius after eating
      return true;
    } else {
      return false;
    }
  };

  // Constrain blob's position within certain bounds
  this.constrain = function() {
    this.pos.x = constrain(this.pos.x, -width / 4, width / 4);
    this.pos.y = constrain(this.pos.y, -height / 4, height / 4);
  };

  // Draw the blob on screen
  this.show = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  };
}
