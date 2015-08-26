var logger = require('../logger')
var app = require('express')()
var db = {}

app.post('/notas', function(req, res) {
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


app.get('/notas/:id?', function (req, res) {
  var id = req.params.id
  var nota = db[id]

  console.log('ID DE LA NOTA: %s', id)

  res.json({
    notas: nota
  })

})

module.exports = app