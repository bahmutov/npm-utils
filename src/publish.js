'use strict'

var la = require('lazy-ass')
var is = require('check-more-types')
var run = require('./npm-test')
var debug = require('debug')('npm-utils')
var q = require('q')

la(is.fn(run), 'expected function')

function publish (options) {
  options = options || {}
  var command = 'npm publish'
  if (is.unemptyString(options.tag)) {
    debug('publishing with a tag', options.tag)
    command += ' --tag ' + options.tag
  }

  if (is.unemptyString(options.access)) {
    debug('publishing with specific access', options.access)
    command += ' --access ' + options.access
  }

  return run(command)
    .catch(function (info) {
      debug('publishing hit an error')
      debug(info)
      la(is.string(info.testErrors), 'missing test errors string', info)
      return q.reject(new Error(info.testErrors))
    })
}

module.exports = publish

if (!module.parent) {
  console.log('running a test - publishing under tag example')
  publish({ tag: 'example' })
    .catch(console.error.bind(console))
    .done()
}
