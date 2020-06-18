const debug = require('debug')('swagger-endpoint-validator:openapi-spec');
const fs = require('fs');
const jsYaml = require('js-yaml');
const swaggerJSDoc = require('swagger-jsdoc');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const Enforcer = require('openapi-enforcer');

const { SUPPORTED_FORMATS } = require('./constants');
const errorFactory = require('./errors');

const SwaggerValidatorError = errorFactory('swagger_validator');

/**
 * Generates the OpenAPI specification document from the express application documentation.
 * @param {Object} app - Express application object.
 * @param {Object} options - Configuration options.
 * @returns {{ spec: Object, openapi: Object }} OpenAPI specification.
 */
const generate = async (app, options) => {
	const specByFormat = {
		[SUPPORTED_FORMATS.JSDOC]: async formatOptions => {
			const instance = expressJSDocSwagger(app)(formatOptions);

			return new Promise((resolve, reject) => {
				instance.on('finish', resolve);

				instance.on('error', reject);
			});
		},
		[SUPPORTED_FORMATS.YAML]: formatOptions => jsYaml.safeLoad(fs.readFileSync(formatOptions.file, 'utf-8')),
		[SUPPORTED_FORMATS.YAML_JSDOC]: formatOptions => swaggerJSDoc(formatOptions),
	};

	try {
		debug('Merging documents to generate specification...');
		const doc = await specByFormat[options.format](options[options.format]);
		debug(`Specification generated!: ${JSON.stringify(doc)}`);

		debug('Dereferencing and validating specification...');
		const openapi = await Enforcer(doc);
		debug('Specification dereferenced and validated!');

		return { doc, openapi };
	} catch (error) {
		throw SwaggerValidatorError(`Wrong options for ${options.format}: ${error.message}`);
	}
};

module.exports = {
	generate,
};
