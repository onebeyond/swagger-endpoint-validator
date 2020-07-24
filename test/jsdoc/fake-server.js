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
		apiDocEndpoint: '/docs',
		format: 'jsdoc',
		jsdoc: {
			info: {
				description: 'Documentation for API',
				title: 'API Title',
				version: '1.0.0',
				license: {
					name: 'MIT',
				},
				contact: {
					name: 'Author',
					email: 'email@email.com',
				},
			},
			servers: [],
			security: {
				JWT: {
					type: 'apiKey',
					in: 'header',
					name: 'Authorization',
				},
			},
			baseDir: __dirname,
			swaggerUIPath: '/docs/api',
			filesPattern: './fake-server.js',
		},
	});

	/**
	 * @typedef {object} Pet
	 * @property {integer} id.required
	 * @property {string} name.required
	 * @property {string} tag
	 */

	/**
	 * @typedef {object} NewPet
	 * @property {string} name.required
	 * @property {string} tag
	 */

	/**
	 * @typedef {object} Error
	 * @property {integer} code.required
	 * @property {string} message.required
	 */

	/**
	 * GET /pets
	 * @summary Returns all pets from the system that the user has access to
	 * @param {integer} limit.query - maximum number of results to return
	 * @param {boolean} wrong.query - flag to force the server to return invalid response
	 * @return {array<Pet>} 200 - pet response
	 * @return {Error} default - unexpected error
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
	 * POST /pets
	 * @summary Creates a new pet in the store. Duplicates are allowed
	 * @param {NewPet} request.body.required - Pet to add to the store
	 * @return {Pet} 200 - pet response
	 * @return {Error} default - unexpected error
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
