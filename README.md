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
registryUrl(); // returns a promise
// same as `npm config get registry` - which only uses
// .npmrc in the CURRENT folder (if there is .npmrc file)
```

```js
publish({ tag: '...'});
// the tag is optional
```

## Small print

Author: Gleb Bahmutov @ 2013 @bahmutov

License: MIT - do anything with the code, but don't blame me if it does not work.

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)

[nodei.co]: https://nodei.co/npm/npm-utils.png?downloads=true
[npm-url]: https://npmjs.org/package/npm-utils
[npm-utils-ci-image]: https://secure.travis-ci.org/bahmutov/npm-utils.png?branch=master
[npm-utils-ci-url]: http://travis-ci.org/#!/bahmutov/npm-utils
[dependencies-image]: https://david-dm.org/bahmutov/npm-utils.png
[dependencies-url]: https://david-dm.org/bahmutov/npm-utils
[devDependencies-image]: https://david-dm.org/bahmutov/npm-utils/dev-status.png
[devDependencies-url]: https://david-dm.org/bahmutov/npm-utils#info=devDependencies
[endorse-image]: https://api.coderwall.com/bahmutov/endorsecount.png
[endorse-url]: https://coderwall.com/bahmutov
[codacy-image]: https://api.codacy.com/project/badge/grade/80f4a9c1aad545fa8aeb090d66a3a7d2
[codacy-url]: https://www.codacy.com/app/glebbahmutov_2600/npm-utils
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
