const baseConfig = require('./webpack.base.config');

module.exports = Object.assign({}, baseConfig, {
  mode: 'development'
})