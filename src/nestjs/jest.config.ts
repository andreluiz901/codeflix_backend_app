export default {
	displayName: {
		name: 'nestjs',
		color: 'magentaBright',
	},
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'codeflix-backend-app/(.*)$':
			'<rootDir>../../../node_modules/codeflix-backend-app/dist/$1',
	},
};
