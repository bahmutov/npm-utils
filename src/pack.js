var la = require('lazy-ass');
var is = require('check-more-types');
var run = require('./npm-test');
la(is.fn(run), 'expected run function');
var glob = require('glob-promise');

function pack(options) {
  options = options || {};
  var folder = options.folder ? options.folder : '.';
  var command = 'npm pack ' + folder;
  return run(command)
    .then(function () {
      // find the generated file in the current folder
      return glob('./*.tgz')
        .then(function (filenames) {
          if (filenames.length === 1) {
            return filenames[0];
          }
          console.error('found %d archives in %s', filenames.length, folder);
        });
    });
}

module.exports = pack;

if (!module.parent) {
  console.log('running a test - packing current folder');
  pack()
    .then(function (filename) {
      console.log('packing produced file', filename);
    })
    .catch(console.error.bind(console))
    .done();
}
