const debug = require('debug')('swagger-endpoint-validator');

const apiDocEndpoint = require('./lib/apiDocEndpoint');
const { SUPPORTED_FORMATS } = require('./lib/constants');
const customErrorHandler = require('./lib/customErrorHandler');
const normalizeOptions = require('./lib/normalizeOptions');
const openAPISpecification = require('./lib/openAPISpecification');
const validationEndpoint = require('./lib/validationEndpoint');
const validator = require('./lib/validator');
const errorFactory = require('./lib/errors');

const SwaggerValidatorError = errorFactory('swagger_validator');

/**
 * Initializes the Swagger endpoint validator.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration object.
 * @param {string} options.format - format of the OpenAPI specification documentation.
 * @param {Object} [options.yaml={}] - Extra configuration when format = 'yaml'.
 * @param {string} [options.yaml.file=null] - path of the yaml file containing the OpenAPI specification.
 * @param {Object} [options.yaml_jsdoc={}] - Extra configuration when format = 'yaml_jsdoc'.
 * @param {Object} [options.jsdoc={}] - Extra configuration when format = 'jsdoc'.
 * @param {string} [options.validationEndpoint=null] - endpoint to do schemas validation agains the OpenAPI schema.
 * @param {string} [options.apiDocEndpoint=null] - endpoint to show UI based API documentation.
 * @param {*} [options.validateRequests=true] - Determines whether the validator should validate requests.
 * @param {*} [options.validateResponses=true] - Determines whether the validator should validate responses. Also accepts response validation options.
 * @param {*} [options.validateSecurity=true] -Determines whether the validator should validate securities e.g. apikey, basic, oauth2, openid, etc
 * @param {*} [options.validateFormats='fast'] - Specifies the strictness of validation of string formats.
 * @param {*} [options.unknownFormats=true] - Defines how the validator should behave if an unknown or custom format is encountered.
 * @param {*} [options.operationHandlers=false] - Defines the base directory for operation handlers.
 * @param {*} [options.ignorePaths=null] - Defines a regular expression that determines whether a path(s) should be ignored. Any path that matches the regular expression will be ignored by the validator.
 * @param {*} [options.fileUploader=true] - Specifies the options to passthrough to multer. express-openapi-validator uses multer to handle file uploads.
 * @param {*} [options.coerceTypes=true] - Determines whether the validator should coerce value types to match the type defined in the OpenAPI spec.
 * @param {*} [options.$refParser.mode='bundle'] - Determines how JSON schema references are resolved.
 *
 * @see {@link https://www.npmjs.com/package/express-openapi-validator#advanced-usage|express-openapi-validator} for advanced configuration options.
 */
const init = async (app, options) => {
	debug('Initializing middleware for this express app...');

	if (!options.format || !Object.values(SUPPORTED_FORMATS).includes(options.format)) {
		throw SwaggerValidatorError(`You need to specify the format used in the options. Supported values are ${Object.values(SUPPORTED_FORMATS).join(',')}`);
	}

	const normalizedOptions = normalizeOptions(options);
	const spec = await openAPISpecification.generate(app, normalizedOptions);

	// CAUTION! Optional endpoints (apiDocEndpoint, validationEndpoint) must be added before
	// initializing the validator to avoid including them in the validation process.
	apiDocEndpoint.add(app, normalizedOptions, spec.doc);
	validationEndpoint.add(app, normalizedOptions);

	await validator.init(app, normalizedOptions, spec);
	customErrorHandler.add(app);

	debug('Middleware initialized!');
};

module.exports = {
	init,
};
