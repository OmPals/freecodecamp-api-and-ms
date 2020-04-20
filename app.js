const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();

app.get('/api/whoami', cors(), (req, res) => {
    res.json(req.headers)
    console.log("Request who am I from " + JSON.stringify(req.headers))
})

app.get('/api/timestamp', cors(), (req, res) => {
    res.json({"unix": Date.now(), "utc": Date()})
    console.log(" is a null request so return current date and time");
})

app.get('/api/timestamp/:date_string', cors(), (req, res) => {
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