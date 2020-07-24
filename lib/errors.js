const util = require('util');

function SwaggerValidator(type, message, status) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.type = type;
	this.message = message;
	this.status = status;
}

util.inherits(SwaggerValidator, Error);

const errorFactory = type => (message, status = 500) => new SwaggerValidator(type, message, status);

module.exports = errorFactory;
