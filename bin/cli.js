#!/usr/bin/env node
'use strict';

require('codemod-cli').runTransform(
  __dirname,
  'computed-macro' /* transform name */,
  process.argv.slice(2) /* paths or globs */
);
