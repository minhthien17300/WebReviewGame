const joi = require('@hapi/joi');
const schemas = {
	addGame: joi.object().keys({
		name: joi.string().required(),
		description: joi.string().required(),
		types: joi.array().required(),
	}),
	editGame: joi.object().keys({
		id: joi.string().required(),
		name: joi.string().required(),
		description: joi.string().required(),
		types: joi.array().required(),
	}),
	findGameByType: joi.object().keys({
        types: joi.array().required()
    }),
	findGameByName: joi.object().keys({
		name: joi.string().required()
	}),
};
module.exports = schemas;