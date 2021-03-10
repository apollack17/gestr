require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const PORT = 3000 || process.env
const {client} = require("./db")
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', require('./api')) 
app.get('/', function(req, res, next) {
    var e = new Error('Request failed with status code 404');
    e.status = 404;
    next(e);
});
app.get('/', function(req, res, next) {
    var e = new Error("Request failed with status code 500");
    e.status = 500;
    next(e);
});
app.listen(PORT, ()=> {
    console.log("server is up on ", PORT)
    client.connect();
})// create the express server here
