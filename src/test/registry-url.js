var check = require('check-more-types');
var fs = require('fs');
var path = require('path');
var registryUrl = require('registry-url');
var temp = require('temp');

temp.track();

gt.module('registry-url');

gt.async('registry-url returns a URL from .npmrc file', function () {
  temp.mkdir('npm-utils', function(err, dirPath) {
    var customRegistry = 'https://npm.example.com/';

    var originalDir = process.cwd();
    process.chdir(dirPath);

    var npmrcPath = path.join(dirPath, '.npmrc');
    fs.writeFile(npmrcPath, 'registry=' + customRegistry, function () {
      var url = registryUrl();

      gt.ok(check.webUrl(url), 'registry url is a url', url);
      gt.ok(check.same(url, customRegistry), 'registry url is same as .npmrc file', url);

      process.chdir(originalDir);
      gt.start();
    });
  });
});
