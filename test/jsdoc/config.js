const config = baseDir => ({
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
		baseDir,
		swaggerUIPath: '/docs/api',
		filesPattern: './fake-server.js',
	},
});

module.exports = config;
