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
});
