function getPreprocessor(func, args) {
  switch (func) {
    case "linear":
      return (v) => v * args[0] + args[1];
    case "roc":
      let roc = function(v, ts) {
        roc.downsample_ctr ++;
        if (roc.downsample_ctr < roc.downsample_factor) {
          return roc.downsample_roc;
        }
        roc.downsample_ctr = 0;

        let diff = v - roc.last;
        let timeDiff = ts - roc.lastTime;
        roc.last = v;
        roc.lastTime = ts;

        roc.rateofchange = (diff * 1000) / timeDiff;

        for (let i = 0; i < roc.filterTaps.length; i ++) {
          let b0, b1, b2, a0, a1, a2;
          [b0, b1, b2, a0, a1, a2] = roc.filterTaps[i];
          let y = (b0 * roc.rateofchange) + roc.state[i][0];
          roc.state[i][0] = (b1 * roc.rateofchange) - (a1 * y) + roc.state[i][1];
          roc.state[i][1] = (b2 * roc.rateofchange) - (a2 * y);
          roc.rateofchange = y;
        }
        roc.downsample_roc = roc.rateofchange;
        return roc.rateofchange;
        // roc.history.push(diff);
        // roc.times.push(timeDiff);
        // if (roc.history.length > 10) {
        //   roc.history.shift();
        //   roc.times.shift();
        // }

        // let sum = 0;
        // for (let i = 0; i < roc.history.length; i ++) {
        //   sum += roc.history[i] * 1000 / roc.times[i];
        // }

        // return sum / roc.history.length;
      }

      roc.downsample_factor = 20;
      roc.downsample_ctr = 0;
      roc.downsample_roc = 0;

      roc.last = 0;
      roc.lastTime = 0;
      roc.history = [];
      roc.times = [];

      roc.state = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ];

      roc.filterTaps = [

        [ 3.12389769e-05,  6.24779538e-05,  3.12389769e-05,
          1.00000000e+00, -1.72593340e+00,  7.47447372e-01],
        [ 1.00000000e+00,  2.00000000e+00,  1.00000000e+00,
          1.00000000e+00, -1.86380049e+00,  8.87033000e-01]

      ];

      return roc;
  }
}

module.exports = { getPreprocessor };