var check = require('check-types');
var spawn = require('child_process').spawn;
var q = require('q');
var NPM_PATH = require('./npm-path');

// returns a promise
function test(cmd) {
  var app = NPM_PATH;
  var parts = ['test'];
  check.verify.string(NPM_PATH, 'missing npm path string');

  if (check.unemptyString(cmd)) {
    parts = cmd.split(' ');
    app = cmd.shift();
  } else {
    console.log('  npm test');
  }

  var npm = spawn(app, parts);
  var testOutput = '';
  var testErrors = '';

  npm.stdout.setEncoding('utf-8');
  npm.stderr.setEncoding('utf-8');

  npm.stdout.on('data', function (data) {
    testOutput += data;
  });

  npm.stderr.on('data', function (data) {
    testErrors += data;
  });

  npm.on('error', function (err) {
    console.error(err);
    testErrors += err.toString();
  });

  var deferred = q.defer();
  npm.on('exit', function (code) {
    if (code) {
      console.error('npm test returned', code);
      console.error('test errors:\n' + testErrors);
      deferred.reject({
        code: code,
        errors: testErrors
      });
    }
    deferred.resolve();
  });
  return deferred.promise;
}

module.exports = test;
