const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');

// Game Schema
const GameSchema = mongoose.Schema({
  name: defaultModel.stringR,
  description: defaultModel.stringR,
  score: defaultModel.number,
  review: defaultModel.stringR
});

const Game = module.exports = mongoose.model('GAMEINFO', GameSchema, 'GAMEINFO');