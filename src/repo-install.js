'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const repoUrl = require('repo-url')
const npmInstall = require('./module-install')
const ggit = require('ggit')
const del = require('del')
const chdir = require('chdir-promise')

// to grab repo url for a package uses
// https://github.com/juliangruber/repo-url
function moduleRepo (name) {
  return new Promise(function (resolve, reject) {
    repoUrl(name, function (err, url) {
      if (err) {
        return reject(err)
      }
      resolve(url)
    })
  })
}

function cloneRepo (folder) {
  return function cloneUrl (url) {
    la(is.unemptyString(url), 'missing repo url', url)
    console.log('cloning url', url)
    console.log('into', folder)
    return ggit.cloneRepo({
      url: url,
      folder: folder
    })
  }
}

function repoInstall (opts) {
  la(opts && opts.name, 'missing NPM module name', opts)
  la(is.unemptyString(opts.folder), 'missing destination folder', opts)

  return moduleRepo(opts.name)
    .then(cloneRepo(opts.folder))
    .then(chdir.to.bind(null, opts.folder))
    .then(npmInstall)
    .then(chdir.back)
}

module.exports = repoInstall

if (!module.parent) {
  const folder = '/tmp/test-repo-install'
  const options = {
    name: 'lazy-ass',
    folder: folder
  }
  del.sync(folder, {force: true})
  repoInstall(options)
    .then(function () {
      console.log('install repo for module')
    }, function (err) {
      console.error('could not install repo')
      console.error(err)
    })
}
