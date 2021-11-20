const express = require('express')
const Controller = require('../controllers/game.controller')
const SchemaValidateGame = require("../validators/game.validator")
const router = express.Router()
const Validate = require("../validators")
const path = require("path");
var multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "temp/images/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + Math.floor(Math.random() * 100) + path.extname(file.originalname));
    },
  });
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'images', maxCount: 100 }]);

router.post('/addGame', cpUpload, Validate.body(SchemaValidateGame.addGame), Controller.addGameAsync)
router.post('/editGame', cpUpload, Validate.body(SchemaValidateGame.editGame), Controller.editGameAsync)
router.post('/deleteGame', Controller.deleteGameAsync)
router.get('/findGameByType', Validate.body(SchemaValidateGame.findGameByType), Controller.findGameByTypeAsync)
router.get('/getALLGame', Controller.getALLGameAsync)
router.get('/getGameDetail', Controller.getGameDetailAsync)
router.get('/findGameByName', Validate.body(SchemaValidateGame.findGameByName), Controller.findGameByNameAsync)

module.exports = router