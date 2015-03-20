#!/usr/bin/env node
'use strict';
var meow = require('meow');
var redirectRequests = require('./');

var cli = meow({
  help: [
    'Usage',
    '  redirect-requests <input>',
    '',
    'Example',
    '  redirect-requests Unicorn'
  ].join('\n')
});

redirectRequests(cli.input[0]);
