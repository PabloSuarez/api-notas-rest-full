/**
 * Module dependencies
 */
var express = require('express'),
    logger = require('./lib/logger'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')

/**
 * Locals
 */
var server = module.exports = express()
var port = process.env.PORT || 3000

// parse json requests
server.use(bodyParser.json('application/json'))

/**
 * Routes
 */
var notas = require('./lib/notas')
server.use(notas)

/**
 * Start server if we're not someone else's dependency
 */
if (!module.parent) {
  mongoose.connect('mongodb://localhost/anotamela-test', function() {
    server.listen(port, function() {
      logger.info('Anotamela API Básico escuchando en http://localhost:%s/', port)
    })
  })
}
