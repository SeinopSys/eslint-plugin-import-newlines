// Comments on their own line between import specifiers (issue #15)
module.exports = {
  valid: [
    // Legacy array-style options keep working with comments between specifiers
    {
      code: 'import {\na,\n// comment\nb,\nc\n} from \'./test\'',
      options: [2],
    },
    {
      code: 'import {\na,\n/*\n * multi-line\n */\nb,\nc\n} from \'./test\'',
      options: [2, 100],
    },
    {
      code: 'import {\na,\n// comment\nb\n} from \'./test\'',
      options: [4],
    },
    {
      // The example from the issue
      code: `import {
  BaseButton,
  Box,
  Provider,
  // here is a comment
  Typography,
  theme,
} from '...';`,
      options: [{ items: 2 }],
    },
    {
      code: 'import {\na,\n// comment\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
    },
    {
      code: 'import {\na,\n/* block comment */\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
    },
    {
      code: 'import {\na,\n/*\n * multi-line\n * block comment\n */\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
    },
    {
      code: 'import {\na,\n// one\n// two\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
    },
    {
      code: 'import {\n// before the first\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
    },
    {
      // A comment that shares a line with a specifier never counted as a line
      code: 'import {\na, // trailing\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
    },
    {
      // Comments must not be dropped by forcing the import onto a single line
      code: 'import {\na,\n// comment\nb\n} from \'./test\';',
      options: [4],
    },
    {
      // Blank lines are still allowed when asked for, with comments around
      code: 'import {\na,\n\n// comment\n\nb,\nc\n} from \'./test\';',
      options: [{ items: 2, allowBlankLines: true }],
    },
  ],
  invalid: [
    {
      code: 'import {\na,\n\n// comment\nb,\nc\n} from \'./test\'',
      output: 'import {\na,\nb,\nc\n} from \'./test\'',
      options: [2],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: 'import {\na, b,\n// comment\nc\n} from \'./test\'',
      output: 'import {\na,\nb,\nc\n} from \'./test\'',
      options: [2, 100],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      // A real blank line next to a comment is still reported
      code: 'import {\na,\n\n// comment\nb,\nc\n} from \'./test\';',
      output: 'import {\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: 'import {\na,\n// comment\n\nb,\nc\n} from \'./test\';',
      output: 'import {\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      // Too many items on one line is still fixed
      code: 'import { a, b, c } from \'./test\';',
      output: 'import {\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      // Several specifiers on one line next to a comment is still reported
      code: 'import {\na, b,\n// comment\nc\n} from \'./test\';',
      output: 'import {\na,\nb,\nc\n} from \'./test\';',
      options: [{ items: 2 }],
      errors: [{ messageId: 'limitLineCount' }],
    },
  ],
};
