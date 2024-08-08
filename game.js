var version = '0.1';

requestaframe = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 1200;
c.height = 560;
document.body.appendChild(c);

var perm = [];
while (perm.length < 255) {
  while (perm.includes((val = Math.floor(Math.random() * 255))));
  perm.push(val);
}

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
var noise = (x) => {
  x = (x * 0.01) % 254;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

var Player = function() {
  this.x = c.width / 2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.rSpeed = 0.005;
  this.speed = 1;
  this.isLost = false;

  this.img = new Image();
  this.img.src = "main_sprite.png";
  this.draw = function() {
    var p1 = c.height - noise(t + this.x) * 0.4;
    var p2 = c.height - noise(t + 5 + this.x) * 0.4;

    var grounded = 0;
    if (p1 - 12 > this.y) {
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (p1 - 12);
      this.y = p1 - 12;
      grounded = 1;
    }

    var angle = Math.atan2(p2 - 12 - this.y, this.x + 5 - this.x);
    this.y += this.ySpeed;

    if (!playing || (grounded && Math.abs(this.rot) > Math.PI * 0.5)) {
      if (!this.isLost) {
        this.isLost = true;
        speed = 0;
        this.ySpeed = -10;

        setTimeout(() => {
          menu_status = "game_over"
        }, 500);
      }
      this.rSpeed = 0;
      k.ArrowUp = 1;
      this.x -= speed * 5;
    }

    if (grounded && playing) {
      this.rot -= (this.rot - angle) * 0.65;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }
    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
    this.rot -= this.rSpeed * 0.1;
    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;
    ctx.save();
    ctx.translate(this.x, this.y - 3);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -20, -20, 45, 45);
    ctx.restore();
  };
};

var player = new Player();
var score = 0;



var t = 0;
var speed = 0.02;
var playing = true;
var k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
var backgroundImage = new Image();
backgroundImage.src = "space.png";


function drawScore() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.fillText("Score: " + score.toFixed(0),40, 40);
}

function gameOver() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 50px Arial";
  ctx.center
  ctx.fillText("Game Over!",450,200);
  ctx.fillText("Your Score: " + (Math.round(score)) , 450,300);

}


function loop() {
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
  t += 10 * speed;

  // Draw the background image
  ctx.drawImage(backgroundImage, 0, 0, c.width, c.height);

  // Draw the foreground ground
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(0, c.height);
  for (let i = 0; i < c.width; i++) ctx.lineTo(i, c.height - noise(t + i) * 0.4);
  ctx.lineTo(c.width, c.height);
  ctx.fill();

  // Draw the player

  // Check if player has lost the game
  if (player.isLost) {
    playing = false; // Stop the game
    gameOver();
  } else {
    requestAnimationFrame(loop);
  }
  
  player.draw();
  if (player.x < 0) restart();
  score += speed;
  drawScore();
  
}

onkeydown = (d) => (k[d.key] = 1);
onkeyup = (d) => (k[d.key] = 0);

function restart() {
  player = new Player();
  t = 0;
  speed = 0.02;
  playing = true;
  k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
}

loop();
function key_down(e) {
  var key_id = e.keyCode || e.which;
  if (key_id === 40) //down key
  {
    player.is_downkey = true;
    e.preventDefault();
  }
  if (key_id === 38) //up key
  {
    player.is_upkey = true;
    e.preventDefault();
  }
  if (key_id === 37) //left key
  {
    player.is_leftkey = true;
    e.preventDefault();
  }
  if (key_id === 39) //right key
  {
    player.is_rightkey = true;
    e.preventDefault();
  }
  if (key_id === 27 || key_id === 80) //esc or p key
  {
    is_menu = true;
    menu_status = 'pause';
  }
}

function key_up(e) {
  var key_id = e.keyCode || e.which;
  if (key_id === 40) //down key
  {
    player.is_downkey = false;
    e.preventDefault();
  }
  if (key_id === 38) //up key
  {
    player.is_upkey = false;
    e.preventDefault();
  }
  if (key_id === 37) //left key
  {
    player.is_leftkey = false;
    e.preventDefault();
  }
  if (key_id === 39) //right key
  {
    player.is_rightkey = false;
    e.preventDefault();
  }
}
