// Runs the same cases as enforce-vanilla.test.js using Oxlint's rule tester, to make sure the rule
// keeps working when loaded as an Oxlint JS plugin.
const { RuleTester } = require('oxlint/plugins-dev');
const { describe, it } = require('mocha');
const rule = require('../lib/enforce');
const cases = require('./cases/vanilla');

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester();

ruleTester.run('enforce', rule, cases);
