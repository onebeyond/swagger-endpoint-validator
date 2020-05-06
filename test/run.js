const { SUPPORTED_FORMATS } = require('../lib/constants');

const run = async () => {
	const type = Object.values(SUPPORTED_FORMATS).includes(process.argv[2])
		? process.argv[2] : SUPPORTED_FORMATS.YAML;

	// eslint-disable-next-line import/no-dynamic-require, global-require
	const runServer = require(`./${type}/fake-server`);
	const app = await runServer();
	app.listen(3000, () => {
		// eslint-disable-next-line no-console
		console.log('Listening on port 3000!');
	});
};

run();
