'use strict'

var la = require('lazy-ass')
var is = require('check-more-types')
var getNpmToken = 'https://www.npmjs.com/package/get-npm-token'

// given registry url and token environment name returns
// string to be placed into user's ~/.npmrc file
// usually something like this //registry.npmjs.org/:_authToken=${NPM_TOKEN}
function formAuthToken (registryUrl, tokenEnvName) {
  if (!tokenEnvName) {
    if (!process.env.NPM_TOKEN) {
      throw new Error('Cannot find NPM_TOKEN\nuse ' + getNpmToken + ' to get one')
    }
    tokenEnvName = 'NPM_TOKEN'
  }
  la(is.url(registryUrl), 'npm registry should be an url', registryUrl)

  // strip protocol http/https part
  registryUrl = registryUrl.replace('https:', '')
  registryUrl = registryUrl.replace('http:', '')

  var line = registryUrl + ':_authToken='
  var fullLine = line + '${' + tokenEnvName + '}'

  return {
    test: line,
    token: fullLine
  }
}

module.exports = formAuthToken
