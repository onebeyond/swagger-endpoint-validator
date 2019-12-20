const MockExpress = require('mock-express');

const validator = require('../..'); // diferent instance

describe('init method', () => {
	it('should return an exeception when we don\'t send options or the app instance', () => {
		expect(() => {
			validator.init();
		}).toThrow();
	});

	it('should return an exeception when we don\'t send params to validateAPIInput', () => {
		expect(() => {
			validator.validateAPIInput();
		}).toThrow();
	});

	it('should return an exeception when we don\'t send params to validateAPIOutput', () => {
		expect(() => {
			validator.validateAPIOutput();
		}).toThrow();
	});

	it('should return an exception when initializing validator with unrecognized format', () => {
		expect(() => {
			const app = MockExpress();

			const validatorOptions = {
				swaggerDefinition: {
					info: {
						// API informations (required)
						title: 'Hello World', // Title (required)
						version: '1.0.0', // Version (required)
						description: 'A sample API', // Description (optional)
					},
					basePath: process.cwd(),
				},
				apis: ['./test/yaml/**.js'],
			};

			validator.init(app, validatorOptions, 'wrong-format');
		}).toThrow();
	});
});
