const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.json');
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

	await validator.init(app, config);

	/**
	 * @swagger
	 *
	 * /pets:
	 *   get:
	 *     description: |
	 *       Returns all pets from the system that the user has access to
	 *     operationId: findPets
	 *     parameters:
	 *       - name: tags
	 *         in: query
	 *         description: tags to filter by
	 *         required: false
	 *         style: form
	 *         schema:
	 *           type: array
	 *           items:
	 *             type: string
	 *       - name: limit
	 *         in: query
	 *         description: maximum number of results to return
	 *         required: false
	 *         schema:
	 *           type: integer
	 *           format: int32
	 *           minimum: 1
	 *           maximum: 50
	 *       - name: wrong
	 *         in: query
	 *         description: flag to force the server to return invalid response
	 *         required: false
	 *         schema:
	 *           type: boolean
	 *     responses:
	 *       '200':
	 *         description: pet response
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Pet'
	 *       default:
	 *         description: unexpected error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
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
	 * @swagger
	 *
	 * /pets:
	 *   post:
	 *     description: Creates a new pet in the store. Duplicates are allowed
	 *     operationId: addPet
	 *     requestBody:
	 *       description: Pet to add to the store
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/NewPet'
	 *     parameters:
	 *       - name: wrong
	 *         in: query
	 *         description: flag to force the server to return invalid response
	 *         required: false
	 *         schema:
	 *           type: boolean
	 *     responses:
	 *       '200':
	 *         description: pet response
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Pet'
	 *       default:
	 *         description: unexpected error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
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
