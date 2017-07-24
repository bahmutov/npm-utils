'use strict'

var registryUrl = require('registry-url')
var fs = require('fs')
var q = require('q')
var formUrlToken = require('./form-auth-token')
var getPackage = require('./get-package')
var localOrHomeNpmrc = require('local-or-home-npmrc')
var debug = require('debug')('npm-utils')

function updateNpmrc (data) {
  var contents = ''

  var npmrcFile = localOrHomeNpmrc()
  if (fs.existsSync(npmrcFile)) {
    debug('using file:', npmrcFile)
    contents = fs.readFileSync(npmrcFile, 'utf-8')
    contents = contents.trim() + '\n'
  }
  if (contents.indexOf(data.token) !== -1) {
    console.log('npmrc file already has contents to add, skipping')
    return
  }
  if (contents.indexOf(data.test) !== -1) {
    console.error('npmrc file already has auth token for registry')
    console.error(data.test)
    throw new Error('Auth token for registry exists ' + data.test)
  }
  contents += data.token + '\n'
  fs.writeFileSync(npmrcFile, contents, 'utf-8')
  console.log('saved', npmrcFile)
}

function setAuthToken () {
  var deferred = q.defer()

  var cwd = process.cwd()
  var packageContents = getPackage(cwd)
  var packageName = packageContents.name
  debug('package %s in folder %s', packageName, cwd)

  // If set, prefer the value of the `packageConfig.registry` property over the value of the registry as set
  // in the user's `.npmrc` file.
  // In one scenario, a package may fetch its dependencies from a virtual registry that is an overlay of a private
  // registry over the public npm registry. Yet, that package is configured to publish directly to the private registry
  // URL. To account for this scenario we need to get the value of the private registry URL and configure it within
  // the `.npmrc` file.
  var registry
  if (packageContents.publishConfig && packageContents.publishConfig.registry) {
    registry = packageContents.publishConfig.registry
  } else {
    var scope = packageName.split('/')[0]
    registry = registryUrl(scope)
  }

  console.log('setting auth token for registry', registry)

  var data = formUrlToken(registry)
  updateNpmrc(data)

  deferred.resolve()
  return deferred.promise
}

module.exports = setAuthToken

if (!module.parent) {
  setAuthToken()
    .catch(console.error.bind(console))
}
