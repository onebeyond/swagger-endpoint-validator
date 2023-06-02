const request = require('supertest');
const runServer = require('./fake-server');

describe('error propagation', () => {
	it('should propagate the error to the next error handler if propagateError is true', async () => {
		const app = await runServer({ propagateError: true });
		const myErrorHandler = jest.fn((error, _req, _res, next) => {
			next(error);
		});
		app.use(myErrorHandler);
		await request(app)
			.get('/pets?limit=0');
		expect(myErrorHandler).toHaveBeenCalled();
	});

	it('should not propagate the error to the next handler if propagateError is false', async () => {
		const app = await runServer({ propagateError: false });
		const myErrorHandler = jest.fn((error, _req, _res, next) => {
			next(error);
		});
		app.use(myErrorHandler);
		await request(app)
			.get('/pets?limit=0');
		expect(myErrorHandler).not.toHaveBeenCalled();
	});

	it('should not propagate the error to the next handler if propagateError is not defined', async () => {
		const app = await runServer();
		const myErrorHandler = jest.fn((error, _req, _res, next) => {
			next(error);
		});
		app.use(myErrorHandler);
		await request(app)
			.get('/pets?limit=0');
		expect(myErrorHandler).not.toHaveBeenCalled();
	});
});
