gt.module('npm version');

var version = require('../npm-version');

gt.asyncTest('getting npm version', 1, function () {
	var promise = version();
	promise.then(function (ver) {
		gt.string(ver, 'got npm version');
		console.log('npm version:', ver);
	}, function (err) {
		gt.ok(false, 'could not get npm version');
	}).done(gt.start);
});