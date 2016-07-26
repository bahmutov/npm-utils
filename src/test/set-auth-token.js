var check = require('check-more-types');
var fs = require('fs');
var path = require('path');
var proxyquire = require('proxyquire');
var temp = require('temp');

temp.track();

var npmToken;

gt.async('sets the authentication token on default registry', function () {
  temp.mkdir('npm-utils', function(err, dirPath) {
    var customRegistry = 'https://npm.example.com/';
    var setAuthToken = proxyquire('../set-auth-token', {
      'user-home': dirPath
    });
    console.log(setAuthToken);

    npmToken = process.env.NPM_TOKEN;
    process.env.NPM_TOKEN = '1234';

    var originalDir = process.cwd();
    process.chdir(dirPath);

    var npmrcPath = path.join(dirPath, '.npmrc');
    var packagePath = path.join(dirPath, 'package.json');

    fs.writeFileSync(npmrcPath, '@myco:registry=' + customRegistry, { encoding: 'utf8' });
    fs.writeFileSync(packagePath, '{ "name": "@myco/test-package" }', { encoding: 'utf8' });

    setAuthToken()
      .then(function() {
        var npmrcContents = fs.readFileSync(npmrcPath, 'utf8');

        console.log(npmrcContents);
      })
      .finally(function() {
        process.chdir(originalDir);
        process.env.NPM_TOKEN = npmToken;
        gt.start();
      })
    ;
  });
});
