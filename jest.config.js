const preset = require('@vue/cli-plugin-unit-jest/presets/typescript-and-babel/jest-preset');

module.exports = {
	...preset,
	transformIgnorePatterns: ['node_modules/(?!(mdi-vue)/)'],
	coverageReporters: ['text', 'lcovonly'],
	collectCoverageFrom: ['./src/**/*.{js,ts,tsx,vue}', '!**/node_modules/**'],
	moduleNameMapper: {
		...preset.moduleNameMapper,
		'^icons/(.*)$': '<rootDir>/node_modules/mdi-vue/$1'
	}
};
