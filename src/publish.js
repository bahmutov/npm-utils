var la = require('lazy-ass');
var is = require('check-more-types');
var run = require('./npm-test');
la(is.fn(run), 'expected function');

function publish(options) {
  options = options || {};
  var command = 'npm publish';
  if (is.unemptyString(options.tag)) {
    command += ' --tag ' + options.tag;
  }
  return run(command);
}

module.exports = publish;

if (!module.parent) {
  console.log('running a test - publishing under tag example');
  publish({ tag: 'example' })
    .catch(console.error.bind(console))
    .done();
}
