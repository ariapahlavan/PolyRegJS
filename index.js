
import {mapper} from './src/util/RangeMapper';
import {canvasById} from './src/components/Canvas/Canvas';
import Regression from './src/components/Regression/Regression';

const canvas = canvasById("myCanvas");
const w = canvas.width, h = canvas.height;

const normalizeX = mapper(-1, 1)(0, w);
const normalizeY = mapper(-1, 1)(h, 0);
const denormalizeX = x => Math.floor(mapper(0, w)(-1, 1)(x));
const denormalizeY = y => Math.floor(mapper(h, 0)(-1, 1)(y));

const regression = new Regression(0.3, 5, denormalizeX, denormalizeY, canvas);

setInterval(() => tf.tidy(() => regression.trainAndDraw()), 0);

window.addEventListener("click", event => {
    regression.pushSample(normalizeX(event.clientX),
                          normalizeY(event.clientY));
});
