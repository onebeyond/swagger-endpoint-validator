const debug = require('debug')('swagger-endpoint-validator:openapi-spec');
// const expressSwaggerGenerator = require('express-swagger-generator');
// const swaggerJSDoc = require('swagger-jsdoc');

// const { SUPPORTED_FORMATS } = require('./constants');

const fs = require('fs');
const jsYaml = require('js-yaml');

/**
 * Generates the OpenAPI specification document from the express application documentation.
 * @param {Object} options - Configuration options.
 */
const generate = options => {
	debug('Generating OpenAPI specification...');

	const spec = jsYaml.safeLoad(fs.readFileSync(options.yamlFile, 'utf-8'));

	debug(`OpenAPI specification generated: ${JSON.stringify(spec)}`);

	return spec;
};

// const generate = (app, options) => {
// 	debug('Initializing OpenAPI specification');

// 	const spec = {
// 		[SUPPORTED_FORMATS.JSDOC]: async () => {
// 			const { swaggerDefinition, ...rest } = options;
// 			// Options has to be built this way to avoid
// 			// "TypeError: Cannot add property swagger, object is not extensible"
// 			const swaggerOptions = {
// 				swaggerDefinition: {
// 					...options.swaggerDefinition,
// 				},
// 				...rest,
// 			};

// 			const swaggerInstance = expressSwaggerGenerator(app)(swaggerOptions);
// 			return swaggerInstance;
// 		},
// 		default: async () => {
// 			const { swaggerDefinition, ...rest } = options;

// 			// Options for the swagger docs
// 			const swaggerOptions = {
// 				// Import swaggerDefinitions
// 				swaggerDefinition,
// 				...rest,
// 			};

// 			// Initialize swagger-jsdoc -> returns validated swagger spec in json format
// 			const swaggerSpec = swaggerJSDoc(swaggerOptions);

// 			// If a URL is included in the configuration, serve the API doc through it
// 			if (rest.url) {
// 				app.use(rest.url, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 			}

// 			return swaggerInstance.swagger;
// 		},
// 	};
// };

module.exports = {
	generate,
};
