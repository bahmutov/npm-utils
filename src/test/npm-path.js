gt.module('npm-path');

gt.test('npm path', function () {
	var npmPath = require('../npm-path');
	console.log('npm path', npmPath);
	gt.string(npmPath, 'returns a string');
	gt.ok(npmPath.length > 0, 'non empty string');
});