const random = (x) => Math.random() * x;

const generateVars = n => {
  const vars = [];
  for (let i = 0; i < n; i++)
    vars.push(tf.variable(tf.scalar(random(1))));

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

    this.vars = generateVars(deg);

    this.learningRate = learningRate;
    this.optimizer = tf.train.adam(this.learningRate);
  }

  predict(xs) {
    const vars = this.vars;

    let curTf = vars[0];
    for (var i = vars.length-1; i > 0; i--)
      curTf = tf.tensor1d(xs).pow(i).mul(vars[i]).add(curTf);

    return curTf;
  }

  loss(pred, label) { return pred.sub(label).square().mean(); }

  trainAndDraw() {
      const n = this.data.length;
      if (n < 1) return;
      this.canvas.clear();

      this.optimizer.minimize(
          () => this.loss(this.predict(this.data), tf.tensor1d(this.labels)));

      const xs = [];
      for (let i = -1.0; i <= 1.0; i+=0.1)
        xs.push(i);

      this.predict(xs)
          .data()
          .then(ys => this.canvas.drawPath(xs.map(this.denormalizeX),
                                           ys.map(this.denormalizeY)));
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
