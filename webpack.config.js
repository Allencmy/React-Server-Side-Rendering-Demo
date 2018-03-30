const path = require('path');

const entry = './src/index.js';
const outputPath = path.resolve('./build');
const publicPath = '/build/';
const resolve = {
  extensions: ['.js', '.jsx'],
};

const clientConfig = {
  entry,
  output: {
    path: outputPath,
    filename: 'index.bundle.js',
    publicPath,
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      include: [path.resolve('./src')],
      options: {
        plugins: ['dynamic-import-webpack'],
      },
    }],
  },
  resolve,
};

const serverConfig = {
  entry,
  output: {
    path: outputPath,
    filename: 'index.server.bundle.js',
    libraryTarget: 'commonjs2',
    publicPath,
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      include: [path.resolve('./src')],
      options: {
        plugins: ['dynamic-import-node'],
      },
    }],
  },
  resolve,
};

module.exports = [
  clientConfig,
  serverConfig,
];
