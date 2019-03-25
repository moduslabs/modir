const path = require('path');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  if (env === 'development') {
    // required for web workers to work with HMR
    config.output.globalObject = 'this';
  }

  // custom service workers
  config.plugins = config.plugins.map(plugin => {
    if (plugin.constructor.name === 'GenerateSW') {
      return new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './src/serviceWorkerCustom.js',
        swDest: 'service-worker.js',
      });
    }

    return plugin;
  });

  // custom alias for src/
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');

  // remove eslint plugin (index #1)
  config.module.rules.splice(1, 1);

  // remove pdfmake from amcharts
  config.externals = [
    /(xlsx|canvg)/,
    function(context, request, callback) {
      if (/(pdfmake)/.test(request)) {
        return callback(null, 'commonjs ' + request);
      }

      callback();
    },
  ];

  // use this code to quickly analyze current config
  // console.log(config.module.rules);
  // throw new Error('stop');
  // debugger;

  // todo: add cache-loader to babel; add DLL
  // config.module.rules[1].oneOf.map()

  return config;
};
