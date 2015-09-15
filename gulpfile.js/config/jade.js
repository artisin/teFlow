var config = require('./');

module.exports = {
  watch: config.sourceDirectory + '/views/jade/**/*.jade',
  src: config.sourceDirectory + '/views/jade/*.jade',
  injectJade: config.publicTemp + '/**/*.html',
  publicTemp: config.sourceDirectory + '/.dist',
  dest: config.publicDirectory,
  publicAssets: config.publicAssets
};