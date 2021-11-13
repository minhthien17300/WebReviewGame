const GAME = require("../models/GAMEINFO.model");
const { string, array } = require('@hapi/joi');
const { $where } = require("../models/GAMEINFO.model");
const { query } = require("express");

exports.addGameAsync = async body => {
    try {
        const { name, description, types } = body;
        const gameExist = await GAME.findOne({ 
            name: name 
        });
        if(gameExist) {
            return {
                message: "Game đã tồn tại!",
                success: false
            };
        };

        const newGame = new GAME({
            name: name,
            description: description,
            types: types
        });
        await newGame.save();
        return {
            message: "Tạo thành công!",
            success: true,
            data: newGame
        }
    } catch (err) {
		console.log(err);
		return null;
	}
};

exports.editGameAsync = async ( body ) => {
    try {
        const { id, name, description, types } = body;
        const game = await GAME.findOneAndUpdate(
			{ _id: id },
			{ 
				name: name,
				description: description,
				types: types
			},
			{ new: true }
		);
		if (game != null) {
			return {
			message: 'Đổi thông tin thành công!',
			success: true,
            data: game
			};
		}
		else {
			return {
				message: "Đổi thông tin không thành công!",
				success: false
			};
		};
    } catch (err) {
		console.log(err);
		return null;
	}
}

exports.deleteGameAsync = async (id) => {
    try {
        const game = await GAME.deleteOne({ _id: id });
		return {
            message: "Xóa thành công!",
            success: true,
        }
    } catch (err) {
		console.log(err);
		return {
            message: "Xóa không thành công!",
            success: false
        }
	}
}

exports.findGameByTypeAsync = async body => {
    try {
        const { types } = body;
        const games = await GAME.find({
            types: { $in: types }
        });
        if(games.length != 0) {
            return {
            message: "Danh sách game!",
            success: true,
            data: games
            }
        } else {
            return {
                message: "Không tìm thấy game!",
                success: false
            }
        }
    } catch (err) {
		console.log(err);
		return null;
	}
};

exports.getALLGameAsync = async () => {
    try {
        const games = await GAME.find();
        return games;
    } catch (err) {
		console.log(err);
		return null;
	}
};

exports.getGameDetailAsync = async (id) => {
    try {
        const game = await GAME.findById({ _id: id });
        return game;
    } catch (err) {
		console.log(err);
		return null;
	}
}

exports.findGameByNameAsync = async body => {
    try {
        const { name } = body;
        var nameRegex = new RegExp(name)
        const games = await GAME.find({name :{$regex: nameRegex, $options: 'i'}});
        if(games.length == 0) {
            return {
                message: "Không tìm thấy Game!",
                success: false
            }
        } else {
            return {
                message: "Danh sách Game",
                success: true,
                data: games
            }
        }
    } catch (err) {
		console.log(err);
		return null;
	}
}