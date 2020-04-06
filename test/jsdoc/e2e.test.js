const request = require('supertest');

const { runServer } = require('./fake-server');

let app;

describe('validation results', () => {
	beforeAll(async () => {
		app = await runServer();
	});

	describe('successful request and reponse validation', () => {
		test('should return corresponding server response (200) when GET request and response are valid', async () => {
			const res = await request(app)
				.get('/pets');
			expect(res.statusCode)
				.toEqual(200);
		});

		test('should return corresponding server response (200) when GET request query params are valid', async () => {
			const res = await request(app)
				.get('/pets?limit=10');
			expect(res.statusCode)
				.toEqual(200);
		});

		test('should return corresponding server response (200) when POST request and response are valid', async () => {
			const res = await request(app)
				.post('/pets')
				.send({ name: 'my new pet' });
			expect(res.statusCode)
				.toEqual(200);
		});
	});

	describe('unsuccessful request validation', () => {
		test('should return a bad request error (400) when GET request uses unknown query params', async () => {
			const res = await request(app)
				.get('/pets?invalidQueryParam=1');
			expect(res.statusCode)
				.toEqual(400);
			expect(res.body.message)
				.toEqual('Unknown query parameter \'invalidQueryParam\'');
		});

		// TODO: it's not possible to do query params values validation with JSDoc
		test.skip('should return a bad request error (400) when GET request query params are not valid', async () => {
			const res = await request(app)
				.get('/pets?limit=0');
			expect(res.statusCode)
				.toEqual(400);
			expect(res.body.message)
				.toEqual('request.query.limit should be >= 1');
		});

		test('should return a bad request error (400) when POST request body is not valid', async () => {
			const res = await request(app)
				.post('/pets')
				.send({});
			expect(res.statusCode)
				.toEqual(400);
			expect(res.body.message)
				.toEqual('request.body should have required property \'name\'');
		});
	});

	describe('unsuccessful response validation', () => {
		test('should return a server error (500) when GET response is not valid', async () => {
			const res = await request(app)
				.get('/pets?wrong=true');
			expect(res.statusCode)
				.toEqual(500);
			expect(res.error.status)
				.toEqual(500);
			expect(res.error.text)
				.toContain('Error: .response[0] should have required property &#39;name&#39;');
		});

		test('should return a server error (500) when POST response is not valid', async () => {
			const res = await request(app)
				.post('/pets?wrong=true')
				.send({ name: 'my new pet' });
			expect(res.statusCode)
				.toEqual(500);
			expect(res.error.status)
				.toEqual(500);
			expect(res.error.text)
				.toContain('Error: .response should have required property &#39;id&#39;');
		});
	});
});
