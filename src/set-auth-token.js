'use strict'

var registryUrl = require('registry-url')
var fs = require('fs')
var q = require('q')
var formUrlToken = require('./form-auth-token')
var getPackage = require('./get-package')
var npmrcFile = require('local-or-home-npmrc')
var debug = require('debug')('npm-utils')

function updateNpmrc (data) {
  var contents = ''

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

  var packageName = getPackage(process.cwd()).name
  var scope = packageName.split('/')[0]
  var registry = registryUrl(scope)
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
