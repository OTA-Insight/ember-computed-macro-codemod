'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'computed-property-macro',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
