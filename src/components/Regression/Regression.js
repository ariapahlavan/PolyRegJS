const random = (x) => Math.random() * x;

const generateWights = n => {
  const weights = [];
  for (let i = 0; i < n; i++)
    weights.push(tf.variable(tf.scalar(random(1))));

  return weights;
}

const disposeOfWeights = weights => {
  for (let i = 0; i < weights.length; i++)
    tf.dispose(weights[i]);
};

class Regression {
  constructor(gui, denormalizeX, denormalizeY, canvas, isClicked) {
    this.canvas = canvas;

    this.denormalizeX = denormalizeX;
    this.denormalizeY = denormalizeY;

    this.data = [];
    this.labels = [];

    const trainOptimizers = {
      SGD: () => tf.train.sgd,
      Momentum: () => (lr, m=0) => tf.train.momentum(lr, m),
      Adagrad: () => tf.train.adagrad,
      ADADELTA: () => tf.train.adadelta,
      Adam: () => tf.train.adam,
      Adamax: () => tf.train.adamax,
      RMSProp: () => tf.train.rmsprop
    }

    const control = {
      learningRate: 0.3,
      degree: 3,
      optimizer: 'SGD',
      clearpoints: () => {
        this.data = [];
        this.labels = [];
        this.canvas.clear();
      }
    };

    this.weights = generateWights(control.degree+1);
    const setOptimizer =
      () => trainOptimizers[control.optimizer]()(control.learningRate);
    this.optimizer = setOptimizer();
    this.isClicked = isClicked;

    gui.add(control, 'learningRate', 0, 1)
       .step(0.01)
       .name('Learning Rate')
       .onChange(() => this.optimizer = tf.train.adam(control.learningRate));

    gui.add(control, 'degree', 1, 20)
       .step(1)
       .name('Degree')
       .onChange(() => {
         disposeOfWeights(this.weights);
         this.weights = generateWights(control.degree+1);
       });

    gui.add(control, 'optimizer', Object.keys(trainOptimizers))
       .name('Optimizer')
       .onChange(setOptimizer);

    gui.add(control, 'clearpoints')
       .name('Remove Point');
  }

  predict(xs) {
    const weights = this.weights;

    let curTf = weights[0];
    for (var i = weights.length-1; i > 0; i--)
      curTf = tf.tensor1d(xs).pow(i).mul(weights[i]).add(curTf);

    return curTf;
  }

  loss(pred, label) { return pred.sub(label).square().mean(); }

  trainAndDraw() {
      const n = this.data.length;
      if (n < 1) return;
      this.canvas.clear();

      if (!this.isClicked()) {
        this.optimizer.minimize(
            () => this.loss(this.predict(this.data), tf.tensor1d(this.labels)));

        const xs = [];
        for (let i = -1.0; i <= 1.0; i+=0.1)
          xs.push(i);

        this.predict(xs)
            .data()
            .then(ys => this.canvas.drawPath(xs.map(this.denormalizeX),
                                             ys.map(this.denormalizeY)));
      }
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
