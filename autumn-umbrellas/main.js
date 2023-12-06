(function() {

    var canvas,
      cx,
      umbrellas = [],
      time = Date.now(),
      MAX = 50, // max number of umbrellas :)
      GRAVITY = .015,
      CURVE = 50, // dmax radius of the biggest part (used to set private curve)
      HANDLE_LENGTH = 50, // max handle length (also used to set private)
      MAX_STICK = 30, // max angle of a single umbrella
      INCREASE_UNIT = .1,
      COLORS = [
        'rgba(154, 229, 87, 0.75)' // at first i was going to use a specified range of colors (and then choose randomly from it within function constructor).. can be done by adding colors to the array and uncommenting line 27
      ];
  
    canvas = document.querySelector('canvas');
    cx = canvas.getContext('2d');
  
    function Umbrella(x, y) {
      this.x = x;
      this.y = y;
      this.c = CURVE / Math.max(Math.random() * (CURVE / 10), 1);
      this.l = HANDLE_LENGTH / Math.max(Math.random() * (HANDLE_LENGTH / 10), 1);
      this.h = Math.random() < .5; // handle direction
      this.d = Math.random() < .5; // direction (right == true)
      /*this.color = COLORS[Math.floor(Math.random() * COLORS.length)];*/
      this.color = COLORS[0];
      this.vy = 0;
      this.e = 0;
      this.max_stick = Math.random() * MAX_STICK;
      this.switch = Math.random() < .5; // used for changing direction after reaching max_stick num
    }
  
    Umbrella.prototype.draw = function() {
      var anchor = this.x;
      cx.save();
      cx.strokeStyle = "black";
      cx.fillStyle = this.color;
      cx.lineWidth = 1.5;
      cx.translate(anchor, this.y);
      cx.rotate(this.e * Math.PI / 180);
      cx.translate(-anchor, -this.y);
      cx.beginPath();
      cx.arc(anchor, this.y, this.c, Math.PI, 2 * Math.PI);
      cx.quadraticCurveTo(anchor + this.c / 1.3, this.y - this.c / 2.5, anchor + this.c / 2, this.y);
      cx.quadraticCurveTo(anchor + this.c / 4, this.y - this.c / 2.5, anchor, this.y);
      cx.quadraticCurveTo(anchor - this.c / 4, this.y - this.c / 2.5, anchor - this.c / 2, this.y);
      cx.quadraticCurveTo(anchor - this.c / 1.3, this.y - this.c / 2.5, anchor - this.c, this.y);
      cx.fill();
      cx.moveTo(anchor, this.y);
      cx.lineTo(anchor, this.y + this.l);
      if (this.h) {
        cx.arc(anchor - this.c / 8, this.y + this.l, this.c / 8, 0, Math.PI);
      } else {
        cx.arc(anchor + this.c / 8, this.y + this.l, this.c / 8, Math.PI, 2 * Math.PI, true);
      }
      cx.stroke();
      cx.restore();
    };
  
    Umbrella.prototype.fall = function() {
      this.y += this.vy;
      this.vy += GRAVITY;
      if (this.e > this.max_stick) {
        this.switch = true;
      }
      if (this.e < -this.max_stick) {
        this.switch = false;
      }
      if (this.switch) {
        this.e -= INCREASE_UNIT;
      } else {
        this.e += INCREASE_UNIT;
      }
      if (this.d) {
        this.x += Math.abs(this.e) * INCREASE_UNIT / 2;
      } else {
        this.x -= Math.abs(this.e) * INCREASE_UNIT / 2;
      }
    };
  
    function spawnSingleUmbrella() {
      umbrellas.push(new Umbrella(Math.random() * canvas.width, Math.random() * CURVE * 2 - (CURVE * 2)));
    }
  
    function redrawWorld() {
      resizeWorld();
      cx.clearRect(0, 0, canvas.width, canvas.height);
      var ul = umbrellas.length;
      var u;
      if (ul > 0) {
        for (var i = 0; i < ul; i++) {
          u = umbrellas[i];
          if (u.y - CURVE * 2 > canvas.height || u.x - CURVE * 2 > canvas.width || u.x + CURVE * 2 < 0) {
            umbrellas.splice(i, 1);
            spawnSingleUmbrella();
            time = Date.now();
          } else {
            u.draw();
            u.fall();
          }
        }
      }
      if (ul < MAX && (Date.now() - time) > 250) {
        spawnSingleUmbrella();
        time = Date.now();
      }
      requestAnimationFrame(redrawWorld);
    }
  
    function resizeWorld() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    document.addEventListener('resize', resizeWorld, false);
  
    resizeWorld();
    redrawWorld();
  
  }());