const express = require('express')
const Controller = require('../controllers/game.controller')
const SchemaValidateGame = require("../validators/game.validator")
const router = express.Router()
const Validate = require("../validators")

router.post('/addGame', Validate.body(SchemaValidateGame.addGame), Controller.addGameAsync)
router.post('/editGame', Validate.body(SchemaValidateGame.editGame), Controller.editGameAsync)
router.post('/deleteGame', Controller.deleteGameAsync)
router.get('/findGameByType', Validate.body(SchemaValidateGame.findGameByType), Controller.findGameByTypeAsync)
router.get('/getALLGame', Controller.getALLGameAsync)
router.get('/getGameDetail', Controller.getGameDetailAsync)
router.get('/findGameByName', Validate.body(SchemaValidateGame.findGameByName), Controller.findGameByNameAsync)

module.exports = router