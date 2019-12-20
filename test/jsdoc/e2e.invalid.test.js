const app = require('./fake-server');

/**
 * IMPORTANT! e2e.valid.test and e2e.invalid.test are in separate files because 'mock-express' package does not reset sideEffects between calls.
 */

describe('validator', () => {
	it('should throw \'swagger_validator\' error when sending invalid input payload', done => {
		const req = app.makeRequest();
		const res = app.makeResponse((err, sideEffects) => {
			if (sideEffects.json) {
				expect(sideEffects.json.error.type).toEqual('swagger_validator');
				expect(sideEffects.status).toEqual(404);
				done();
			}
		});
		app.invoke('get', '/test-invalid-input', req, res);
	});

	it('should throw \'swagger_validator\' error when sending invalid output payload', done => {
		const req = app.makeRequest();
		const res = app.makeResponse((err, sideEffects) => {
			// This is necessary because of the side Effects of the library
			if (sideEffects.json && sideEffects.json.error.type === 'swagger_validator') {
				expect(sideEffects.status).toEqual(404);
				done();
			}
		});
		app.invoke('get', '/test-invalid-output', req, res);
	});
});
