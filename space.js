/*
  "GAME" todos:
  
  -- bigger gameplay area, utilizing camera / 2d transformations
  
    -- dynamic scoring
*/

var canvas;
var ship;
var balls;
var bombs;
var pressed;
var win;
var lose;

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
            addBall();
            if (this.loc.x < this.rad) {
                this.loc.x = this.rad;
            } else (this.loc.x = WORLD_WIDTH - this.rad);
        }
        if (this.loc.y < this.rad || this.loc.y > WORLD_HEIGHT - this.rad) { 
            this.acc.y *= -1; 
            addBall();
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

function Bomb(x, y){
    this.loc = createVector(x, y);
    this.acc = createVector(random(-1, 1), random(-1, 1));
    this.update = function(){
        this.loc.add(this.acc);
        if (this.loc.x < BALL_RAD || this.loc.x > WORLD_WIDTH - BALL_RAD) { 
            addBall();
            this.acc.x *= -1;
            if (this.loc.x < BALL_RAD) {
                this.loc.x = BALL_RAD;
            } else (this.loc.x = WORLD_WIDTH - BALL_RAD);
        }
        if (this.loc.y < BALL_RAD || this.loc.y > WORLD_HEIGHT - BALL_RAD) { 
            this.acc.y *= -1; 
            addBall();
            if (this.loc.y < BALL_RAD) {
                this.loc.y = BALL_RAD;
            } else (this.loc.y = WORLD_HEIGHT - BALL_RAD);
        }
    }
    this.draw = function(){
        fill(255, 0, 0);
        ellipse(this.loc.x, this.loc.y, BALL_RAD*2, BALL_RAD*2);
    }
}



function overlap(s, b){
    return Math.sqrt( (s.x - b.x) * (s.x - b.x) + (s.y - b.y) * (s.y - b.y) ) < (BALL_RAD + BALL_RAD);
}

function overlapShip(s, b){
    return Math.sqrt( (s.loc.x - b.x) * (s.loc.x - b.x) + (s.loc.y - b.y) * (s.loc.y - b.y) ) < (s.rad + BALL_RAD);
}

function overlaps(o, os){
    for (var i = 0; i < os.length; i++){
        if (overlap(o, os[i])){
            return true;
        }
    }
    return false;
}

function addBall(){
    var x = Math.floor(Math.random() * WORLD_WIDTH) + BALL_RAD;
    var y = Math.floor(Math.random() * WORLD_HEIGHT) + BALL_RAD;
    x = constrain(x, BALL_RAD, WORLD_WIDTH - BALL_RAD);
    y = constrain(y, BALL_RAD, WORLD_HEIGHT - BALL_RAD);
    balls.push(createVector(x, y));
}

function reset(){
    ship = new Ship(VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
    balls = [];
    bombs = [];
    win = false;
    lose = false;
    for (var i = 0; i < 20; i++){
        var x = Math.floor(Math.random() * WORLD_WIDTH - ship.rad) + BALL_RAD;
        var y = Math.floor(Math.random() * WORLD_HEIGHT - ship.rad) + BALL_RAD;
        x = constrain(x, BALL_RAD, WORLD_WIDTH - BALL_RAD);
        y = constrain(y, BALL_RAD, WORLD_HEIGHT - BALL_RAD);
        balls.push(createVector(x, y));
    }
    
    for (var i = 0; i < 3; i++){
        var x = Math.floor(Math.random() * WORLD_WIDTH - ship.rad) + BALL_RAD;
        var y = Math.floor(Math.random() * WORLD_HEIGHT - ship.rad) + BALL_RAD;
        x = constrain(x, BALL_RAD, WORLD_WIDTH - BALL_RAD);
        x = constrain(y, BALL_RAD, WORLD_HEIGHT - BALL_RAD);        
        
        while (overlaps({x:x, y:y}, balls) || overlapShip(ship, {x:x, y:y})){
            x = Math.floor(Math.random() * WORLD_WIDTH - ship.rad) + BALL_RAD;
            y = Math.floor(Math.random() * WORLD_HEIGHT - ship.rad) + BALL_RAD;
            x = constrain(x, BALL_RAD, WORLD_WIDTH - BALL_RAD);
            y = constrain(y, BALL_RAD, WORLD_HEIGHT - BALL_RAD);
        }
        bombs.push(new Bomb(x, y));
    }
    
    pressed = false;
}

function setup(){
    canvas = createCanvas(VIEW_WIDTH, VIEW_HEIGHT).parent("canvasHere");
    resetButton = createButton("reset").mousePressed(function(){ reset() }).parent('reset');
    reset();
}

function draw(){
    if (win) {
        background(0);
        textSize(56);
        textAlign(CENTER);
        fill(0, 255, 0);
        text("You Win!", VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
    }
    else if (lose){
         background(0);
         textSize(56);
         textAlign(CENTER);
         fill(255, 0, 0);
         text("You Lose!", VIEW_WIDTH / 2, VIEW_HEIGHT / 2); 
    } else {
        background(255, 255, 255);
        var acc = createVector(0, 0);
        if (mouseIsPressed && ! pressed){
            var x = mouseX;
            var y = mouseY;
            if ( (! overlap(ship, {x:x, y:y})) && mouseX > 0 && mouseY > 0 && mouseX < VIEW_WIDTH && mouseY < VIEW_HEIGHT ){
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
        
        for (var i = 0; i < bombs.length; i++){
            bombs[i].draw();
        }
        
        ship.draw();
        ship.update();
        for (var i = balls.length - 1; i >= 0; i--){
            if (overlapShip(ship, balls[i])){
                balls.splice(i, 1);
                ship.rad += 1;
            }
        }
        
        for (var i = bombs.length - 1; i >= 0; i--){
            bombs[i].update();
            if (overlapShip(ship, bombs[i].loc)){
                bombs.splice(i, 1);
                lose = true;
            }
        }
        
        if (balls.length == 0){
            win = true;
        }
        textSize(12);
        text(`Remaining: ${balls.length}`, 10, 20);
    }
}