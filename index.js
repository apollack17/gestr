// create the express server here
const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();


const cors = require('cors');
const apiRouter = require('./api');

server.use(cors());
server.use('/api', apiRouter);

const { client } = require('./db');

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
  client.connect();
});