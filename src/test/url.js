gt.module('isUrl');

var isUrl = require('../url');

gt.test('basics', function () {
    gt.arity(isUrl, 1);
});

gt.test('isUrl positive', function () {
    var urls = [
        'https://github.com/bahmutov/qunit-promises.git#0.0.7',
        'git://github.com/bahmutov/qunit-promises.git',
        'http://github.com/bahmutov/qunit-promises.git#latest'
    ];
    urls.forEach(function (url) {
        gt.ok(isUrl(url), url);
    });
});

gt.test('isUrl negative', function () {
    var notUrls = ['latest', '0.1.0', '*', '~0.2.1'];
    notUrls.forEach(function (notUrl) {
        gt.ok(!isUrl(notUrl), notUrl);
    });
});
