var fs = require('fs')
var read = fs.readFileSync
var join = require('path').join

function getPackage (folder) {
  var filename = join(folder, 'package.json')
  if (!fs.existsSync(filename)) {
    throw new Error('Cannot find package file in folder ' + folder)
  }
  return JSON.parse(read(filename, 'utf-8'))
}

module.exports = getPackage
