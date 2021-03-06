var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var rad = 10;
var maxSpeed = 6;
var ball = [{xPos:rand(canvas.width-rad*2)+rad,
  yPos:rand(canvas.height-rad*2)+rad,
  rad:rad,
  xVel:rand(maxSpeed),
  yVel:rand(maxSpeed)}];
var framerate = 1000/40;//40FPS
var nBalls = 0;
var date = new Date();
var timeInit = date.getTime();
var time = timeInit;
var avatar = {xPos:0,yPos:0};
var go = setInterval(function(){
  date = new Date();
  if((date.getTime()-time) > 5000){
    nBalls += 1;
    time = date.getTime()
    ball[nBalls] = {xPos:rand(canvas.width-rad*2)+rad,
      yPos:rand(canvas.height-rad*2)+rad,
      rad:rad,
      xVel:rand(maxSpeed),
      yVel:rand(maxSpeed)};
  }
  update();
},framerate);

canvas.addEventListener('mousemove', function(event){
  getMouseCoords(event);
});

function update(){
  draw();
  move();
};

function gameOver(avatar,ball){
  if (collision(avatar,ball)){
    clearInterval(go);
    youLose();
  };
};

function getMouseCoords(event){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  avatar.xPos = mouseX;
  avatar.yPos = mouseY;
}
function drawCircle(xPos,yPos,rad){
  ctx.beginPath();
  ctx.arc(xPos,yPos,rad,0,2*Math.PI);
  ctx.fill()
};
function draw(){
  //background
  ctx.fillStyle = '#77f';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  //Avatar
  ctx.fillStyle = 'red';
  ctx.fillRect(avatar.xPos-5,avatar.yPos-5,10,10);
  //balls
  var grd=ctx.createRadialGradient(ball[0].xPos-2.5,ball[0].yPos-2.5,1,ball[0].xPos-2.5,ball[0].yPos-2.5,10);
  grd.addColorStop(1,"#333");
  grd.addColorStop(0,"#ccc");
  ctx.fillStyle = grd;
  if(nBalls === 0){drawCircle(ball[0].xPos,ball[0].yPos,ball[0].rad)};
  for(var i = 0; i < nBalls+1; i++){
    grd=ctx.createRadialGradient(ball[i].xPos-2.5,ball[i].yPos-2.5,1,ball[i].xPos-2.5,ball[i].yPos-2.5,10);
    grd.addColorStop(1,"#333");
    grd.addColorStop(0,"#ccc");
    ctx.fillStyle = grd;
    drawCircle(ball[i].xPos,ball[i].yPos,ball[i].rad);
  };
  // timer
  ctx.font = "30px Arial";
  var seconds = Math.floor((date.getTime()-timeInit)/1000);
  ctx.fillText(seconds,10,50);
};
function move(){
      // Bounce off walls
      if(nBalls === 0){
        wall(ball[0]);
        ball[0].xPos += ball[0].xVel;
        ball[0].yPos += ball[0].yVel;
      };
      for(var i = 0; i<nBalls+1; i++){
        // check if game is over.
        gameOver(avatar,ball[i]);
        // Check for wall contact
        wall(ball[i]);
        // Bounce off Eachother
        for(var j = 0; j<nBalls; j++){
          if(i!=j){
            if (collision(ball[i],ball[j])){
              bounce(ball[i],ball[j]);
            };
          };
        };
        //acually move.
        ball[i].xPos += ball[i].xVel;
        ball[i].yPos += ball[i].yVel;
    };
};
function wall(ballFunc){
  if(ballFunc.yPos > (canvas.height-ballFunc.rad) || (ballFunc.yPos < ballFunc.rad)){
    ballFunc.yVel = -ballFunc.yVel*1.01
  };
  if(ballFunc.xPos > (canvas.width-ballFunc.rad) || (ballFunc.xPos < ballFunc.rad)){
    ballFunc.xVel = -ballFunc.xVel*1.01
  };
};
function bounce(ballA,ballB){
  //This functions calculates a new velocity assuming an elastic collision between balls.
  var dx = ballA.xPos - ballB.xPos;
  var dy = ballA.yPos - ballB.yPos;
  var dVx = ballA.xVel - ballB.xVel;
  var dVy =ballA.yVel - ballB.yVel;
  var alpha = (dVx*dx+dVy*dy)/(dx**2+dy**2);
  ballA.xVel = ballA.xVel - alpha*dx;
  ballA.yVel = ballA.yVel - alpha*dy;
  ballB.xVel = ballB.xVel + alpha*dx;
  ballB.yVel = ballB.yVel + alpha*dy;
};
function collision(ballA,ballB){
  if(distance(ballA,ballB) < rad*2){
    return true;
  }
  else{
    return false;
  }
};
function distance(ballA,ballB){
  return(Math.sqrt((ballA.xPos-ballB.xPos)**2+(ballA.yPos-ballB.yPos)**2));
};
function youLose(){
  //background
  ctx.fillStyle = '#444';
  ctx.globalAlpha = 0.7; //sets opacity
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // text
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 1;
  ctx.font = "30px Arial";
  ctx.fillText("Game Over",canvas.width/2-80,canvas.height/2);
  var seconds = Math.floor((date.getTime()-timeInit)/1000);
  ctx.fillText(seconds,10,50);
};
function rand(x){
  return Math.floor((Math.random()*x+1));
}
