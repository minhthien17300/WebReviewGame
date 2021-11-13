const evaluateServices = require('../services/evaluate.service');
const controller = require('../controllers/message.controller');
const jwtServices = require('../services/jwt.service');

exports.addEvaluateAsync = async (req, res, next) => {
    try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
        const resServices = await evaluateServices.addEvaluateAsync(id, req.value.body);
        if (!resServices.success) {
			return controller.sendSuccess(res, {}, 400, resServices.message);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			201,
			resServices.message
		);
    } catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
}