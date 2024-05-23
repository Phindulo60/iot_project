const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    path: require.resolve('path-browserify'),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  return config;
};
