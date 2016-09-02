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
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 600;
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const BALL_RAD = 5;

function Ship(x, y){
    this.rad = 10;
    this.d = 20
    this.loc = createVector(x, y);
    this.acc = createVector(0, 0);
    this.update = function(){
        this.loc.add(this.acc);
        if (this.loc.x < this.rad || this.loc.x > WORLD_WIDTH - this.rad) { 
            this.acc.x *= -1; 
            if (this.loc.x < this.rad) {
                this.loc.x = this.rad;
            } else (this.loc.x = WORLD_WIDTH - this.rad);
        }
        if (this.loc.y < this.rad || this.loc.y > WORLD_HEIGHT - this.rad) { 
            this.acc.y *= -1; 
            if (this.loc.y < this.rad) {
                this.loc.y = this.rad;
            } else (this.loc.y = WORLD_HEIGHT - this.rad);
        }
    }
    this.draw = function(){
        fill(0, 0, 0);
        ellipse(this.loc.x, this.loc.y, this.rad*2, this.rad*2);
    }
}

function overlap(s, b){
    return Math.sqrt( (s.loc.x - b.x) * (s.loc.x - b.x) + (s.loc.y - b.y) * (s.loc.y - b.y) ) < ( s.rad + BALL_RAD);
}

function setup(){
    canvas = createCanvas(VIEW_WIDTH, VIEW_HEIGHT).parent("canvasHere");
    ship = new Ship(VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
    balls = [];
    for (var i = 0; i < 20; i++){
        var x = Math.floor(Math.random() * WORLD_WIDTH - ship.rad) + BALL_RAD;
        var y = Math.floor(Math.random() * WORLD_HEIGHT - ship.rad) + BALL_RAD;
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
        if (! overlap(ship, createVector(x, y) && mouseX > 0 && mouseY > 0 && mouseX < VIEW_WIDTH && mouseY < VIEW_HEIGHT)){
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