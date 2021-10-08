[![CI](https://github.com/guidesmiths/swagger-endpoint-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/guidesmiths/swagger-endpoint-validator/actions/workflows/ci.yml)
[![CD](https://github.com/guidesmiths/swagger-endpoint-validator/actions/workflows/cd.yml/badge.svg)](https://github.com/guidesmiths/swagger-endpoint-validator/actions/workflows/cd.yml)

# swagger-endpoint-validator

![npm](https://img.shields.io/npm/v/swagger-endpoint-validator)

A validator of API endpoints to check that input and/or output match with the swagger specification for the API.

This is based on [express-swagger-generator](https://www.npmjs.com/package/express-swagger-generator), so it is important that each endpoints is properly documented so that the library can do the validation.

## Installation

```bash
npm install --save swagger-endpoint-validator
```

## Methods

### init(app: ExpressApp, options: ConfigFile)

```js
validator.init(app, options);
```

where:

  - `app` is the Express app instance.
  - `options` is the configuration object used by the validator.

## TO DO!

Improve this doc.