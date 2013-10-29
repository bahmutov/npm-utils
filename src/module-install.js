var check = require('check-types');
var spawn = require('child_process').spawn;
var q = require('q');
var NPM_PATH = require('./npm-path');

function promiseToInstall(opts) {
  var name = opts.name;
  check.verify.string(name, 'expected module name string');

  var moduleVersion = name;
  if (opts.version) {
    check.verify.string(opts.version, 'expected version string');
    moduleVersion = moduleVersion + '@' + opts.version;
  }
  console.log('  installing', moduleVersion);

  var args = ['install'];
  if (opts.prefix) {
    check.verify.string(opts.prefix,
      'install folder prefix should be a string, not ' + opts.prefix);
    args.push('-g');
    args.push('--prefix');
    args.push(opts.prefix);
  }
  args.push(moduleVersion);
  var npm = spawn(NPM_PATH, args);
  var output = '';
  var errors = '';

  npm.stdout.setEncoding('utf-8');
  npm.stderr.setEncoding('utf-8');

  npm.stdout.on('data', function (data) {
    output += data;
  });

  npm.stderr.on('data', function (data) {
    errors += data;
  });

  npm.on('error', function (err) {
    console.error(err);
    errors += err.toString();
  });

  var deferred = q.defer();
  npm.on('exit', function (code) {
    if (code) {
      console.error('npm returned', code);
      console.error('errors:\n' + errors);
      deferred.reject({
        code: code,
        errors: errors
      });
    } else {
      deferred.resolve(opts.passThroughData);
    }
  });
  return deferred.promise;
}

module.exports = promiseToInstall;
