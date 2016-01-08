module.exports = {
  install: require('./module-install'),
  test: require('./npm-test'),
  path: require('./npm-path'),
  version: require('./npm-version'),
  isUrl: require('./url'),
  registryUrl: require('./registry-url'),
  publish: require('./publish'),
  pack: require('./pack'),
  getPackage: require('./get-package'),
  setAuthToken: require('./set-auth-token'),
  incrementVersion: require('./npm-increment-version')
};
