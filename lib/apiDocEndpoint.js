const debug = require('debug')('swagger-endpoint-validator:api-doc-endpoint');

const swaggerUi = require('swagger-ui-express');

/**
 * Add an optional validation endpoint to the Express aplication.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration options.
 * @param {Object} doc - JSON object describing the extracted OpenAPI specification.
 */
const add = (app, options, doc) => {
	if (options.apiDocEndpoint) {
		debug('Adding endpoint to show UI based API documentation...');
		app.use(options.apiDocEndpoint, swaggerUi.serve, swaggerUi.setup(doc));
		debug(`UI based API documentation endpoint added : '${options.apiDocEndpoint}'`);
	}
};

module.exports = {
	add,
};
