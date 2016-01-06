gt.module('npm pack');
var pack = require('../pack');
var fs = require('fs');

gt.async('pack folder', function () {
  gt.func(pack, 'install is a function');
  var folder = __dirname + '/../..';
  pack(folder).then(function (filename) {
    gt.string(filename, 'expected tar filename');
    gt.ok(fs.existsSync(filename), 'cannot find file ' + filename);
    fs.unlinkSync(filename);
  })
  .finally(gt.start)
  .done();
});
