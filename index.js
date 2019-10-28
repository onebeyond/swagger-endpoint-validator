const expressSwaggerGenerator = require('express-swagger-generator');
const validator = require('swagger-model-validator');

const errorFactory = require('./lib/errors');

const swaggerValidatorError = errorFactory('swagger_validator');

let singleton = null;

const createInstance = (app, options) => {
	const swaggerInstance = expressSwaggerGenerator(app)(options);
	validator(swaggerInstance); // add swagger-model-validator
	return swaggerInstance;
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
	init: (app, swaggerOptions) => {
		if (!singleton) {
			const { swaggerDefinition, ...rest } = swaggerOptions;
			// Options has to be built this way to avoid "TypeError: Cannot add property swagger, object is not extensible"
			const options = {
				swaggerDefinition: {
					...swaggerOptions.swaggerDefinition,
				},
				...rest,
			};
			singleton = createInstance(app, options);
		}
	},
	reset: () => {
		singleton = null;
	},
	validateAPIInput: (payload, request) => validate(payload, request, true),
	validateAPIOutput: (payload, request) => validate(payload, request, false),
};
