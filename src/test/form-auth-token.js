'use strict';

var la = require('lazy-ass');
var is = require('check-more-types');

gt.module('form aut token');

var form = require('../form-auth-token');

gt.test('handles http url', function () {
    var registryUrl = 'http://registry.npmjs.org/';
    var result = form(registryUrl, 'FOO');
    la(is.object(result), result);
    la(is.unemptyString(result.token), result);
    var str = result.token;
    la(/FOO/.test(str), str);
    la(!/http:/.test(str), 'should not have http part', str);
});

gt.test('handles https url', function () {
    var registryUrl = 'https://registry.npmjs.org/';
    var result = form(registryUrl, 'FOO');
    la(is.object(result), result);
    la(is.unemptyString(result.token), result);

    var str = result.token;
    la(/FOO/.test(str), str);
    la(!/https:/.test(str), 'should not have https part', str);
});
