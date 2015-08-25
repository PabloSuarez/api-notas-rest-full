/**
 * Module dependencies
 */
var express = require('express')
var logger = require('./lib/logger')
var bodyParser = require('body-parser')

/**
 * Locals
 */
var app = module.exports = express();
var port = process.env.PORT || 3000;

// parse json requests
app.use(bodyParser.json('application/json'));

/**
 * Routes
 */
app.post('/notas', function(req, res) {
  logger.info('POST', req.body);

  // manipulate request
  var notaNueva = req.body.nota;
  notaNueva.id = '123';

  // prepare response
  res.set('Content-Type','application/json');
  res.status(201);

  // send response
  res.json({
    nota: notaNueva
  });
});

/**
 * Start server if we're not someone else's dependency
 */
if (!module.parent) {
  app.listen(port, function() {
    logger.info('Anotamela API Básico escuchando en http://localhost:%s/', port);
  });
}