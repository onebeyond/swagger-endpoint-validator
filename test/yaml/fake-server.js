const express = require('express');

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
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	await validator.init(app, config);

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
