const joi = require('@hapi/joi');
const schemas = {
	addEvaluate: joi.object().keys({
		gID: joi.string().required(),
		score: joi.number(),
        comment: joi.string().required()
	}),
};
module.exports = schemas;