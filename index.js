
import {mapper} from './src/util/RangeMapper';
import {canvasById} from './src/components/Canvas/Canvas';
import Regression from './src/components/Regression/Regression';

// setInterval(() => tf.tidy(() => trainAndDraw()), 25);
//
const canvas = canvasById("myCanvas");
const w = canvas.width, h = canvas.height;
// const line = {x1: 0, x2: 0, y1: 0, y2: 0};

const normalizeX = mapper(0, 1)(0, w);
const normalizeY = mapper(0, 1)(h, 0);
const denormalizeX = x => Math.floor(mapper(0, w)(0, 1)(x));
const denormalizeY = y => Math.floor(mapper(h, 0)(0, 1)(y));

// const data = [];
// const labels = [];
// const random = (x) => Math.random() * x;
// const m = tf.variable(tf.scalar(random(1)));
// const b = tf.variable(tf.scalar(random(1)));
//
// const learningRate = 0.5;
// const optimizer = tf.train.sgd(learningRate);
// const predict = (xs) => tf.tensor1d(xs).mul(m).add(b);
// const loss = (pred, label) => pred.sub(label).square().mean();
//
// const trainAndDraw = () => {
//     const n = data.length;
//     if (n < 1) return;
//
//     canvas.clear();
//
//     optimizer.minimize(() => loss(predict(data), tf.tensor1d(labels)));
//     const xs = [0, 1];
//     predict(xs)
//       .data()
//       .then(ys => {
//         line.x1 = denormalizeX(xs[0]);
//         line.y1 = denormalizeY(ys[0]);
//         line.x2 = denormalizeX(xs[1]);
//         line.y2 = denormalizeY(ys[1]);
//         canvas.drawLine(line);
//       });
//
//     for (let i = 0; i < n; i++)
//       canvas.drawDot(denormalizeX(data[i]),
//                      denormalizeY(labels[i]));
//
// };

const regression = new Regression(0.5, 4, denormalizeX, denormalizeY, canvas);
setInterval(() => tf.tidy(() => regression.trainAndDraw()), 0);

window.addEventListener("click", function(event){
    const x = event.clientX, y = event.clientY;
    regression.pushSample(normalizeX(x), normalizeY(y));
});
