module.exports = {
  extends: 'lighthouse:default',
  settings: {
    skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
  },
};
