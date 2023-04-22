const express = require('express');
const morgan = require('morgan');
const { logger, validateUserId, validateUser, validatePost } = require('./middleware/middleware');
const server = express();

// remember express by default cannot parse JSON in request bodies

server.use(express.json());
server.use(morgan('dev'));
server.use(logger)

// global middlewares and the user's router need to be connected here

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});


module.exports = server;
