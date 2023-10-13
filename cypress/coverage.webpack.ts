import * as path from 'path';

export default {
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: path.join(__dirname, '..', 'src'),
        exclude: [/\.(cy|spec)\.ts$/, /node_modules/, /(ngfactory|ngstyle)\.js/]
      }
    ]
  }
};
