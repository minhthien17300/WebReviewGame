const express = require('express')
const userRoute = require('./user.route')
const gameRoute = require('./game.route')



const router = express.Router()
router.use('/user', userRoute)
router.use('/game', gameRoute)




router.get('/healCheck', (req, res) => res.status(200).send('Welcome to ReviewGame'))

module.exports = router