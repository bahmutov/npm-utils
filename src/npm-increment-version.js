var la = require('lazy-ass')
var is = require('check-more-types')
var run = require('./npm-test')
var debug = require('debug')('npm-utils')

var isIncrement = is.oneOf(['major', 'minor', 'patch'])

function npmVersion (opts) {
  la(is.object(opts), 'missing options')
  la(isIncrement(opts.increment) ||
    is.semver(opts.increment), 'invalid increment or version', opts)

  var cmd = 'npm version ' + opts.increment
  if (opts.noGit) {
    cmd += ' --no-git-tag-version'
  }
  debug('npm version command "%s"', cmd)
  return run(cmd)
}

module.exports = npmVersion

if (!module.parent) {
  npmVersion({ increment: 'patch', noGit: true })
    .catch(console.error.bind(console))
}
