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

const drawPath = (ctx) => (color) => (xs, ys) => {
  //credit: https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

  ctx.strokeStyle=color;
  // move to the first point
   ctx.moveTo(xs[0], ys[0]);
   
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
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  return {
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
