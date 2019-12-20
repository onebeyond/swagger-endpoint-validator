const MockExpress = require('mock-express');
const validator = require('../..');

const app = MockExpress(); // notice there's no "new"

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

validator.init(app, validatorOptions, 'yaml');

/**
 * @swagger
 * /test-invalid-input:
 *   post:
 *     description: Test POST /test-invalid-input
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input payload
 *         required: true
 *         type: object
 *         schema:
 *         - $ref: '#/definitions/Input'
 *     responses:
 *       200:
 *         description: successful operation
 */
app.post('/test-invalid-input', (req, res) => {
	try {
		const result = validator.validateAPIInput({}, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

/**
 * @swagger
 * /test-invalid-output:
 *   get:
 *     description: Test GET /test-invalid-output
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/Output'
 */
app.get('/test-invalid-output', (req, res) => {
	try {
		const result = validator.validateAPIOutput({}, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

/**
 * @swagger
 * /test-invalid-output-2:
 *   get:
 *     description: Test GET /test-invalid-output-2
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/Output'
 */
app.get('/test-invalid-output-2', (req, res) => {
	const invalidOutputModel = { name: 'Name is required', result: 'Valid result', extra: 'no extra fields' };

	try {
		const result = validator.validateAPIOutput(invalidOutputModel, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

/**
 * @swagger
 * /test-valid-input:
 *   post:
 *     description: Test POST /test-valid-input
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input payload
 *         required: true
 *         type: object
 *         schema:
 *         - $ref: '#/definitions/Input'
 *     responses:
 *       200:
 *         description: successful operation
 */
app.post('/test-valid-input', (req, res) => {
	const validInputModel = { name: 'Name is required' };

	try {
		const result = validator.validateAPIInput(validInputModel, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

/**
 * @swagger
 * /test-valid-output:
 *   get:
 *     description: Test GET /test-valid-output
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/Output'
 */
app.get('/test-valid-output', (req, res) => {
	const validOutputModel = { name: 'Name is required', result: 'Valid result' };

	try {
		const result = validator.validateAPIOutput(validOutputModel, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

module.exports = app;
