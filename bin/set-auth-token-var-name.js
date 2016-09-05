#!/usr/bin/env node

'use strict';

var envVarName = 'NPM_TOKEN';
if (!process.env[envVarName]) {
  console.error('Missing environment variable', envVarName);
  process.exit(-1);
}

var npmUtils = require('..');
npmUtils.setAuthToken()
  .then(function () {
    console.log('set .npmrc registry token to env variable', envVarName);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(-1);
  });
