const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  if (env === 'development') {
    // required for web workers to work with HMR
    config.output.globalObject = 'this';
  }

  config.plugins = config.plugins.map(plugin => {
    if (plugin.constructor.name === 'GenerateSW') {
      return new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './src/serviceWorkerCustom.js',
        swDest: 'service-worker.js'
      })
    }

    return plugin;
  });

  return config;
};
