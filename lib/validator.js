const debug = require('debug')('swagger-endpoint-validator:validator');
const { OpenApiValidator } = require('express-openapi-validator');
const Enforcer = require('openapi-enforcer');

const errorFactory = require('./errors');

const SwaggerValidatorError = errorFactory('swagger_validator');

let openAPISpec = null;

/**
 * Initializes the OpenAPI validator.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration options.
 * @param {Object} openAPISpec - OpenAPI specification, extracted from the documentation.
 * @see https://github.com/cdimascio/express-openapi-validator
 */
const init = async (app, options, spec) => {
	debug('Initializing OpenAPI validator...');

	await new OpenApiValidator({
		apiSpec: spec,
		validateRequests: options.validateRequests || true,
		validateResponses: options.validateResponses || true,
	}).install(app);

	debug('OpenAPI validator initialized!');

	debug('Dereferencing and validating your OpenAPI document...');

	openAPISpec = await Enforcer(spec);

	debug('Your OpenAPI document is valid!');
};

/**
 * Validates an object using an schema inside the OpenAPI specification.
 * @param {Object} body - Information to do the validation.
 * @param {string} body.endpoint - path to be validated.
 * @param {object} body.fixture - data to be validated against the schema.
 * @param {boolean} [body.input=false] - true to validate the request schema and false to validate the response schema.
 * @param {string} body.method - method inside the path to be validated.
 */
const validateSchema = body => {
	if (!openAPISpec) {
		throw SwaggerValidatorError('You need to initialize the validator first!');
	}

	debug('Validating data againt schema...');

	const {
		endpoint,
		fixture,
		input,
		method,
	} = body;

	let result;
	if (input) {
		result = openAPISpec.request({
			method,
			path: endpoint,
			body: fixture,
		});
	} else {
		const path = openAPISpec.paths[endpoint];
		if (!path) {
			throw SwaggerValidatorError(`Path ${endpoint} not found in the specification`);
		}
		const operation = path[method];
		if (!operation) {
			throw SwaggerValidatorError(`Method ${method} for path ${endpoint} not found in the specification`);
		}
		result = operation.response(200, fixture);
	}

	debug(`Validation result: ${JSON.stringify(result)}`);
	return result;
};

module.exports = {
	init,
	validateSchema,
};
