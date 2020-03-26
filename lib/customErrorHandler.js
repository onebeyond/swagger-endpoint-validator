const debug = require('debug')('swagger-endpoint-validator:custom-error-handler');

/**
 * Adds a custom error handler for the errors thrown by the validator.
 * @param {Object} app - Express application object.
 * @see https://github.com/cdimascio/express-openapi-validator#asyncawait
 */
const add = app => {
	debug('Adding custom error handler');

	app.use((error, _req, res, _next) => { // eslint-disable-line no-unused-vars
		debug(error);
		res.status(error.status || 500).json(error);
	});

	debug('Custom error handler added');
};

module.exports = {
	add,
};
