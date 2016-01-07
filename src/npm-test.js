var la = require('lazy-ass');
var check = require('check-more-types');
var spawn = require('cross-spawn-async');
var q = require('q');
var NPM_PATH = require('./npm-path');
var debug = require('debug')('npm-utils');

function testRunner(app, parts) {
  var npm = spawn(app, parts, { stdio: 'inherit' });
  var testErrors = '';

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

  debug('spawning test process', app, parts);
  la(check.unemptyString(app), 'application name should be a string', app);
  la(check.arrayOfStrings(parts), 'arguments should be an array', parts);

  return testRunner(app, parts);
}

module.exports = test;

if (!module.parent) {
  test()
    .done();
}
