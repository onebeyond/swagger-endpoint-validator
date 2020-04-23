const express = require('express');
const bodyParser = require('body-parser');

const validator = require('../..');

const pets = [
	{ id: 1, name: 'pet 1', tag: 'dog' },
	{ id: 2, name: 'pet 2', tag: 'cat' },
	{ id: 3, name: 'pet 3', tag: 'bird' },
	{ id: 4, name: 'pet 4', tag: 'dog' },
	{ id: 5, name: 'pet 5', tag: 'cat' },
	{ id: 6, name: 'pet 6', tag: 'bird' },
];

const wrongPets = [
	{ id: 1, tag: 'dog' },
	{ id: 2, tag: 'cat' },
	{ id: 3, tag: 'bird' },
	{ id: 4, tag: 'dog' },
	{ id: 5, tag: 'cat' },
	{ id: 6, tag: 'bird' },
];

const runServer = async () => {
	const app = express();
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	await validator.init(app, {
		validationEndpoint: '/test',
		validateRequests: true,
		validateResponses: true,
		format: 'jsdoc',
		jsdoc: {
			swaggerDefinition: {
				info: {
					version: '1.0.0',
					title: 'Swagger Petstore',
					description: 'A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0 specification',
					termsOfService: 'http://swagger.io/terms/',
					contact: {
						name: 'Swagger API Team',
						email: 'apiteam@swagger.io',
						url: 'http://swagger.io',
					},
					license: {
						name: 'Apache 2.0',
						url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
					},
				},
			},
			basedir: process.cwd(),
			files: [
				'./test/jsdoc/fake-server.js',
				'./test/jsdoc/components.js',
			],
		},
	});

	/**
	 * @route GET /pets
	 * @summary Returns all pets from the system that the user has access to
	 * @param {[string]} tags.query - tags to filter by
	 * @param {integer} limit.query - maximum number of results to return
	 * @param {boolean} wrong.query - flag to force the server to return invalid response
	 * @produces application/json
	 * @returns {Array.<Pet>} 200 - pet response
	 * @returns {Error.model} default - unexpected error
	 */
	app.get(
		'/pets',
		(req, res) => {
			const { wrong } = req.query;
			if (wrong) {
				res.status(200).json(wrongPets);
			} else {
				res.status(200).json(pets);
			}
		},
	);

	/**
	 * @route POST /pets
	 * @summary Creates a new pet in the store. Duplicates are allowed
	 * @param {NewPet.model} body.body.required - Pet to add to the store
	 * @produces application/json
	 * @returns {Pet.model} 200 - pet response
	 * @returns {Error.model} default - unexpected error
	 */
	app.post(
		'/pets',
		(req, res) => {
			const { wrong } = req.query;
			if (wrong) {
				res.status(200).json({ ...req.body });
			} else {
				res.status(200).json({ id: 7, ...req.body });
			}
		},
	);

	return app;
};

module.exports = runServer;
