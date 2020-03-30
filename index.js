const debug = require('debug')('swagger-endpoint-validator');

const customErrorHandler = require('./lib/customErrorHandler');
const normalizeOptions = require('./lib/normalizeOptions');
const openAPISpecification = require('./lib/openAPISpecification');
const validationEndpoint = require('./lib/validationEndpoint');
const validator = require('./lib/validator');

/**
 * Initializes the Swagger endpoint validator.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration object.
 * @param {boolean} [options.validateRequests=true] - true to validate the requests.
 * @param {boolean} [options.validateResponses=true] - true to validate the responses.
 * @param {string} [options.validationEndpoint=null] - endpoint to do schemas validation agains the OpenAPI schema.
 * @param {string} [options.format=yaml] - format of the OpenAPI specification documentation.
 * @param {Object} [options.yaml={}] - Extra configuration when format = 'yaml'.
 * @param {Object} [options.yaml.file=null] - path of the yaml file containing the OpenAPI specification.
 */
const init = async (app, options) => {
	debug('Initializing middleware for this express app...');

	const normalizedOptions = normalizeOptions(options);
	const spec = await openAPISpecification.generate(normalizedOptions);
	await validator.init(app, normalizedOptions, spec);
	validationEndpoint.add(app, normalizedOptions);
	customErrorHandler.add(app);

	debug('Middleware initialized!');
};

module.exports = {
	init,
};
