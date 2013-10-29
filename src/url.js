var VerEx = require('verbal-expressions');
var check = require('check-types');

var httpTester = new VerEx()
  .startOfLine()
  .then('http')
  .maybe('s')
  .then('://')
  .anythingBut(' ')
  .endOfLine();

var gitTester = new VerEx()
  .startOfLine()
  .then('git')
  .then('://')
  .anythingBut(' ')
  .endOfLine();

function isUrl(str) {
  check.verify.string(str, 'expected a string');
  return httpTester.test(str) || gitTester.test(str);
}

module.exports = isUrl;
