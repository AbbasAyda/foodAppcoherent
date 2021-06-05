const express = require('express')
require('dotenv').config()
const passport = require('passport')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')


const PORT = process.env.PORT || 3100
//const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const url = "mongodb+srv://demo:avijeet1@cluster0.pyhq3.mongodb.net/food?authSource=admin&replicaSet=atlas-51btm7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', _ => {
    console.log('Database connected:')
})

db.on('error', err => {
    console.error('connection error:', err)
})


// session configure
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: url
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


app.listen(PORT, () => {
    console.log(`Listening on  port ${PORT}`)
})