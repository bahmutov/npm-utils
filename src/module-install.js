'use strict'

var la = require('lazy-ass')
var check = require('check-more-types')
var spawn = require('child_process').spawn
var q = require('q')
var NPM_PATH = require('./npm-path')
var debug = require('debug')('npm-utils')

function promiseToRun (args, passThroughData) {
  check.verify.array(args, 'expected arguments')
  debug('module install with args:', args)

  var npm = spawn(NPM_PATH, args)
  var errors = ''

  npm.stdout.setEncoding('utf-8')
  npm.stderr.setEncoding('utf-8')

  npm.stdout.on('data', function (data) {
    process.stdout.write(data)
  })

  npm.stderr.on('data', function (data) {
    errors += data
    process.stderr.write(data)
  })

  npm.on('error', function (err) {
    console.error(err)
    errors += err.toString()
  })

  var deferred = q.defer()
  npm.on('exit', function (code) {
    if (code) {
      console.error('npm returned', code)
      console.error('errors:\n' + errors)
      deferred.reject({
        code: code,
        errors: errors
      })
    } else {
      deferred.resolve(passThroughData)
    }
  })
  return deferred.promise
}

function formArguments (opts, name, moduleVersion) {
  var args = ['install']
  if (opts.prefix) {
    check.verify.string(name, 'expected module name string')
    check.verify.string(opts.prefix,
      'install folder prefix should be a string, not ' + opts.prefix)
    args.push('-g')
    args.push('--prefix')
    args.push(opts.prefix)
  }
  if (opts.registry) {
    la(check.string(opts.registry), 'expected registry url string', opts)
    args.push('--registry')
    args.push(opts.registry)
  }
  if (moduleVersion) {
    args.push(moduleVersion)
  }
  if (check.array(opts.flags)) {
    args = args.concat(opts.flags)
  }
  return args
}

function promiseToInstall (opts) {
  opts = opts || {}
  var name = opts.name
  var moduleVersion = name
  if (name) {
    check.verify.string(name, 'expected module name string')
    if (opts.version) {
      check.verify.string(opts.version, 'expected version string')
      moduleVersion = moduleVersion + '@' + opts.version
    }
    console.log('  installing', moduleVersion)
  } else {
    console.log('  NPM install in current folder')
  }

  var args = formArguments(opts, name, moduleVersion)
  return promiseToRun(args, opts.passThroughData)
}

module.exports = promiseToInstall
