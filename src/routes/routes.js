const express = require('express')
const userRoute = require('./user.route')



const router = express.Router()
router.use('/user', userRoute)




router.get('/healCheck', (req, res) => res.status(200).send('Welcome to ReviewGame'))

module.exports = router