var npmUtils = require('./index');
var userHome = require('user-home');
var join = require('path').join;
var npmrcFile = join(userHome, '.npmrc');
var fs = require('fs');

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

function formUrlToken (str) {
  if (!process.env.NPM_TOKEN) {
    throw new Error('Cannot find NPM_TOKEN');
  }
  str = str.replace(/^http:/, '');
  var test = str + ':_authToken=';
  var token = test + '${NPM_TOKEN}';
  return {
    test: test,
    token: token
  };
}

function setAuthToken () {
  return npmUtils.registryUrl()
    .then(formUrlToken)
    .then(updateNpmrc);
}

module.exports = setAuthToken;

if (!module.parent) {
  setAuthToken()
    .catch(console.error.bind(console));
}
