const EVALUATE = require('../models/EVALUATE.model');
const GAME = require('../models/GAMEINFO.model');
const {DontSayTheseWords} = require('../config/config');
const {defaultGameStatus} = require('../config/defineModel');

exports.checkComment = (comment) => {
    var cmt = new String(comment).toLowerCase();
    for (var word of DontSayTheseWords) {
        if (cmt.indexOf(word) != -1) return false;
    }
    return true;
}

exports.scoreCalculatorAsync = async (gID) => {
    var score = 0;
    var review = "";
    const evaluates = await EVALUATE.find({ gID: gID });
    for (var evaluate of evaluates) {
        score = score + evaluate.score;
    }
    var avgScore = score/evaluates.length;
    if (avgScore <= 1) {
        review = defaultGameStatus.VeryNegative;
    }
    else if (avgScore <=2) {
        review = defaultGameStatus.Negative;
    }
    else if (avgScore <=3) {
        review = defaultGameStatus.Mixed;
    }
    else if (avgScore <=4) {
        review = defaultGameStatus.Positive;
    }
    else {
        review = defaultGameStatus.VeryPositive;
    }
    await GAME.findOneAndUpdate(
        { _id: gID},
        { score: avgScore, review: review },
        { new: true }
    );
}