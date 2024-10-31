export default {
	displayName: {
		name: 'nestjs',
		color: 'magentaBright',
	},
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\..*spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'codeflix-backend-app/(.*)$':
			'<rootDir>../../../node_modules/codeflix-backend-app/dist/$1',
		'#seedwork/domain':
			'<rootDir>/../../../node_modules/codeflix-backend-app/dist/@seedwork/domain/index.js',
		//'#seedwork/(.*)$': `<rootDir>/../../../node_modules/codeflix-backend-app/dist/@seedwork/$1`,
		'#category/domain':
			'<rootDir>/../../../node_modules/codeflix-backend-app/dist/category/domain/index.js',
		//'#category/(.*)$': `<rootDir>/../../../node_modules/codeflix-backend-app/dist/category/$1`,
	},
	setupFilesAfterEnv: [
		'../../@core/src/@seedwork/domain/tests/validations.ts',
		'../../@core/src/@seedwork/domain/tests/jest.ts',
	],
};
