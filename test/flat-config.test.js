const assert = require('node:assert');
const { describe, it } = require('mocha');
const { ESLint } = require('eslint');
const plugin = require('../lib');
const packageJson = require('../package.json');

const lint = async (code, config) => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
  });
  const [result] = await eslint.lintText(code, { filePath: 'file.js' });
  return result;
};

describe('flat config', () => {
  it('exposes plugin metadata', () => {
    assert.strictEqual(plugin.meta.name, packageJson.name);
    assert.strictEqual(plugin.meta.version, packageJson.version);
    assert.strictEqual(plugin.meta.namespace, 'import-newlines');
  });

  it('exposes the rule', () => {
    assert.strictEqual(typeof plugin.rules.enforce.create, 'function');
  });

  it('exposes the recommended config under both names', () => {
    assert.strictEqual(plugin.configs['flat/recommended'], plugin.configs.recommended);
    assert.strictEqual(plugin.configs.recommended.plugins['import-newlines'], plugin);
    assert.strictEqual(plugin.configs.recommended.rules['import-newlines/enforce'], 'error');
  });

  it('works when the recommended config is used', async () => {
    const result = await lint(
      'import { a, b, c, d, e } from \'./test\';\n',
      [{ languageOptions: { sourceType: 'module' } }, plugin.configs.recommended],
    );
    assert.deepStrictEqual(result.messages.map((m) => m.messageId), ['mustSplitMany']);
  });

  it('works when the plugin is registered manually with options', async () => {
    const result = await lint(
      'import { a } from \'./test\';\n',
      [{
        languageOptions: { sourceType: 'module' },
        plugins: { 'import-newlines': plugin },
        rules: { 'import-newlines/enforce': ['error', { newlineAboveImport: 1 }] },
      }],
    );
    assert.deepStrictEqual(result.messages.map((m) => m.messageId), ['newlineAboveImport']);
    assert.strictEqual(result.output, undefined);
  });

  it('applies the newlineAboveImport fix', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      fix: true,
      overrideConfig: [{
        languageOptions: { sourceType: 'module' },
        plugins: { 'import-newlines': plugin },
        rules: { 'import-newlines/enforce': ['error', { newlineAboveImport: 2 }] },
      }],
    });
    const [result] = await eslint.lintText('import { a } from \'./test\';\n', { filePath: 'file.js' });
    assert.strictEqual(result.output, '\n\nimport { a } from \'./test\';\n');
  });

  it('rejects an invalid newlineAboveImport value', async () => {
    const result = await lint(
      'import { a } from \'./test\';\n',
      [{
        languageOptions: { sourceType: 'module' },
        plugins: { 'import-newlines': plugin },
        rules: { 'import-newlines/enforce': ['error', { newlineAboveImport: -1 }] },
      }],
    ).catch((e) => e);
    assert.ok(result instanceof Error);
  });
});
