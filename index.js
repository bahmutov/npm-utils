module.exports = {
  install: require('./src/module-install'),
  test: require('./src/npm-test'),
  path: require('./src/npm-path'),
  version: require('./src/npm-version'),
  isUrl: require('./src/url'),
  registryUrl: require('./src/registry-url'),
  publish: require('./src/publish'),
  pack: require('./src/pack'),
  getPackage: require('./src/get-package')
};
