const enforce = require('./enforce.js');
const packageJson = require('../package.json');

module.exports = {
	meta: {
		name: packageJson.name,
		version: packageJson.version,
	},
	configs: {},
  rules: {
    enforce,
  },
	processors: {},
};
