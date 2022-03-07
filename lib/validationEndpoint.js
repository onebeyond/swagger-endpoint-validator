const debug = require('debug')('swagger-endpoint-validator:validation-endpoint');

const validator = require('./validator');

/**
 * Add an optional validation endpoint to the Express aplication.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration options.
 */
const add = (app, options) => {
	if (options.validationEndpoint) {
		debug('Adding custom validation endpoint...');

		app.post(
			options.validationEndpoint,
			(req, res) => {
				const result = validator.validateSchema(req.body);

				if (result.error) {
					res.status(400).json(result.error);
				} else {
					res.sendStatus(200);
				}
			},
		);

		debug(`Custom validation endpoint added : 'POST ${options.validationEndpoint}'`);
	}
};

module.exports = {
	add,
};
