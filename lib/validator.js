const debug = require('debug')('swagger-endpoint-validator:validator');
const { OpenApiValidator } = require('express-openapi-validator');

const errorFactory = require('./errors');

const SwaggerValidatorError = errorFactory('swagger_validator');

let openAPISpec = null;

/**
 * Initializes the OpenAPI validator.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration options.
 * @param {Object} spec - OpenAPI specification, extracted from the documentation.
 * @param {Object} spec.doc - JSON object describing the extracted OpenAPI specification.
 * @param {Object} spec.openapi - OpenAPI specification extracted from openapi-enforcer.
 * @see https://github.com/cdimascio/express-openapi-validator
 */
const init = async (app, options, spec) => {
	debug('Initializing OpenAPI validator...');

	await new OpenApiValidator({
		apiSpec: spec.doc,
		validateRequests: options.validateRequests,
		validateResponses: options.validateResponses,
		validateFormats: options.validateFormats,
		ignorePaths: options.validationEndpoint ? new RegExp(`.*${options.validationEndpoint}$`, 'i') : null,
	}).install(app);

	openAPISpec = spec.openapi;

	debug('OpenAPI validator initialized!');
};

/**
 * Validates an object using an schema inside the OpenAPI specification.
 * @param {Object} body - Information to do the validation.
 * @param {string} body.endpoint - path to be validated.
 * @param {object} body.fixture - data to be validated against the schema.
 * @param {string} body.method - method inside the path to be validated.
 * @param {boolean} [body.input=false] - true to validate the request schema and false to validate the response schema.
 */
const validateSchema = body => {
	if (!openAPISpec) {
		throw SwaggerValidatorError('You need to initialize the validator first!');
	}

	debug('Validating data againt schema...');

	const {
		endpoint,
		fixture,
		request,
		method,
	} = body;

	if (!endpoint) {
		throw SwaggerValidatorError('Required \'endpoint\' missing in requestBody', 400);
	}
	if (!method) {
		throw SwaggerValidatorError('Required \'method\' missing in requestBody', 400);
	}
	if (!fixture) {
		throw SwaggerValidatorError('Required \'fixture\' missing in requestBody', 400);
	}

	let result;
	if (request) {
		result = openAPISpec.request({
			method,
			path: endpoint,
			body: fixture,
		});
	} else {
		const path = openAPISpec.paths[endpoint];
		if (!path) {
			throw SwaggerValidatorError(`endpoint '${endpoint}' not found in the specification`);
		}
		const operation = path[method.toLowerCase()];
		if (!operation) {
			throw SwaggerValidatorError(`method '${method.toLowerCase()}' for endpoint '${endpoint}' not found in the specification`);
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
