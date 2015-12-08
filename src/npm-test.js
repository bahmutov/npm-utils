var la = require('lazy-ass');
var check = require('check-more-types');
var spawn = require('win-spawn');
var q = require('q');
var NPM_PATH = require('./npm-path');

function testRunner(app, parts, stdoutLogger, stderrLogger) {
  var npm = spawn(app, parts, { stdio: 'inherit' });
  var testErrors = '';

  npm.stdout.setEncoding('utf-8');
  npm.stderr.setEncoding('utf-8');

  npm.stdout.on('data', function (data) {
    stdoutLogger(data);
  });

  npm.stderr.on('data', function (data) {
    stderrLogger(data);
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

// returns a promise
function test(cmd, loggers) {
  var app = NPM_PATH;
  var parts = ['test'];
  la(check.string(NPM_PATH), 'missing npm path string');

  if (check.object(cmd) && !loggers) {
    loggers = cmd;
    cmd = undefined;
  }

  var stdoutLogger = loggers && check.fn(loggers.stdout) ?
    loggers.stdout : process.stdout.write.bind(process.stdout);
  var stderrLogger = loggers && check.fn(loggers.stderr) ?
    loggers.stderr : process.stderr.write.bind(process.stderr);

  if (check.unemptyString(cmd)) {
    cmd = cmd.trim();
    parts = cmd.split(' ');
    app = parts.shift();
  }

  console.log('spawning test process', app, parts);
  la(check.unemptyString(app), 'application name should be a string', app);
  la(check.arrayOfStrings(parts), 'arguments should be an array', parts);

  return testRunner(app, parts, stdoutLogger, stderrLogger);
}

module.exports = test;

if (!module.parent) {
  console.log('running standard output');
  test()
    .then(function () {
      console.log('running custom logger');
      return test({
        stdout: function (x) {
          console.log('OUT:', x);
        },
        stderr: function (x) {
          console.log('ERR:', x);
        }
      });
    }).done();
}
