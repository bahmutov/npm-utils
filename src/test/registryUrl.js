gt.module('npm registry');
var check = require('check-types');

var registryUrl = require('../registryUrl');

gt.asyncTest('getting npm registry url', 2, function () {
  var promise = registryUrl();
  promise.then(function (url) {
    gt.string(url, 'got npm registry url string');
    gt.ok(check.webUrl(url), 'registry url', url);
    console.log('npm url:', url);
  }, function (err) {
    gt.ok(false, 'could not get npm registry url');
  }).done(gt.start);
});
