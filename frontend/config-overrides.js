const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "https": require.resolve("https-browserify"),
    "http": require.resolve("stream-http"),
    "buffer": require.resolve("buffer"),
    "url": require.resolve("url/"),
    "vm": require.resolve("vm-browserify"),
    "process": require.resolve("process/browser")
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];

  return config;
};