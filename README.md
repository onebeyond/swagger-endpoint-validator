<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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
await validator.init(app, options);
```

where:

  - `app` is the Express app instance.
  - `options` is the configuration object used by the validator.

## TO DO!

Improve this doc.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kevinccbsg"><img src="https://avatars.githubusercontent.com/u/12685053?v=4?s=100" width="100px;" alt="Kevin Julián Martínez Escobar"/><br /><sub><b>Kevin Julián Martínez Escobar</b></sub></a><br /><a href="https://github.com/onebeyond/swagger-endpoint-validator/issues?q=author%3Akevinccbsg" title="Bug reports">🐛</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=kevinccbsg" title="Code">💻</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=kevinccbsg" title="Documentation">📖</a> <a href="#ideas-kevinccbsg" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/pulls?q=is%3Apr+reviewed-by%3Akevinccbsg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=kevinccbsg" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LonelyPrincess"><img src="https://avatars.githubusercontent.com/u/17673317?v=4?s=100" width="100px;" alt="Sara Hernández"/><br /><sub><b>Sara Hernández</b></sub></a><br /><a href="https://github.com/onebeyond/swagger-endpoint-validator/issues?q=author%3ALonelyPrincess" title="Bug reports">🐛</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=LonelyPrincess" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/irenemateoh-fullstack/"><img src="https://avatars.githubusercontent.com/u/39806058?v=4?s=100" width="100px;" alt="Irene Mateo Herrero"/><br /><sub><b>Irene Mateo Herrero</b></sub></a><br /><a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=irenemherrero" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/inigomarquinez"><img src="https://avatars.githubusercontent.com/u/25435858?v=4?s=100" width="100px;" alt="Íñigo Marquínez Prado"/><br /><sub><b>Íñigo Marquínez Prado</b></sub></a><br /><a href="https://github.com/onebeyond/swagger-endpoint-validator/issues?q=author%3Ainigomarquinez" title="Bug reports">🐛</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=inigomarquinez" title="Code">💻</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=inigomarquinez" title="Documentation">📖</a> <a href="#ideas-inigomarquinez" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-inigomarquinez" title="Maintenance">🚧</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/pulls?q=is%3Apr+reviewed-by%3Ainigomarquinez" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=inigomarquinez" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ulisesgascon.com/"><img src="https://avatars.githubusercontent.com/u/5110813?v=4?s=100" width="100px;" alt="Ulises Gascón"/><br /><sub><b>Ulises Gascón</b></sub></a><br /><a href="https://github.com/onebeyond/swagger-endpoint-validator/issues?q=author%3AUlisesGascon" title="Bug reports">🐛</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=UlisesGascon" title="Code">💻</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=UlisesGascon" title="Documentation">📖</a> <a href="#ideas-UlisesGascon" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-UlisesGascon" title="Maintenance">🚧</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/pulls?q=is%3Apr+reviewed-by%3AUlisesGascon" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/onebeyond/swagger-endpoint-validator/commits?author=UlisesGascon" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!