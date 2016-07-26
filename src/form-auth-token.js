'use strict';

var la = require('lazy-ass');
var is = require('check-more-types');
var getNpmToken = 'https://www.npmjs.com/package/get-npm-token';

function formAuthToken (registryUrl, tokenEnvName) {
  if (!tokenEnvName) {
    if (!process.env.NPM_TOKEN) {
      throw new Error('Cannot find NPM_TOKEN\nuse ' + getNpmToken + ' to get one');
    }
    tokenEnvName = 'NPM_TOKEN';
  }

  la(is.url(registryUrl), 'npm registry should be an url', registryUrl);

  registryUrl = registryUrl
    .replace(/^http(s)?:/, '');
  var test = registryUrl + ':_authToken=';
  var token = test + '${' + tokenEnvName + '}';
  return {
    test: test,
    token: token
  };
}

module.exports = formAuthToken;
