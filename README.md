# npm-utils

Async NPM shell commands: install, test, etc.

[![NPM info][nodei.co]][npm-url]

[![Build][npm-utils-ci-image]][npm-utils-ci-url]
[![dependencies][dependencies-image]][dependencies-url]
[![devDependencies][devDependencies-image]][devDependencies-url]
[![endorse][endorse-image]][endorse-url]

[![Codacy Badge][codacy-image]][codacy-url]
[![semantic-release][semantic-image] ][semantic-url]
[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)

## Use

```js
var npmUtils = require('npm-utils');
npmUtils.version()
  .then(function (semver) {
    console.log('NPM version %s', semver);
  });
```

## API

```js
path() // returns immediately path to npm command
```

```js
install({
  name: string,
  version: string (optional),
  prefix: string (optional), // folder path prefix
  passThroughData: obj (optional),
  registry: string (optional) // registry url,
  flags: ['--save', '--verbose'] // list of command line flags to pass to NPM
})

returns a promise
```

Note: the `name` could be another folder or a tar archive; passed to `npm install <name>`
unchanged, that can be any match. See `npm help install`

```js
version() // returns a promise, resolved with NPM version string
```

```js
test() // spawns npm test command
test('grunt test'); // spawns new command "grunt test"
```

The child test process will inherit output streams from the parent.

```js
registryUrl(); 
// returns a promise resolved with result of https://github.com/sindresorhus/registry-url
// pass scope for specific registry
registryUrl('@myCo')
  .then(url => ...)
```

```js
publish({ tag: '...'});
// the tag is optional
```

### getPackage

Loads `package.json` from a given folder

```js
var pkg = npm.getPackage(folder);
console.log('%s version %s', pkg.name, pkg.version);
```

### pack

Runs `npm pack <folder name>` command. Resolves with the name of the generated tarball file.

```js
pack({ folder: 'path/to/folder' })
```

If folder is not provided, uses the current one

### setAuthToken

Please execute the `npm login` first!

```js
setAuthToken()
    .then(canPublishNow, onError)
```

Updates the `~/.npmrc` file that can be used by CI servers to publish to NPM.
The file will have the following line added (only the actual registry url will be used)

    //registry.npmjs.org/:_authToken=${NPM_TOKEN}

Read the [Deploying with npm private modules][deploying post] for details, see
project [ci-publish](https://github.com/bahmutov/ci-publish) for example how this could be
used to release from CI after successful tests.

[deploying post]: http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules

Often the source of errors is that the environment does not have `NPM_TOKEN` set,
or the `.npmrc` file already has the authToken entry for this registry. For example,
when running locally

    $ NPM_TOKEN=foo node src/set-auth-token.js 
    npmrc file already has auth token for registry
    //registry.npmjs.org/:_authToken=
    [Error: Auth token for registry exists //registry.npmjs.org/:_authToken=]

### increment version

Runs `npm version [major | minor | patch]` command.

```js
incrementVersion({
  increment: 'major|minor|patch',
  noGit: true // default false = Git commit happens
})
```

See `npm help version` - but we only support increments, not absolute values.

## Troubleshooting

Run the command with `DEBUG=npm-utils` environment variable set, this package
uses [debug](https://www.npmjs.com/package/debug)

## Small print

Author: Gleb Bahmutov @ 2013 @bahmutov

License: MIT - do anything with the code, but don't blame me if it does not work.

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)

[nodei.co]: https://nodei.co/npm/npm-utils.svg?downloads=true
[npm-url]: https://npmjs.org/package/npm-utils
[npm-utils-ci-image]: https://secure.travis-ci.org/bahmutov/npm-utils.svg?branch=master
[npm-utils-ci-url]: http://travis-ci.org/#!/bahmutov/npm-utils
[dependencies-image]: https://david-dm.org/bahmutov/npm-utils.svg
[dependencies-url]: https://david-dm.org/bahmutov/npm-utils
[devDependencies-image]: https://david-dm.org/bahmutov/npm-utils/dev-status.svg
[devDependencies-url]: https://david-dm.org/bahmutov/npm-utils#info=devDependencies
[endorse-image]: https://api.coderwall.com/bahmutov/endorsecount.png
[endorse-url]: https://coderwall.com/bahmutov
[codacy-image]: https://api.codacy.com/project/badge/grade/80f4a9c1aad545fa8aeb090d66a3a7d2
[codacy-url]: https://www.codacy.com/app/glebbahmutov_2600/npm-utils
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
