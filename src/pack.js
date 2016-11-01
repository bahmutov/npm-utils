var la = require('lazy-ass')
var is = require('check-more-types')
var fs = require('fs')
var Q = require('q')
var run = require('./npm-test')
la(is.fn(run), 'expected run function')
var getPackage = require('./get-package')

// NPM pack generates file in the format
// <name>-<version>.tgz
function formTarballName (pkg) {
  return pkg.name + '-' + pkg.version + '.tgz'
}

function pack (options) {
  options = options || {}
  if (is.string(options)) {
    options = { folder: options }
  }
  la(is.object(options), 'expected options object for pack', options)

  var folder = options.folder ? options.folder : '.'
  var pkg = getPackage(folder)
  la(is.unemptyString(pkg.name) &&
    is.unemptyString(pkg.version), 'invalid package in folder', folder)

  var command = 'npm pack ' + folder
  return run(command)
    .then(function () {
      // find the generated file in the current folder
      var filename = formTarballName(pkg)
      if (!fs.existsSync(filename)) {
        return Q.reject(new Error('Cannot find tar file ' + filename))
      }
      return filename
    })
}

module.exports = pack

if (!module.parent) {
  console.log('running a test - packing current folder')
  pack()
    .then(function (filename) {
      console.log('packing produced file', filename)
    })
    .catch(console.error.bind(console))
    .done()
}
