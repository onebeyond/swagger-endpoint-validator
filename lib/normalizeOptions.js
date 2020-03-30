const debug = require('debug')('swagger-endpoint-validator:options');

const { SUPPORTED_FORMATS } = require('./constants');

/**
 * Normalize configuraton object used by the validator.
 * @param {Object} options - Configuration object.
 */
const normalizeOptions = options => {
	debug('Normalizing options...');

	let normalizedYaml = options.yaml || {};
	normalizedYaml = {
		file: normalizedYaml.file || null,
	};

	const normalizedOptions = {
		validateRequests: options.validateRequests || true,
		validateResponses: options.validateResponses || true,
		validationEndpoint: options.validationEndpoint || null,
		format: options.format || SUPPORTED_FORMATS.YAML,
		yaml: normalizedYaml,
	};

	debug(`Normalized options: ${JSON.stringify(normalizedOptions)}`);

	return normalizedOptions;
};

module.exports = normalizeOptions;
