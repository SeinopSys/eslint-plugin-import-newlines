const { RuleTester } = require('eslint');
const rule = require('../lib/enforce');
const cases = require('./cases/vanilla');

const ruleTester = new RuleTester();

ruleTester.run('enforce', rule, cases);
