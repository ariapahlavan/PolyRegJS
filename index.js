
import {mapper} from './RangeMapper.js';
// const {mapper} = require('./src/util/RangeMapper');
import {canvasById} from './Canvas.js';
// const {canvasById} = require('./src/components/Canvas/Canvas');
import Regression from './Regression.js';
// const Regression = require('./src/components/Regression/Regression');

import dat from './dat.gui.min.js';

const gui = new dat.GUI();

const canvas = canvasById("myCanvas");
const w = canvas.width, h = canvas.height;

const normalizeX = mapper(-1, 1)(0, w);
const normalizeY = mapper(-1, 1)(h, 0);
const denormalizeX = x => Math.floor(mapper(0, w)(-1, 1)(x));
const denormalizeY = y => Math.floor(mapper(h, 0)(-1, 1)(y));
let clicked = false;
const isClicked = () => clicked;

const regression =
  new Regression(gui, denormalizeX, denormalizeY, canvas, isClicked);
setInterval(() => tf.tidy(() => regression.trainAndDraw()), 0);

const addPosition = e => regression.pushSample(normalizeX(e.clientX),
                                               normalizeY(e.clientY));

window.addEventListener("click", addPosition, false);

canvas.canvas()
  .addEventListener('mousemove', e => {if (clicked) addPosition(e);}, false);
canvas.canvas().addEventListener('mousedown', e => clicked = true, false);
canvas.canvas().addEventListener('mouseup', e => clicked = false, false);
