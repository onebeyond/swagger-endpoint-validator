const MockExpress = require('mock-express');
const validator = require('..');

const app = MockExpress(); // notice there's no "new"

const validatorOptions = {
	swaggerDefinition: {
		info: {
			description: 'Documentation for Service HE API',
			title: 'Service API',
			version: '1.0.0',
			contact: { email: 'kevin.martinez@guidesmiths.com' },
		},
		// host: process.env.SERVICE_HOST || 'localhost:4000',
		host: 'localhost:5000',
		basePath: '/',
		produces: ['application/json'],
		schemes: ['http'],
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: '',
			},
		},
	},
	basedir: process.cwd(), // app absolute path
	// files: ['./components/routes/**-routes.js', './components/routes/api/**-routes.js'], // path to the API handle folder, related to basedir
	files: ['./test/**/**.js'], // path to the API handle folder, related to basedir
	route: {
		url: '/test/docs/api',
		docs: '/test/docs/api.json',
	},
};

validator.init(app, validatorOptions);

/**
 * @route GET /test-invalid-output
 * @summary Test invalid output
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} 404 - Error message
 */
app.get('/test-invalid-input', (req, res) => {
	try {
		const result = validator.validateAPIInput({}, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

/**
 * @route GET /test-invalid-output
 * @summary Test invalid output
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} 404 - Error message
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
 * @route GET /test-valid-input
 * @summary Test valid input
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} 404 - Error message
 */
app.get('/test-valid-input', (req, res) => {
	const validInputModel = { name: 'Name is required' };

	try {
		const result = validator.validateAPIInput(validInputModel, req);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error });
	}
});

/**
 * @route GET /test-valid-output
 * @summary Test valid endpoint
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} 404 - Error message
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
