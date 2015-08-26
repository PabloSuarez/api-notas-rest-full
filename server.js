/**
 * Module dependencies
 */
var express = require('express')
var logger = require('./lib/logger')
var bodyParser = require('body-parser')

/**
 * Locals
 */
var server = module.exports = express()
var port = process.env.PORT || 3000
var db = {}

// parse json requests
server.use(bodyParser.json('application/json'))

/**
 * Routes
 */
server.post('/notas', function(req, res) {
  logger.info('POST', req.body)
  var notaNueva = req.body.nota
  notaNueva.id = Date.now()

  db[notaNueva.id] = notaNueva

  // prepare response
  res.set('Content-Type','application/json')
  res.status(201)
  res.json({
    nota: notaNueva
  })
})


server.get('/notas/:id?', function (req, res) {
  var id = req.params.id
  var nota = db[id]

  console.log('ID DE LA NOTA: %s', id)

  res.json({
    notas: nota
  })

})

/**
 * Start server if we're not someone else's dependency
 */
if (!module.parent) {
  server.listen(port, function() {
    logger.info('Anotamela API Básico escuchando en http://localhost:%s/', port)
  })
}