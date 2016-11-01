var la = require('lazy-ass')
var VerEx = require('verbal-expressions')
var check = require('check-more-types')

var httpTester = new VerEx()
  .startOfLine()
  .then('http')
  .maybe('s')
  .then('://')
  .anythingBut(' ')
  .endOfLine()

var gitTester = new VerEx()
  .startOfLine()
  .then('git')
  .then('://')
  .anythingBut(' ')
  .endOfLine()

function isUrl (str) {
  la(check.string(str), 'expected a string')
  return httpTester.test(str) || gitTester.test(str)
}

module.exports = isUrl
