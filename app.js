const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const urlExists = require('url-exists')
const URL = require('./model/Url')
const mongoose = require('mongoose')

app.use(bodyParser.json())

app.use(cors())

const next = (err) => {console.log(err)}

var req_no = 0

var mongodb = 'mongodb://localhost:27017/url-shortner'
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise;
var db = mongoose.connection
db.on('error', console.error.bind(console, 'mongodb connection error: '))

app.post('/api/short-url', (req, res) => {  
    urlExists(req.body.url, function(err, exists) {
        if (err) res.send({status: "error occured"})
        else {
            if(exists) {
                var myUrl = new URL(
                    {
                        url: req.body.url,
                        shortner: req.body.shortner
                    }
                )
                URL.findOne({ 'shortner': req.body.shortner })
                .exec( function(err, found_url) {
                    if (err) { return next(err); }
                    if (found_url) {
                        console.log(req.body)
                        res.json({url: found_url.url, shortner: found_url.shortner, message: "shortner alredy existed!"});
                    }
                    else {
                        URL.findOne({ 'url': req.body.url })
                        .exec( function(err, found_url) {
                            if (err) { return next(err); }
                            if (found_url) {
                                console.log(req.body)
                                res.json({url: found_url.url, shortner: found_url.shortner, message:"URL already exists with a shortner."});
                            } 
                            else {
                                myUrl.save(function (err) {
                                    if (err) { return next(err); }
                                    console.log(req.body)
                                    res.json({url: myUrl.url, shortner: myUrl.shortner, message: "Here is your shortner, have fun!"});
                                });
                            }
                        })
                    }
                })
            }
            
            else {
                res.json({status: 'bad url'})
                console.log(req.body)
            }
        }
    })
})

app.get('/api/short-url/:myUrl', (req, res) => {
    URL.findOne({shortner: req.params.myUrl}) 
    .exec(function(err, found_url) {
        if (err) { return next(err); }
        // else res.redirect(found_url.url)
        if(found_url) {
            res.send(found_url.url)
        }
        else res.send("Not found, please create!")
    })
})

app.get('/api/whoami', (req, res) => {
    res.json(req.headers)
    console.log("Request who am I from " + JSON.stringify(req.headers))
})

app.get('/api/timestamp', (req, res) => {
    res.json({"unix": Date.now(), "utc": Date()})
    console.log(" is a null request so return current date and time");
})

app.get('/api/timestamp/:date_string', (req, res) => {
    let date_string = req.params.date_string
    // console.log(date_string);
    if(/\d{5,}/.test(date_string)) {
        let dateInt = parseInt(date_string)
        res.json({"unix": date_string, "utc": new Date(dateInt).toUTCString()})
        console.log(`I'm up!`)
    }
    else {
        let dateObj = new Date(date_string);
        if(dateObj.toString() === 'Invalid Date') {
            res.json({"error": "Invalid Date"})
        }
        else {
            res.json({"unix": dateObj.valueOf(), "utc": dateObj.toUTCString()})
        } 
    }
})

app.listen(4000);
