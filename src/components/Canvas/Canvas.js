const drawLineWithColor =  ctx => color => line => {
    const {x1, y1, x2, y2} = line;
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const drawDot = ctx => fg => (x, y) => {
    ctx.fillStyle=fg;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
};

const clearCanvas = ctx => (w, h) => () => ctx.clearRect(0, 0, w, h);

const random = (x=256) => Math.random() * x;

const channel = (x) => {
  let C = random();
  let increasing = true;

  return () => {
    C += (increasing ? x : -x);

    if (C >= 255) {
      C = 255;
      increasing = false;
    } else if (C <= 0) {
      C = 0;
      increasing = true;
    }

    return C;
  }
}

let R = channel(0.1), B = channel(0.5), G = channel(1);
const drawPath = (ctx) => (color) => (xs, ys) => {
  ctx.strokeStyle=`rgba(${R()}, ${B()}, ${G()}, 1)`;
  ctx.lineWidth= 2;
  // move to the first point
   ctx.moveTo(xs[0], ys[0]);

   //credit: https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
   let i;
   for (i = 0; i < xs.length - 2; i ++) {
      var xc = (xs[i] + xs[i + 1]) / 2;
      var yc = (ys[i] + ys[i + 1]) / 2;
      ctx.quadraticCurveTo(xs[i], ys[i], xc, yc);
   }
   // curve through the last two points
   ctx.quadraticCurveTo(xs[i], ys[i], xs[i+1], ys[i+1]);
   ctx.stroke();
}


const canvasOf = (canvas, fg='white', bg='black') => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;

  return {
    canvas: () => canvas,
    width: w,
    height: h,
    drawDot: drawDot(ctx)(fg),
    drawLine: drawLineWithColor(ctx)(fg),
    drawPath: drawPath(ctx)(fg),
    clearLine: drawLineWithColor(ctx)(bg),
    clear: clearCanvas(ctx)(w, h)
  };
};

export const canvasById =
  canvasId => canvasOf(document.getElementById(canvasId));
export const canvasByClass =
  canvasClass => canvasOf(document.getElementByClass(canvasClass));
