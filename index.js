// create the express server here
const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const cors = require('cors');
server.use(cors());
const apiRouter = require('./api');
server.use('/api', apiRouter);
const { client } = require('./db');

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
  client.connect();
});
