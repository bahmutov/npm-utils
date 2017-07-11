const la = require('lazy-ass')
const is = require('check-more-types')
const tmp = require('tmp-sync')
const chdir = require('chdir-promise')
const execa = require('execa')

/* global describe, it */
describe('npm prune', () => {
  const prune = require('./npm-prune')

  it('is a function', () => {
    la(is.fn(install))
  })

  const hasExtraneous = text => {
    return text.indexOf('extraneous') !== -1
  }

  const expectExtraneous = () => {
    console.log('npm ls')
    return execa.shell('npm ls || true')
      .then(result => result.stdout)
      .then(stdout => {
        console.log(stdout)
        la(hasExtraneous(stdout), 'debug should be extraneous', stdout)
      })
  }

  const expectNoExtraneous = () => {
    console.log('npm ls')
    return execa.shell('npm ls')
      .then(result => result.stdout)
      .then(stdout => {
        console.log(stdout)
      })
  }

  const initPackage = () => {
    console.log('making new package')
    return execa.shell('npm init -y')
  }

  const install = name => {
    console.log('installing %s without saving', name)
    return execa.shell(`npm install ${name}`)
  }

  it('prunes in the temp folder', () => {
    const folder = tmp.in()
    console.log('prune test in folder', folder)
    return chdir.to(folder)
      .then(initPackage)
      .then(() => install('debug'))
      .then(expectExtraneous)
      .then(() => {
        console.log('npm prune')
        return prune()
      })
      .then(expectNoExtraneous)
      .then(chdir.back)
  })
})
