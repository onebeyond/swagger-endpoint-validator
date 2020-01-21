const expressSwaggerGenerator = require('express-swagger-generator');
const validator = require('swagger-model-validator');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const errorFactory = require('./lib/errors');

const swaggerValidatorError = errorFactory('swagger_validator');

let singleton = null;
let paths = null;

/**
 * Replaces :<string> by {string}.
 * @param {string} pathStr - string to replace.
 * @returns Replaced string.
 */
const formatPath = pathStr => pathStr.replace(/{/g, ':').replace(/}/g, '');

/**
 * Creates the validator singleton instance.
 * @param {object} app - Express application object.
 * @param {object} swaggerOptions - Swagger options.
 * @param {string} format - One of: 'jsdoc' or 'yaml'.
 * @returns Validator singleton instance initialized.
 */
const createInstance = (app, swaggerOptions, format) => {
	const instance = {
		jsdoc: () => {
			const { swaggerDefinition, ...rest } = swaggerOptions;
			// Options has to be built this way to avoid "TypeError: Cannot add property swagger, object is not extensible"
			const options = {
				swaggerDefinition: {
					...swaggerOptions.swaggerDefinition,
				},
				...rest,
			};

			const swaggerInstance = expressSwaggerGenerator(app)(options);
			validator(swaggerInstance);
			return swaggerInstance;
		},
		yaml: () => {
			const { swaggerDefinition, ...rest } = swaggerOptions;

			// Options for the swagger docs
			const options = {
				// Import swaggerDefinitions
				swaggerDefinition,
				...rest,
			};

			// Initialize swagger-jsdoc -> returns validated swagger spec in json format
			const swaggerSpec = swaggerJSDoc(options);
			const swaggerInstance = validator(swaggerSpec);

			// If a URL is included in the configuration, serve the API doc through it
			if (rest.url) {
				app.use(rest.url, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
			}

			return swaggerInstance.swagger;
		},
	};

	return instance[format]();
};

/**
 * Validates the payload for a specific endpoint.
 * @param {object} payload - Payload to be validated.
 * @param {object} request - Express request object.
 * @param {boolean} isInput - true if it's an input payload for the endpoint, false otherwise.
 * @throws {swaggerValidatorError} Swagger validator error.
 */
const validate = (payload, request, isInput) => {
	if (!singleton) {
		throw swaggerValidatorError('Swagger not initialized!');
	}

	if (!payload || !request) {
		throw swaggerValidatorError('payload and request are required to do API validation.');
	}

	const { method } = request;
	const { path: routePath } = request.route;
	const path = paths[routePath];

	if (path) {
		const pathMethod = path[method.toLowerCase()];

		if (pathMethod) {
			let schemaToValidate = isInput
				? pathMethod.parameters.find(item => item.name === 'body').schema
				: pathMethod.responses['200'].schema;
			schemaToValidate = schemaToValidate[0] ? schemaToValidate[0] : schemaToValidate;
			const validation = singleton.validateModel(schemaToValidate, payload, false, true);

			if (!validation.valid) {
				const error = swaggerValidatorError(validation.GetErrorMessages());
				error.extra = validation.GetFormattedErrors();
				throw error;
			}

			return { valid: validation.valid };
		}
	}

	throw swaggerValidatorError('payload data not valid for validation.');
};

/**
 * Initializes the validator.
 * @param {*} app - Express application object.
 * @param {*} swaggerOptions - Swagger options.
 * @param {*} format  - One of: 'jsdoc' or 'yaml'.
 */
const init = (app, swaggerOptions, format = 'jsdoc') => {
	if (!['jsdoc', 'yaml'].includes(format)) {
		throw swaggerValidatorError(`${format} format not supported`);
	}

	if (!singleton) {
		singleton = createInstance(app, swaggerOptions, format);

		paths = Object.keys(singleton.paths).reduce((acum, item) => (
			{ ...acum, [formatPath(item)]: singleton.paths[item] }
		), {});
	}
};

/**
 * Resets the validator.
 */
const reset = () => {
	singleton = null;
};

/**
 * Validates a payload used as input body to a REST endpoint.
 * @param {object} payload - Payload to be validated.
 * @param {object} request - Express request object details.
 */
const validateAPIInput = (payload, request) => validate(payload, request, true);

/**
 * Validates a payload returned by a REST endpoint.
 * @param {object} payload - Payload to be validated.
 * @param {object} request - Express request object details.
 */
const validateAPIOutput = (payload, request) => validate(payload, request, false);

module.exports = {
	init,
	reset,
	validateAPIInput,
	validateAPIOutput,
};
