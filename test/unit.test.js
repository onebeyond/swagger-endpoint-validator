const initValidator = require('..'); // diferent instance

describe('init method', () => {
	it('should return an exeception when we don\'t send options or the app instance', () => {
		expect(() => {
			initValidator.init();
		}).toThrow();
	});

	it('should return an exeception when we don\'t send params to validateAPIInput', () => {
		expect(() => {
			initValidator.validateAPIInput();
		}).toThrow();
	});

	it('should return an exeception when we don\'t send params to validateAPIInput', () => {
		expect(() => {
			initValidator.validateAPIOutput();
		}).toThrow();
	});
});
