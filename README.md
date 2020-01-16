
# swagger-endpoint-validator

![npm](https://img.shields.io/npm/v/swagger-endpoint-validator)
[![CircleCI](https://circleci.com/gh/guidesmiths/swagger-endpoint-validator.svg?style=svg)](https://circleci.com/gh/guidesmiths/swagger-endpoint-validator)

A validator of API endpoints to check that input and/or output match with the swagger specification for the API.

This is based on [express-swagger-generator](https://www.npmjs.com/package/express-swagger-generator), so it is important that each endpoints is properly documented so that the library can do the validation.

## Installation

```bash
npm install --save swagger-endpoint-validator
```

## Methods

### init(app: ExpressApp, validatorOptions: ConfigFile, format: String)

```js
validator.init(app, validatorOptions, format);
```

where:

  - `app` is the Express app instance.
  - `format` is an string to choose the format we want to create the swagger docs: `jsdoc` or `yaml`. Default `jsdoc`.
  - `validatorOptions` is a configuration object that has different format depending on `format`:

**`validatorOptions` for _jsdoc_**

```js
const validatorOptions = {
  swaggerDefinition: {
    info: {
      description: 'Documentation for Service API',
      title: 'Service API',
      version: '1.0.0',
      contact: { email: 'your_email@guidesmiths.com' },
    },
    host: 'localhost:5000',
    basePath: '/',
    produces: ['application/json'],
    schemes: ['http'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: process.cwd(), // app absolute path
  files: ['./test/**/**.js'], // path to the API handle folder, related to basedir
  route: {
    url: '/test/docs/api',
    docs: '/test/docs/api.json',
  },
};
```

**`validatorOptions` for _yaml_**

```js
const validatorOptions = {
  swaggerDefinition: {
    info: {
      description: 'Documentation for Service API',
      title: 'Service API',
      version: '1.0.0',
      contact: { email: 'your_email@guidesmiths.com' },
    },
    basePath: '/',
  },
  apis: ['./test/**/**.js'], // paths to the API files
  url: '/test/docs/api', // optional path to serve the API documentation
};
```

### validateAPIInput(input: Object, request: RequestObject)

```js
validator.validateAPIInput(input, request);
```

where:

  - `input` is the payload to be validated.
  - `request` is request object.

It will use the configuration used in the initialization to look for the endpoint and the schema to validate.

**JSDOC Example**

```js
/**
 * @typedef Input
 * @property {string} name.required
 */

/**
 * @typedef Output
 * @property {string} name.required
 * @property {string} result.required
 */

/**
 * @route GET /test-invalid-output
 * @summary Create a new group
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} <any> - Error message
 * @security JWT
 */
app.get('/test-invalid-input', (req, res) => {
  try {
    validator.validateAPIInput({}, req);
  } catch (error) {
    res.status(404).json({ error });
  }
});
```

**YAML Example**

```js
/**
 * @swagger
 * /test-invalid-input:
 *   post:
 *     description: Test POST /test-invalid-input
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input payload
 *         required: true
 *         type: object
 *         schema:
 *         - $ref: '#/definitions/Input'
 *     responses:
 *       200:
 *         description: successful operation
 */
app.post('/test-invalid-input', (req, res) => {
  try {
    const result = validator.validateAPIInput({}, req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
});
```

### validateAPIOutput(output: Object, request: RequestObject)

```js
validator.validateAPIOutput(output, request);
```

where:

  - `output` is the payload to be validated.
  - `request` is request object.

It will use the configuration used in the initialization to look for the endpoint and the schema to validate.

**JSDOC Example**

```js
/**
 * @typedef Input
 * @property {string} name.required
 */

/**
 * @typedef Output
 * @property {string} name.required
 * @property {string} result.required
 */

/**
 * @route GET /test-invalid-output
 * @summary Create a new group
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} <any> - Error message
 * @security JWT
 */
app.get('/test-invalid-output', (req, res) => {
  const validInputModel = { name: 'Name is required' };
  try {
    validator.validateAPIInput(validInputModel, req);
    validator.validateAPIOutput({}, req);
  } catch (error) {
    res.status(404).json({ error });
  }
});
```

**YAML Example**

```js
/**
 * @swagger
 * /test-invalid-output:
 *   get:
 *     description: Test GET /test-invalid-output
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/Output'
 */
app.get('/test-invalid-output', (req, res) => {
  try {
    const result = validator.validateAPIOutput({}, req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
});
```

### Example of a valid request with the validator

**JSDOC**

```js
/**
 * @typedef Input
 * @property {string} name.required
 */

/**
 * @typedef Output
 * @property {string} name.required
 * @property {string} result.required
 */

/**
 * @route GET /test-valid
 * @summary Create a new group
 * @group test - Everything about tests
 * @param {Input.model} body.body.required
 * @returns {Output.model} 200 - Successful operation
 * @returns {Error.model} <any> - Error message
 * @security JWT
 */
app.get('/test-valid', (req, res) => {
  const validInputModel = { name: 'Name is required' };
  const validOutputModel = { name: 'Name is required', result: 'Valid result' };
  validator.validateAPIInput(validInputModel, req);
  validator.validateAPIOutput(validOutputModel, req);
  res.status(200).json({ success: true });
});
```

**YAML**

```js
/**
 * @swagger
 * /test-valid-input:
 *   post:
 *     description: Test POST /test-valid-input
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input payload
 *         required: true
 *         type: object
 *         schema:
 *         - $ref: '#/definitions/Input'
 *     responses:
 *       200:
 *         description: successful operation
 */
app.post('/test-valid-input', (req, res) => {
  const validInputModel = { name: 'Name is required' };

  try {
    const result = validator.validateAPIInput(validInputModel, req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
});

/**
 * @swagger
 * /test-valid-output:
 *   get:
 *     description: Test GET /test-valid-output
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Input payload
 *         required: true
 *         type: object
 *         schema:
 *         - $ref: '#/definitions/Input'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/Output'
 */
app.get('/test-valid-output', (req, res) => {
  const validInputModel = { name: 'Name is required' };
  const validOutputModel = { name: 'Name is required', result: 'Valid result' };

  try {
      validator.validateAPIInput(validInputModel, req);
    const result = validator.validateAPIOutput(validOutputModel, req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
});
```