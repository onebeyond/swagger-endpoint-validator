const debug = require('debug')('swagger-endpoint-validator:openapi-spec');
const fs = require('fs');
const jsYaml = require('js-yaml');
const swaggerJSDoc = require('swagger-jsdoc');
const expressSwaggerGenerator = require('express-swagger-generator');
const Enforcer = require('openapi-enforcer');
const apiConverter = require('swagger2openapi');

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
			const doc = expressSwaggerGenerator(app)(formatOptions);

			debug(`Converting specification from Swagger v2 to OpenAPI v3: ${JSON.stringify(doc)}`);
			// swagger2openapi does the conversion between OpenAPI 2.0 and OpenAPI 3.0, but it has a small error:
			// It doesn't add 'type: object' to the definitions.
			// So we'll do it manually until the issue is solved.
			// see https://github.com/Mermade/oas-kit/issues/220
			const definitions = {};
			Object.assign(definitions, doc.definitions);
			Object.keys(definitions).forEach(key => { definitions[key].type = 'object'; });
			const modifiedDoc = {
				...doc,
				definitions,
			};
			const conversion = await apiConverter.convertObj(modifiedDoc, {});
			debug(`Specification converted to OpenAPI v3: ${JSON.stringify(conversion.spec)}`);

			return conversion.openapi;
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
		debug(`Specification dereferenced and validated!: ${JSON.stringify(openapi)}`);

		return { doc, openapi };
	} catch (error) {
		throw SwaggerValidatorError(`Wrong options for ${options.format}: ${error.message}`);
	}
};

module.exports = {
	generate,
};
