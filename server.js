const express = require('express')
require('dotenv').config()
const passport = require('passport')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')



const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const uri = `mongodb://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0-shard-00-00.mb2gs.mongodb.net:27017,cluster0-shard-00-01.mb2gs.mongodb.net:27017,cluster0-shard-00-02.mb2gs.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-l52uzd-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})
const connection=mongoose.connection;
connection.once('open', () => {
    console.log('Connection established');
})
connection.on('error', function(err) {
    console.error('MongoDB event error: ' + err);
});


//"" session configure
app.use(session({
    secret: process.env.secret,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: uri
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 3600 * 24 }
}))
app.use(flash())
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// set Template engine
app.use(express.urlencoded({ extended: false }))
app.use(expressLayout)
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.set('views', path.join(__dirname, '/resources/views'))

app.set('view engine', 'ejs')

require('./routes/web')(app)

const PORT = process.env.PORT || 3100
app.listen(PORT, () => {
    console.log(`Listening on  port ${PORT}`)
});

