const { RuleTester } = require('@typescript-eslint/rule-tester');
const { after } = require('mocha');
const rule = require('../lib/enforce');

RuleTester.afterAll = after;

const ruleTester = new RuleTester();

const repeatString = (str, times) => [...new Array(times + 1)].join(str);

ruleTester.run('enforce', rule, {
  valid: [
    {
      code: 'import type { a, b, c, d } from \'./test\'',
    },
    {
      code: 'import type { a, b, c, d } from \'./test\'',
      options: [6],
    },
    {
      code: 'import type { a, b, c, d } from \'./test\'',
      options: [{
        items: 6,
      }],
    },
    {
      code: 'import type {\na,\nb,\nc\n} from \'./test\'',
      options: [2],
    },
    {
      code: 'import type {\na,\nb,\nc\n} from \'./test\'',
      options: [{
        items: 2,
      }],
    },
    {
      code: 'import type { default as test, a } from \'./test\'',
    },
    {
      code: 'import type { a, b, c, d } from \'./test\'',
      options: [4, 50],
    },
    {
      code: 'import type { a, b, c, d } from \'./test\'',
      options: [{
        items: 4,
        'max-len': 50,
      }],
    },
    {
      code: `import type { ${repeatString('a', 20)} } from './test'`,
      options: [1, 50],
    },
    {
      code: `import type { ${repeatString('a', 20)} } from './test'`,
      options: [{
        items: 1,
        'max-len': 50,
      }],
    },
    {
      code: `import type {\n${repeatString('a', 25)},\n${repeatString('b', 25)}\n} from './test'`,
      options: [6, 50],
    },
    {
      code: `import type {\n${repeatString('a', 25)},\n${repeatString('b', 25)}\n} from './test'`,
      options: [{
        items: 6,
        'max-len': 50,
      }],
    },
    {
      code: 'import type { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from \'./test\'',
      options: [20, 88],
    },
    {
      code: 'import type { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from \'./test\'',
      options: [{
        items: 20,
        'max-len': 88,
      }],
    },
    {
      code: 'import type { default as test, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s } from \'./test\'',
      options: [20, 102],
    },
    {
      code: 'import type { default as test, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s } from \'./test\'',
      options: [{
        items: 20,
        'max-len': 102,
      }],
    },
    {
      code: `import type { ${repeatString('a', 512)} } from './test'`,
      options: [1],
    },
    {
      code: `import type { ${repeatString('a', 512)} } from './test'`,
      options: [{
        items: 1,
      }],
    },
    {
      code: `import type {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './${repeatString('a', 72)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: `import type { ${repeatString('a', 46)} } from './${repeatString('a', 67)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: `import type { default as ${repeatString('a', 30)}, aaa } from './${repeatString('a', 67)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: 'import type {\na,\nb\n} from \'./test\'',
      options: [{
        items: 4,
        forceSingleLine: false,
      }],
    },
    {
      code: 'import type {\ndefault as test,\na,\nb\n} from \'./test\'',
      options: [{
        semi: true,
        forceSingleLine: false,
      }],
    },
    {
      code: `import {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './${repeatString('a', 72)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: false,
        forceSingleLine: false,
      }],
    },
    {
      code: 'import {\n  type importType1,\n  type importType2,\n  importFunction,\n} from \'./src\';',
      options: [{
        items: Infinity,
        'max-len': 70,
        semi: true,
      }],
    },
    {
      code: '  import type {\n  NavigationFailure,\n  LocationAsRelativeRaw,\n  RouteLocationNormalized,\n} from \'vue-router\';',
      options: [{
        items: 3,
        'max-len': 100,
      }],
    },
    {
      code: `import React from 'react'
// leading comment
import App from './App'

/**
 * doc comment
 */
;(function iife():void {})()`,
      options: [{
        semi: false,
      }],
    },
    {
      code: `import React from 'react'
// leading comment
import App from './App'

// line comment
;(function iife():void {})()`,
      options: [{
        semi: false,
      }],
    },
    {
      code: `import {
\ta,
\tb,
\tc,
\td
\t// @ts-ignore
} from 'package-without-types'`,
      options: [{
        items: 3,
        'max-len': 50,
      }],
    },
    {
      code: `declare module '*.svg' {
  import * as React from 'react'

  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}`,
      options: [],
    },
    {
      code: 'import type { \na,\n\nb,\n\n\nc,\n\n\nd,\n\n\n\ne\n} from \'./test\';',
      options: [{
        allowBlankLines: true,
      }],
    },
    {
      code: 'import type { a,\n\n\nb } from \'./test\';',
      options: [{
        allowBlankLines: true,
      }],
    },
  ],

  invalid: [
    {
      code: 'import type {\na,\nb\n} from \'./test\'',
      output: 'import type { a, b } from \'./test\'',
      options: [4],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: 'import type {\ndefault as test,\na as apple,\nb as banana\n} from \'./test\'',
      output: 'import type { default as test, a as apple, b as banana } from \'./test\'',
      options: [3],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: 'import type {\ndefault as test,\na,\nb\n} from \'./test\'',
      output: 'import type { default as test, a, b } from \'./test\'',
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: 'import type {\ndefault as test,\na,\nb\n} from \'./test\'',
      output: 'import type { default as test, a, b } from \'./test\';',
      options: [{
        semi: true,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: 'import type { a, b, c, d } from \'./test\'',
      output: 'import type {\na,\nb,\nc,\nd\n} from \'./test\'',
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: 'import type { a, b, c, d } from \'./test\'',
      output: 'import type {\na,\nb,\nc,\nd\n} from \'./test\';',
      options: [{
        items: 1,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: 'import type { default as test, a, b } from \'./test\'',
      output: 'import type {\ndefault as test,\na,\nb\n} from \'./test\'',
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: 'import test, { a, b as banana } from \'./test\'',
      output: 'import test, {\na,\nb as banana\n} from \'./test\'',
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: 'import type { \na,\n\nb,\n\n\nc,\n\n\nd,\n\n\n\ne\n} from \'./test\'',
      output: 'import type {\na,\nb,\nc,\nd,\ne\n} from \'./test\'',
      options: [4],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: 'import type { a,\n\n\nb } from \'./test\'',
      output: 'import type {\na,\nb\n} from \'./test\'',
      options: [1],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: 'import type {\n\na,\nb\n\n\n} from \'./test\'',
      output: 'import type {\na,\nb\n} from \'./test\'',
      options: [1],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      code: 'import type {\na, b, c\n} from \'./test\'',
      output: 'import type {\na,\nb,\nc\n} from \'./test\'',
      options: [1],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      code: 'import type { getPublicStaticVoidFinalObjectExtensionFactory } from \'./test\'',
      output: 'import type {\ngetPublicStaticVoidFinalObjectExtensionFactory\n} from \'./test\'',
      options: [4, 50],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: 'import type { aaaaaaaaa, bbbbbbbbb, ccccccccc, dddddddd } from \'./test\'',
      output: 'import type {\naaaaaaaaa,\nbbbbbbbbb,\nccccccccc,\ndddddddd\n} from \'./test\'',
      options: [4, 50],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: `import {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './${repeatString('a', 72)}';`,
      output: `import { aaaaaaaaaaa, aaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaa } from './${repeatString('a', 72)}'`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: false,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: `import { aaaaaaaaaaa, aaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaa } from './${repeatString('a', 73)}';`,
      output: `import {\naaaaaaaaaaa,\naaaaaaaaaaaaaaaaaaa,\naaaaaaaaaaaaa\n} from './${repeatString('a', 73)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: 'import { type importType1, type importType2, importFunction } from \'./src\';',
      output: 'import {\ntype importType1,\ntype importType2,\nimportFunction\n} from \'./src\';',
      options: [{
        items: Infinity,
        'max-len': 70,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: 'import type {\n  NavigationFailure,\n  LocationAsRelativeRaw,\n  RouteLocationNormalized,\n} from \'vue-router\';',
      output: 'import type { NavigationFailure, LocationAsRelativeRaw, RouteLocationNormalized } from \'vue-router\';',
      options: [{
        items: 3,
        'max-len': 100,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: `import React from 'react'
// leading comment
import {a,b,c,d,e} from './App'

/**
 * doc comment
 */
;(function iife():void {})()`,
      output: `import React from 'react'
// leading comment
import {\na,\nb,\nc,\nd,\ne\n} from './App'

/**
 * doc comment
 */
;(function iife():void {})()`,
      options: [{
        semi: false,
        items: 2,
      }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: `import React from 'react'
// leading comment
import {a,b,c,d,e} from './App'

// line comment
;(function iife():void {})()`,
      output: `import React from 'react'
// leading comment
import {\na,\nb,\nc,\nd,\ne\n} from './App'

// line comment
;(function iife():void {})()`,
      options: [{
        semi: false,
        items: 2,
      }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: `import type {
a,
b,
c,
// @ts-ignore
} from 'package-without-types';`,
      output: `// @ts-ignore
import type { a, b, c } from 'package-without-types';`,
      options: [{
        items: 4,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
  ],
});
