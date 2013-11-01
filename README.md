# npm-utils

Async NPM shell commands: install, test, etc.

[![NPM info][nodei.co]][npm-url]

[![Build][npm-utils-ci-image]][npm-utils-ci-url]
[![dependencies][dependencies-image]][dependencies-url]
[![devDependencies][devDependencies-image]][devDependencies-url]
[![endorse][endorse-image]][endorse-url]

## API

```javascript
path() // returns immediately path to npm command
```

```javascript
install({
	name: string,
	version: string (optional),
	prefix: string (optional), // folder path prefix
	passThroughData: obj (optional)
})

returns a promise
```

```javascript
version() // returns a promise, resolved with version string
```

```javascript
test() // spawns npm test command
```

```javascript
registryUrl(); // returns a promise
// same as `npm config get registry`
```

## Small print

Author: Gleb Bahmutov @ 2013 @bahmutov

License: MIT - do anything with the code, but don't blame me if it does not work.

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
