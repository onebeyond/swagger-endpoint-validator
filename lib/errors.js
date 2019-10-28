const util = require('util');

function SwaggerValidator(type, message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.type = type;
	this.message = message;
}

util.inherits(SwaggerValidator, Error);

const errorFactory = type => message => new SwaggerValidator(type, message);


module.exports = errorFactory;
