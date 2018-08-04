const random = (x) => Math.random() * x;

const generateVars = n => {
  const vars = [];

  for (var i = 0; i < n; i++) {
    vars.push(tf.variable(tf.scalar(random(1))));
  }

  return vars;
}

class Regression {
  constructor(learningRate, deg, denormalizeX, denormalizeY, canvas) {
    this.canvas = canvas;

    this.denormalizeX = denormalizeX;
    this.denormalizeY = denormalizeY;

    this.line = {x1: 0, x2: 0, y1: 0, y2: 0};

    this.data = [];
    this.labels = [];

    // this.m = tf.variable(tf.scalar(random(1)));
    // this.b = tf.variable(tf.scalar(random(1)));
    this.vars = generateVars(deg);

    this.learningRate = learningRate;
    this.optimizer = tf.train.sgd(this.learningRate);
  }

  predict(xs) {
    const vars = this.vars;
    if (vars.length === 0){
      return;
    }

    let curTf = vars[0];
    for (var i = vars.length-1; i > 0; i--) {
      curTf = tf.tensor1d(xs).pow(i).mul(vars[i]).add(curTf);
    }

    return curTf;

    // m * x^1 + b * x^0

    // a * x^2 + b * x^1 + c * x^0
    // return tf.tensor1d(xs).mul(this.m).add(this.b);
  }

  loss(pred, label) { return pred.sub(label).square().mean(); }

  trainAndDraw() {
      const n = this.data.length;
      if (n < 1) return;
      this.canvas.clear();

      this.optimizer.minimize(
          () => this.loss(this.predict(this.data), tf.tensor1d(this.labels)));

      const xs = [];
      for (var i = 0; i < 1.0; i+=0.1) {
        xs.push(i);
      }

      this.predict(xs)
          .data()
          .then(ys => {
            this.canvas.drawPath(xs.map(this.denormalizeX),
                                 ys.map(this.denormalizeY));
            // for (var i = 0; i < xs.length; i++) {
            //   this.canvas.drawDot(this.denormalizeX(xs[i]),
            //                       this.denormalizeY(ys[i]));
            // }
            // this.line.x1 = this.denormalizeX(xs[0]);
            // this.line.y1 = this.denormalizeY(ys[0]);
            // this.line.x2 = this.denormalizeX(xs[1]);
            // this.line.y2 = this.denormalizeY(ys[1]);
            // this.canvas.drawLine(this.line);
          });
      for (let i = 0; i < n; i++)
        this.canvas.drawDot(this.denormalizeX(this.data[i]),
                            this.denormalizeY(this.labels[i]));
  }

  pushSample(x, y) {
    this.data.push(x);
    this.labels.push(y);
  }
}

export default Regression;
