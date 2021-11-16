const express = require('express')
const Controller = require('../controllers/evaluate.controller')
const SchemaValidateEvaluate = require("../validators/evaluate.validator")
const router = express.Router()
const Validate = require("../validators")
const jwtServices = require("../services/jwt.service")

router.post('/addEvaluate', jwtServices.verify, Validate.body(SchemaValidateEvaluate.addEvaluate), Controller.addEvaluateAsync)
router.post('/editEvaluate', jwtServices.verify, Validate.body(SchemaValidateEvaluate.editEvaluate), Controller.editEvaluateAsync)
router.post('/deleteEvaluate', jwtServices.verify, Controller.deleteEvaluateAsync)
router.get('/getEvaluateOfGame', Controller.getEvaluateOfGameAsync)
router.get('/getUserEvaluate', jwtServices.verify, Controller.getUserEvaluateAsync)
router.get('/evaluateFilter', Validate.body(SchemaValidateEvaluate.evaluateFilter), Controller.evaluateFilterAsync)



module.exports = router