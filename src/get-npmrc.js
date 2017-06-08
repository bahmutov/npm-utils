var fs = require('fs')
var join = require('path').join
var parent = require('pkg-dir')
var userHome = require('user-home')

function getNpmrc () {
  var localrc = join(parent.sync(), '.npmrc')
  if (!fs.existsSync(localrc)) {
    return join(userHome, '.npmrc')
  } else if (fs.existsSync(localrc)) {
    return localrc
  }
}

module.exports = getNpmrc
