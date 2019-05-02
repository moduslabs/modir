/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = function override(config, env) {
  if (env === 'development') {
    // required for web workers to work with HMR
    config.output.globalObject = 'this'
  }

  // custom service workers
  config.plugins = config.plugins
    .map(plugin => {
      if (plugin.constructor.name === 'GenerateSW') {
        return new WorkboxWebpackPlugin.InjectManifest({
          swDest: 'service-worker.js',
          swSrc: './src/serviceWorkerCustom.js',
          chunks: ['page-modites'],
          exclude: [/\.(svg|png|map)$/, /^manifest.*\.js$/],
        })
      }

      // skip TS linting in webpack in favor of faster builds
      if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin') {
        return false
      }

      return plugin
    })
    .filter(Boolean)

  // custom alias for src/
  config.resolve.alias['@'] = path.resolve(__dirname, 'src')

  // remove eslint plugin (index #1)
  config.module.rules.splice(1, 1)

  // remove pdfmake from amcharts
  config.externals = [
    function(context, request, callback) {
      if (/(pdfmake|xlsx|canvg)/.test(request)) {
        return callback(null, 'commonjs ' + request)
      }

      callback()
    },
  ]

  // Webpack 5 will introduce something like this plugin
  // Testing this instead of creating a DLL setup

  config.plugins.push(new HardSourceWebpackPlugin())
  config.plugins.push(
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        // HardSource works with mini-css-extract-plugin but due to how
        // mini-css emits assets, assets are not emitted on repeated builds with
        // mini-css and hard-source together. Ignoring the mini-css loader
        // modules, but not the other css loader modules, excludes the modules
        // that mini-css needs rebuilt to output assets every time.
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
      },
    ]),
  )

  // use this code to quickly analyze current config
  // console.log(config.module.rules);
  // throw new Error('stop');
  // debugger;

  // todo: add cache-loader to babel; add DLL
  // config.module.rules[1].oneOf.map()

  return config
}
