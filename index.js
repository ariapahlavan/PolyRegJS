
import {mapper} from './src/util/RangeMapper';
import {canvasById} from './src/components/Canvas/Canvas';
import Regression from './src/components/Regression/Regression';

const dat = require('dat.gui');

const gui = new dat.GUI();

const canvas = canvasById("myCanvas");
const w = canvas.width, h = canvas.height;

const normalizeX = x => mapper(-1, 1)(0, w())(x);
const normalizeY = y => mapper(-1, 1)(h(), 0)(y);
const denormalizeX = x => Math.floor(mapper(0, w())(-1, 1)(x));
const denormalizeY = y => Math.floor(mapper(h(), 0)(-1, 1)(y));
let clicked = false;
const isClicked = () => clicked;


const regression =
  new Regression(gui, denormalizeX, denormalizeY, canvas, isClicked);
setInterval(() => tf.tidy(() => regression.trainAndDraw()), 0);

const addPosition = e => regression.pushSample(normalizeX(e.clientX),
                                               normalizeY(e.clientY));

canvas.canvas()
  .addEventListener('mousemove', e => {if (clicked) addPosition(e);});
canvas.canvas().addEventListener('mousedown', e => clicked = true);
canvas.canvas().addEventListener('mouseup', e => clicked = false);
canvas.canvas().addEventListener("click", addPosition);
window.addEventListener('resize', canvas.resize);
window.addEventListener('load', () => {
  const instruction = document.getElementById('instruction');
  setTimeout(() => {
    let op = 1;
    const timer = setInterval(() => {
        if (op <= 0.025){
            clearInterval(timer);
            instruction.style.display = 'none';
        }
        instruction.style.opacity = op;
        instruction.style.filter = 'alpha(opacity=' + op * 100 + ')';
        op -= op * 0.1;
    }, 50);
  }, 2000);
});
