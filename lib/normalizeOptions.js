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

	const formatOptions = {
		[SUPPORTED_FORMATS.YAML]: normalizedYaml,
		[SUPPORTED_FORMATS.YAML_JSDOC]: options[options.format] || {},
		[SUPPORTED_FORMATS.JSDOC]: options[options.format] || {},
	};

	const selectedFormat = options.format || SUPPORTED_FORMATS.YAML;

	const normalizedOptions = {
		...options,
		format: options.format || SUPPORTED_FORMATS.YAML,
		[options.format]: formatOptions[selectedFormat],
		validationEndpoint: options.validationEndpoint || null,
		apiDocEndpoint: options.apiDocEndpoint || null,
		validateResponses: options.validateResponses !== undefined ? options.validateResponses : true,
	};

	debug(`Normalized options: ${JSON.stringify(normalizedOptions)}`);

	return normalizedOptions;
};

module.exports = normalizeOptions;
