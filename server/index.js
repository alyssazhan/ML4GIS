// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const path = require('path');

var env = process.env.NODE_ENV || 'development';
// Have Node serve the files for our built React app
// Without middleware
app.get('/api', function(req, res,next){
    var options = {
        root: path.join(__dirname)
    };
    var fileName = 'config.json';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);


app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
    console.log("Environment is: ", env);
});
