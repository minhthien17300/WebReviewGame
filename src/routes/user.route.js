const express = require('express')
const Controller = require('../controllers/user.controller')
const SchemaValidateUser = require("../validators/user.validator")
const router = express.Router()
const Validate = require("../validators")
const jwtServices = require("../services/jwt.service")


router.post('/login', Validate.body(SchemaValidateUser.login), Controller.loginAsync)
router.post('/register', Validate.body(SchemaValidateUser.register), Controller.registerAsync)
router.post('/changePassword', jwtServices.verify, Validate.body(SchemaValidateUser.changePass), Controller.changePasswordAsync)
router.get('/forgotPassword', Controller.forgotPasswordAsync)
router.post('/resetPassword', Validate.body(SchemaValidateUser.resetPassword), Controller.resetPasswordAsync)
router.get('/findUserByToken', jwtServices.verify, Controller.findUserByTokenAsync)
router.post('/changeInfo', jwtServices.verify, Validate.body(SchemaValidateUser.changeInfo), Controller.changeInfoAsync)
router.post('/banUser', Controller.banUserAsync)
router.post('/unbanUser', Controller.unbanUserAsync)

module.exports = router