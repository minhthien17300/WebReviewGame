const EVALUATE = require('../models/EVALUATE.model');
const GAME = require('../models/GAMEINFO.model');
const evaluateHelper = require('../helper/evaluate.helper');

exports.addEvaluateAsync = async ( uID, body ) => {
    try {
        const { gID, score, comment } = body;
        const evaluate = await EVALUATE.findOne({
            uID: uID,
            gID: gID
        });
        if (!evaluateHelper.checkComment(comment)) {
            return {
                message: "Bạn đã vi phạm nguyên tắc đánh giá của ReviewGame! Nếu còn cố tình tái phạm bạn sẽ bị khóa tài khoản!",
                success: false
            }
        }
        if (evaluate != null) {
            return {
                message: "Đã tồn tại đánh giá!",
                success: false
            }
        }
        var curDate = new Date();
        const newEvaluate = new EVALUATE({
            uID: uID,
            gID: gID,
            score: score,
            comment: comment,
            dateEvaluate: curDate
        });
        await newEvaluate.save();
        await evaluateHelper.scoreCalculatorAsync(gID);
        return {
            message: "Đã thêm đánh giá!",
            success: true,
            data: newEvaluate
        }
    } catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
}
