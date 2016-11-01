var la = require('lazy-ass')
var check = require('check-more-types')
var spawn = require('child_process').spawn
var q = require('q')
var NPM_PATH = require('./npm-path')

// returns a promise
function version () {
  console.log('  npm version')
  la(check.string(NPM_PATH), 'missing npm path string')

  var npm = spawn(NPM_PATH, ['--version'])
  var output = ''
  var errors = ''

  npm.stdout.setEncoding('utf-8')
  npm.stderr.setEncoding('utf-8')

  npm.stdout.on('data', function (data) {
    output += data
  })

  npm.stderr.on('data', function (data) {
    errors += data
  })

  npm.on('error', function (err) {
    console.error(err)
    errors += err.toString()
  })

  var deferred = q.defer()
  npm.on('exit', function (code) {
    if (code) {
      console.error('npm version returned', code)
      console.error('errors:\n' + errors)
      deferred.reject({
        code: code,
        errors: errors
      })
    }
    la(check.string(output), 'could not get npm version')
    deferred.resolve(output)
  })
  return deferred.promise
}

module.exports = version
