const app = require('./fake-server');

/**
 * IMPORTANT! e2e.valid.test and e2e.invalid.test are in separate files because 'mock-express' package does not reset sideEffects between calls.
 */

describe('validator', () => {
	it('should return an object with \'valid: true\' when sending proper input payload', done => {
		const req = app.makeRequest();
		const res = app.makeResponse((err, sideEffects) => {
			if (sideEffects.json) {
				expect(sideEffects.status).toEqual(200);
				expect(sideEffects.json).toHaveProperty('valid', true);
				done();
			}
		});
		app.invoke('get', '/test-valid-input', req, res);
	});

	it('should return an object with \'valid: true\' when sending proper output payload', done => {
		const req = app.makeRequest();
		const res = app.makeResponse((err, sideEffects) => {
			if (sideEffects.json) {
				expect(sideEffects.status).toEqual(200);
				expect(sideEffects.json).toHaveProperty('valid', true);
				done();
			}
		});
		app.invoke('get', '/test-valid-output', req, res);
	});
});
