var check = require('check-types');
var spawn = require('child_process').spawn;
var q = require('q');
var NPM_PATH = require('./npm-path');

function promiseToRun(args, passThroughData) {
  check.verify.array(args, 'expected arguments');

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
      deferred.resolve(passThroughData);
    }
  });
  return deferred.promise;
}

function promiseToInstall(opts) {
  var name = opts.name, moduleVersion = name;
  if (name) {
    check.verify.string(name, 'expected module name string');
    if (opts.version) {
      check.verify.string(opts.version, 'expected version string');
      moduleVersion = moduleVersion + '@' + opts.version;
    }
    console.log('  installing', moduleVersion);
  } else {
    console.log('  NPM install in current folder');
  }

  var args = ['install'];
  if (opts.prefix) {
    check.verify.string(name, 'expected module name string');
    check.verify.string(opts.prefix,
      'install folder prefix should be a string, not ' + opts.prefix);
    args.push('-g');
    args.push('--prefix');
    args.push(opts.prefix);
  }
  if (moduleVersion) {
    args.push(moduleVersion);
  }

  return promiseToRun(args, opts.passThroughData);
}

module.exports = promiseToInstall;
