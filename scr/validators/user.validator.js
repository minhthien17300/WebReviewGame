const joi = require('@hapi/joi');
const schemas = {
	register: joi.object().keys({
		userName: joi.string().required(),
		userPwd: joi.string().required(),
		name: joi.string().required(),
		email: joi.string().email().required(),
		phone: joi.string().required(),
		gender: joi.number().require(),
		dateofBirth: joi.date().require()
	}),
	login: joi.object().keys({
		email: joi.string().email().required(),
		password: joi.string().required()
	}),
	changePass: joi.object().keys({
		oldPassword: joi.string().required(),
		newPassword: joi.string().required()
	}),
	resetPassword: joi.object().keys({
		email: joi.string().email().required(),
		password: joi.string().required(),
		otp: joi.string().required()
	}),
};
module.exports = schemas;