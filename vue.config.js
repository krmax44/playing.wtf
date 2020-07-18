const path = require('path');

module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				icons: path.resolve(__dirname, 'node_modules/mdi-vue')
			},
			extensions: ['.vue']
		}
	}
};
