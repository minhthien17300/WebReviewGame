const express = require('express')
const Controller = require('../controllers/evaluate.controller')
const SchemaValidateEvaluate = require("../validators/evaluate.validator")
const router = express.Router()
const Validate = require("../validators")
const jwtServices = require("../services/jwt.service")

router.post('/addEvaluate', jwtServices.verify, Validate.body(SchemaValidateEvaluate.addEvaluate), Controller.addEvaluateAsync)



module.exports = router