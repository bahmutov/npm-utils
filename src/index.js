'use strict'

var registryUrl = require('registry-url')

function asyncRegistryUrl (scope) {
  /* global Promise */
  return Promise.resolve(registryUrl(scope))
}

module.exports = {
  install: require('./module-install'),
  repoInstall: require('./repo-install'),
  test: require('./npm-test'),
  path: require('./npm-path'),
  version: require('./npm-version'),
  isUrl: require('./url'),
  registryUrl: asyncRegistryUrl,
  publish: require('./publish'),
  pack: require('./pack'),
  getPackage: require('./get-package'),
  setAuthToken: require('./set-auth-token'),
  incrementVersion: require('./npm-increment-version'),
  prune: require('./npm-prune')
}
