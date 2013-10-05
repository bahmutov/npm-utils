// hack to find npm bin script reliably
function findNpmPath() {
  var os = require('os');
  var type = os.type();
  return (/windows/gi).test(type) ? 'npm.cmd' : 'npm';
}

module.exports = findNpmPath();
