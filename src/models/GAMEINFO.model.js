const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');

// Game Schema
const GameSchema = mongoose.Schema({
  name: defaultModel.stringR,
  description: defaultModel.stringR,
  types: defaultModel.array,
  images: defaultModel.array,
  score: defaultModel.number,
  review: defaultModel.stringEvaluate
});

const Game = module.exports = mongoose.model('GAMEINFO', GameSchema, 'GAMEINFO');