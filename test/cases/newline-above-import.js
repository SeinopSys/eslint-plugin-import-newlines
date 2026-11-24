// The newlineAboveImport option: number of blank lines above the first import
const imp = 'import { a } from \'./a\';';
const opt = (n) => [{ newlineAboveImport: n }];

module.exports = {
  valid: [
    // Not set: nothing is checked, whatever is above the import
    { code: imp },
    { code: `\n\n\n${imp}` },
    { code: `// header\n\n\n\n${imp}` },
    { code: imp, options: [{ items: 4 }] },
    { code: `\n\n${imp}`, options: [{ items: 4, semi: true }] },
    { code: `\n${imp}`, options: [4, 100] },
    // Array-style options have no such option, so the top of the file is never checked
    { code: `\n\n\n${imp}`, options: [4] },
    { code: `\n\n\n${imp}`, options: [4, 100] },
    { code: `// header\n${imp}`, options: [] },
    // 0: directly at the start of the file
    { code: imp, options: opt(0) },
    { code: `${imp}\nconst b = 1;`, options: opt(0) },
    // 0 above a comment-preceded import means directly on the next line
    { code: `// header\n${imp}`, options: opt(0) },
    { code: `/* header */\n${imp}`, options: opt(0) },
    { code: `/**\n * doc\n */\n${imp}`, options: opt(0) },
    // N blank lines at the start of the file
    { code: `\n${imp}`, options: opt(1) },
    { code: `\n\n${imp}`, options: opt(2) },
    { code: `\n\n\n\n\n${imp}`, options: opt(5) },
    // N blank lines after a comment or other statement
    { code: `// header\n\n${imp}`, options: opt(1) },
    { code: `// header\n\n\n${imp}`, options: opt(2) },
    { code: `'use strict';\n\n${imp}`, options: opt(1) },
    { code: `#!/usr/bin/env node\n\n${imp}`, options: opt(1) },
    // CRLF line endings
    { code: `\r\n${imp}`, options: opt(1) },
    { code: `// header\r\n\r\n${imp}`, options: opt(1) },
    { code: `// header\r\n${imp}`, options: opt(0) },
    // Indented import is measured the same way
    { code: `\n  ${imp}`, options: opt(1) },
    // Only the first import is checked
    { code: `\n${imp}\n\n\n\nimport { b } from './b';`, options: opt(1) },
    { code: `${imp}\n\nimport { b } from './b';\nimport { c } from './c';`, options: opt(0) },
    // An import sharing a line with something before it has no "above"
    { code: 'foo();import { a } from \'./a\';', options: opt(3) },
    // Other kinds of imports
    { code: 'import \'./side-effect.css\';', options: opt(0) },
    { code: '\nimport a from \'./a\';', options: opt(1) },
    { code: '\nimport * as a from \'./a\';', options: opt(1) },
    // Files without imports are left alone
    { code: 'const a = 1;', options: opt(1) },
    { code: '', options: opt(1) },
    // Works together with the other options
    {
      code: '\nimport {\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2, newlineAboveImport: 1 }],
    },
  ],
  invalid: [
    // Too few at the start of the file
    {
      code: `${imp}`,
      output: `\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 1, actual: 0 } }],
    },
    {
      code: `${imp}`,
      output: `\n\n\n${imp}`,
      options: opt(3),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 3, actual: 0 } }],
    },
    {
      code: `\n${imp}`,
      output: `\n\n${imp}`,
      options: opt(2),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 2, actual: 1 } }],
    },
    // Too many at the start of the file
    {
      code: `\n${imp}`,
      output: imp,
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 0, actual: 1 } }],
    },
    {
      code: `\n\n\n${imp}`,
      output: imp,
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 0, actual: 3 } }],
    },
    {
      code: `\n\n\n\n${imp}`,
      output: `\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 1, actual: 4 } }],
    },
    // Whitespace only lines count as blank
    {
      code: `  \n \t\n${imp}`,
      output: imp,
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // After a comment
    {
      code: `// header\n${imp}`,
      output: `// header\n\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 1, actual: 0 } }],
    },
    {
      code: `// header\n\n\n${imp}`,
      output: `// header\n${imp}`,
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 0, actual: 2 } }],
    },
    {
      code: `/* header */\n\n${imp}`,
      output: `/* header */\n${imp}`,
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    {
      code: `/**\n * doc\n */\n\n\n\n${imp}`,
      output: `/**\n * doc\n */\n\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport', data: { expected: 1, actual: 3 } }],
    },
    {
      code: `#!/usr/bin/env node\n${imp}`,
      output: `#!/usr/bin/env node\n\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // After a directive or statement
    {
      code: `'use strict';\n${imp}`,
      output: `'use strict';\n\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // CRLF is preserved
    {
      code: `\r\n\r\n${imp}`,
      output: `\r\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    {
      code: `// header\r\n${imp}`,
      output: `// header\r\n\r\n${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // Indentation of the import is preserved
    {
      code: `\n\n  ${imp}`,
      output: `\n  ${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    {
      code: `  ${imp}`,
      output: `\n  ${imp}`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // Only the first import is reported, later ones are never touched
    {
      code: `${imp}\n\n\nimport { b } from './b';`,
      output: `\n${imp}\n\n\nimport { b } from './b';`,
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    {
      code: `\n\n${imp}\nimport { b } from './b';`,
      output: `${imp}\nimport { b } from './b';`,
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // Code between statements is not touched, only the whitespace before the import
    {
      code: 'const x = 1;\nimport { a } from \'./a\';',
      output: 'const x = 1;\n\nimport { a } from \'./a\';',
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // Other kinds of imports
    {
      code: 'import \'./side-effect.css\';',
      output: '\nimport \'./side-effect.css\';',
      options: opt(1),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    {
      code: '\n\nimport * as a from \'./a\';',
      output: 'import * as a from \'./a\';',
      options: opt(0),
      errors: [{ messageId: 'newlineAboveImport' }],
    },
    // The other checks keep working next to this option (each fixed in its own pass)
    {
      code: '\nimport { a, b, c } from \'./test\';',
      output: '\nimport {\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2, newlineAboveImport: 1 }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
  ],
};
