module.exports = function override(config, env) {
  if (env === 'development') {
    // required for web workers to work with HMR
    config.output.globalObject = 'this';
  }

  return config;
};
