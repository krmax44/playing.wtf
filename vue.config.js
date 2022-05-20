const path = require('path');

module.exports = {
	publicPath: '/playing.wtf/',
	configureWebpack: {
		resolve: {
			alias: {
				icons: path.resolve(__dirname, 'node_modules/mdi-vue')
			},
			extensions: ['.vue']
		}
	}
};
