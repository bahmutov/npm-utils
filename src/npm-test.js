require('lazy-ass');
var check = require('check-more-types');
var spawn = require('win-spawn');
var q = require('q');
var NPM_PATH = require('./npm-path');

// returns a promise
function test(cmd) {
  var app = NPM_PATH;
  var parts = ['test'];
  la(check.string(NPM_PATH), 'missing npm path string');

  if (check.unemptyString(cmd)) {
    cmd = cmd.trim();
    parts = cmd.split(' ');
    app = parts.shift();
  }

  console.log('spawning test process', app, parts);
  la(check.unemptyString(app), 'application name should be a string', app);
  la(check.arrayOfStrings(parts), 'arguments should be an array', parts);

  var npm = spawn(app, parts);
  var testOutput = '';
  var testErrors = '';

  npm.stdout.setEncoding('utf-8');
  npm.stderr.setEncoding('utf-8');

  npm.stdout.on('data', function (data) {
    process.stdout.write(data);
    testOutput += data;
  });

  npm.stderr.on('data', function (data) {
    process.stderr.write(data);
    testErrors += data;
  });

  npm.on('error', function (err) {
    console.error(err);
    testErrors += err.toString();
  });

  var deferred = q.defer();
  npm.on('exit', function (code) {
    if (code) {
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
