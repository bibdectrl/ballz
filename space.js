/*
  "GAME" todos:
  
  -- bigger gameplay area, utilizing camera / 2d transformations
  
  -- player hits a wall? new ball
  
  -- dynamic scoring
  
  -- balls that kill the player
  
  -- win when there are no more balls


*/




var canvas;
var ship;
var balls;
var pressed;

function Ship(x, y){
    this.rad = 10;
    this.loc = createVector(x, y);
    this.acc = createVector(0, 0);
    this.update = function(){
        this.loc.add(this.acc);
        if (this.loc.x < this.rad || this.loc.x > 800 - this.rad) { 
            this.acc.x *= -1; 
            if (this.loc.x < this.rad) {
                this.loc.x = this.rad;
            } else (this.loc.x = 800 - this.rad);
        }
        if (this.loc.y < this.rad || this.loc.y > 600 - this.rad) { 
            this.acc.y *= -1; 
            if (this.loc.y < this.rad) {
                this.loc.y = this.rad;
            } else (this.loc.y = 600 - this.rad);
        }
    }
    this.draw = function(){
        fill(255, 0, 0);
        ellipse(this.loc.x, this.loc.y, this.rad * 2, this.rad * 2);
    }
}

function overlap(s, b){
    return Math.sqrt( (s.loc.x - b.x) * (s.loc.x - b.x) + (s.loc.y - b.y) * (s.loc.y - b.y) ) < ( s.rad + 5);
}

function setup(){
    canvas = createCanvas(800, 600).parent("canvasHere");
    ship = new Ship(400, 300);
    balls = [];
    for (var i = 0; i < 20; i++){
        var x = Math.floor(Math.random() * 790) + 5;
        var y = Math.floor(Math.random() * 590) + 5;
        balls.push(createVector(x, y));
    }
    pressed = false;
}

function draw(){
    background(255, 255, 255);
    var acc = createVector(0, 0);
    if (mouseIsPressed && ! pressed){
        var x = mouseX;
        var y = mouseY;
        if (! overlap(ship, createVector(x, y))){
            acc.x = mouseX;
            acc.y = mouseY;
            acc.sub(ship.loc);
            acc.normalize();
            acc.mult(3);
            ship.acc = acc;
            balls.push(createVector(mouseX, mouseY));
        }
        pressed = true;
    }
    if (! mouseIsPressed) pressed = false;
    for (var i = 0; i < balls.length; i++){
        fill(0, 255, 0);
        ellipse(balls[i].x, balls[i].y, 10, 10);
    }
    ship.draw();
    ship.update();
    for (var i = balls.length - 1; i >= 0; i--){
        if (overlap(ship, balls[i])){
            balls.splice(i, 1);
            ship.rad += 1;
        }
    }
    text(`Remaining: ${balls.length}`, 10, 20);
}