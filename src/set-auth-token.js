'use strict';

var la = require('lazy-ass');
var is = require('check-more-types');

var registryUrl = require('./registry-url');
la(is.fn(registryUrl), 'expected registry url');

var userHome = require('user-home');
var join = require('path').join;
var npmrcFile = join(userHome, '.npmrc');
var fs = require('fs');
var formUrlToken = require('./form-auth-token');

function updateNpmrc (data) {
  var contents = '';
  if (fs.existsSync(npmrcFile)) {
    contents = fs.readFileSync(npmrcFile, 'utf-8') + '\n';
  }
  if (contents.indexOf(data.token) !== -1) {
    console.log('npmrc file already has contents to add, skipping');
    return;
  }
  if (contents.indexOf(data.test) !== -1) {
    console.error('npmrc file already has auth token for registry');
    console.error(data.test);
    throw new Error('Auth token for registry exists ' + data.test);
  }
  contents += data.token;
  fs.writeFileSync(npmrcFile, contents, 'utf-8');
  console.log('saved', npmrcFile);
}

function setAuthToken () {
  return registryUrl()
    .then(formUrlToken)
    .then(updateNpmrc);
}

module.exports = setAuthToken;

if (!module.parent) {
  setAuthToken()
    .catch(console.error.bind(console));
}
