const debug = require('debug')('swagger-endpoint-validator:options');

const { SUPPORTED_FORMATS } = require('./constants');

const normalizeOptions = options => {
	debug('Normalizing options...');
	const normalizedOptions = {
		validateRequests: options.validateRequests || true,
		validateResponses: options.validateResponses || true,
		validationEndpoint: options.validationEndpoint || null,
		format: options.format || SUPPORTED_FORMATS.YAML,
		yamlFile: options.yamlFile || null,
	};

	debug(`Normalized options: ${JSON.stringify(normalizedOptions)}`);

	return normalizedOptions;
};

module.exports = normalizeOptions;
