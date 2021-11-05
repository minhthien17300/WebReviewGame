const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');

// Type Assign Schema
const TypeAssignSchema = mongoose.Schema({
  tID: defaultModel.stringR,
  gID: defaultModel.stringR
});

const TypeAssign = module.exports = mongoose.model('TYPEASSIGN', TypeAssignSchema, 'TYPEASSIGN');