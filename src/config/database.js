const mongoose = require('mongoose')
const { configEnv } = require('./config')

async function connect() {
    try {
         await mongoose.connect(configEnv.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('connect successfully!')
    } catch (error) {
        console.log('connect fail!!' + error)
    }
}

module.exports = { connect }