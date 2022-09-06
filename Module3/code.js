"use strict";
console.log("Before Load");

function rotate(point, center, angle) {
  angle = (angle * Math.PI) / 180;
  const rotated_point = {};
  rotated_point.x =
    (point.x - center.x) * Math.cos(angle) -
    (point.y - center.y) * Math.sin(angle) +
    center.x;
  rotated_point.y =
    (point.x - center.x) * Math.sin(angle) +
    (point.y - center.y) * Math.cos(angle) +
    center.y;
  return rotated_point;
}

class Ship {
  position = { x: 0, y: 0 };
  #height = 75;
  #width = 50;

  #axis = { x: { x: 1, y: 0 }, y: { x: 0, y: 1 } };
  angle = 0;

  #speed_v = { x: 0, y: 0 };
  thrust = 0;
  #direction = { x: 0, y: 0 };

  constructor(canvas, position) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.position = { ...position };

    this.#axis.x = rotate(this.#axis.x, { x: 0, y: 0 }, 180);
    this.#axis.y = rotate(this.#axis.y, { x: 0, y: 0 }, 180);

    this.coords = [
      { x: 0, y: (this.#height * 3) / 4.0 },
      {
        x: this.#width / 2.0,
        y: -this.#height / 6.0,
      },
      {
        x: -this.#width / 2.0,
        y: -this.#height / 6.0,
      },
    ];
  }

  drive() {
    this.thrust = 10;

    this.#speed_v.x += this.#direction.x * this.thrust;
    this.#speed_v.y += this.#direction.y * this.thrust;
  }

  draw() {
    const axis = {};
    axis.x = rotate(this.#axis.x, { x: 0, y: 0 }, this.angle);
    axis.y = rotate(this.#axis.y, { x: 0, y: 0 }, this.angle);

    const coords = this.calculateCoords(axis);

    this.#direction.x = coords[0].x - this.position.x;
    this.#direction.y = coords[0].y - this.position.y;
    // making vector with length of 1
    const dirLength =
      (this.#direction.x ** 2 + this.#direction.y ** 2) ** (1 / 2.0);
    this.#direction.x /= dirLength;
    this.#direction.y /= dirLength;

    this.drawPath(coords);

    this.position.x += this.#speed_v.x;
    this.position.y += this.#speed_v.y;
    
    // slow speed cooldown
    this.#speed_v.x *= 0.95;
    this.#speed_v.y *= 0.95;
  }

  calculateCoords(axis) {
    return this.coords.map((item) => {
      const tmp = {};
      tmp.x = item.x * axis.x.x + item.y * axis.y.x + this.position.x;
      tmp.y = item.x * axis.x.y + item.y * axis.y.y + this.position.y;
      return tmp;
    });
  }

  drawPath(coords) {
    this.ctx.beginPath();
    this.ctx.moveTo(coords[0].x, coords[0].y);
    this.ctx.lineTo(coords[1].x, coords[1].y);
    this.ctx.lineTo(coords[2].x, coords[2].y);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }
}

function tick(canvas, ship) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ship.draw();
}

window.onload = () => {
  var canvas = document.getElementById("myCanvas");
  const ship = new Ship(canvas, { x: 100, y: 100 });

  document.addEventListener("keydown", keyDownHandler, false);

  function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      ship.angle += 5;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      ship.angle -= 5;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
      ship.drive();
    }
  }

  setInterval(() => tick(canvas, ship), 50);
};

console.log("After load");
