const enforce = require('./enforce.js');
const packageJson = require('../package.json');

const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
    namespace: 'import-newlines',
  },
  configs: {},
  rules: {
    enforce,
  },
  processors: {},
};

// Flat config (ESLint 9+) presets, usable as `importNewlines.configs.recommended`
plugin.configs.recommended = {
  name: 'import-newlines/recommended',
  plugins: {
    'import-newlines': plugin,
  },
  rules: {
    'import-newlines/enforce': 'error',
  },
};
plugin.configs['flat/recommended'] = plugin.configs.recommended;

module.exports = plugin;
