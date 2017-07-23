var fs = require('fs')
var path = require('path')
var proxyquire = require('proxyquire')
var temp = require('temp')
const chdir = require('chdir-promise')
const la = require('lazy-ass')

temp.track()

var npmToken

/* global describe, beforeEach, it, afterEach */
describe('set auth token', () => {
  let setAuthToken
  let dirPath

  beforeEach((done) => {
    temp.mkdir('npm-utils', function (err, tempFolder) {
      if (err) {
        throw err
      }
      dirPath = tempFolder
      console.log('temp folder', dirPath)

      setAuthToken = proxyquire('./set-auth-token', {
        'user-home': dirPath
      })
      console.log(setAuthToken)

      npmToken = process.env.NPM_TOKEN
      process.env.NPM_TOKEN = '1234'

      chdir.to(dirPath).then(() => {
        console.log('current folder', process.cwd())
        done()
      })
    })
  })

  afterEach((done) => {
    process.env.NPM_TOKEN = npmToken
    chdir.back().then(() => done())
  })

  it('sets the authentication token on default registry', function () {
    var customRegistry = 'https://npm.example.com/'
    var npmrcPath = path.join(dirPath, '.npmrc')
    var packagePath = path.join(dirPath, 'package.json')

    fs.writeFileSync(npmrcPath, '@myco:registry=' + customRegistry, { encoding: 'utf8' })
    fs.writeFileSync(packagePath, '{ "name": "@myco/test-package" }', { encoding: 'utf8' })

    return setAuthToken()
      .then(function () {
        var npmrcContents = fs.readFileSync(npmrcPath, 'utf8')
        console.log(npmrcContents)
        la(npmrcContents.includes('//npm.example.com/:_authToken='))
      })
  })

  it('sets the authentication token based on publishConfig URL', function () {
    var customRegistry = 'https://npm.example.com/'
    var npmrcPath = path.join(dirPath, '.npmrc')
    var packagePath = path.join(dirPath, 'package.json')

    fs.writeFileSync(npmrcPath, '@myco:registry=' + customRegistry, { encoding: 'utf8' })
    fs.writeFileSync(packagePath, '{ "name": "@myco/test-package", "publishConfig": { "registry": "https://private.example.com/" } }', { encoding: 'utf8' })

    return setAuthToken()
      .then(function () {
        var npmrcContents = fs.readFileSync(npmrcPath, 'utf8')
        console.log(npmrcContents)
        la(npmrcContents.includes('//private.example.com/:_authToken='))
      })
  })
})

