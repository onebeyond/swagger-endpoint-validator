const debug = require('debug')('swagger-endpoint-validator:custom-error-handler');

/**
 * Adds a custom error handler for the errors thrown by the validator.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration options.
 * @see https://github.com/cdimascio/express-openapi-validator#asyncawait
 */
const add = (app, options) => {
	debug('Adding custom error handler...');

	app.use((error, _req, res, next) => { // eslint-disable-line no-unused-vars
		debug(JSON.stringify(error));
		if (options.propagateError) {
			next(error);
		} else {
			res.status(error.status || 500).send(error);
		}
	});

	debug('Custom error handler added!');
};

module.exports = {
	add,
};
