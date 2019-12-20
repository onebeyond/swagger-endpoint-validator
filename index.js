const expressSwaggerGenerator = require('express-swagger-generator');
const validator = require('swagger-model-validator');
const swaggerJSDoc = require('swagger-jsdoc');

const errorFactory = require('./lib/errors');

const swaggerValidatorError = errorFactory('swagger_validator');

let singleton = null;

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
				// Path to the API docs
				// Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
				...rest,
			};

			// Initialize swagger-jsdoc -> returns validated swagger spec in json format
			const swaggerSpec = swaggerJSDoc(options);
			const swaggerInstance = validator(swaggerSpec);
			return swaggerInstance.swagger;
		},
	};

	return instance[format]();
};

const validate = (payload, request, isInput) => {
	if (!singleton) {
		throw swaggerValidatorError('Swagger not initialized!');
	}

	if (!payload || !request) {
		throw swaggerValidatorError('payload and request are required to do API validation.');
	}

	const { method } = request;
	const { path: routePath } = request.route;

	const formatPath = pathStr => pathStr.replace(/{/g, ':').replace(/}/g, ''); // Replace :<string> by {string} in path

	const paths = Object.keys(singleton.paths).reduce((acum, item) => (
		{ ...acum, [formatPath(item)]: singleton.paths[item] }
	), {});
	const path = paths[routePath];

	if (path) {
		const pathMethod = path[method.toLowerCase()];

		if (pathMethod) {
			const schemaToValidate = isInput
				? pathMethod.parameters.find(item => item.name === 'body').schema
				: pathMethod.responses['200'].schema;
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

module.exports = {
	init: (app, swaggerOptions, format = 'jsdoc') => {
		if (!['jsdoc', 'yaml'].includes(format)) {
			throw swaggerValidatorError(`${format} format not supported`);
		}

		if (!singleton) {
			singleton = createInstance(app, swaggerOptions, format);
		}
	},
	reset: () => {
		singleton = null;
	},
	validateAPIInput: (payload, request) => validate(payload, request, true),
	validateAPIOutput: (payload, request) => validate(payload, request, false),
};
