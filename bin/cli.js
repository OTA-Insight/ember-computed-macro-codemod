#!/usr/bin/env node
'use strict';

require('codemod-cli').runTransform(
  __dirname,
  'computed-property-macro' /* transform name */,
  process.argv.slice(2) /* paths or globs */
);
