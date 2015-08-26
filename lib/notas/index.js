var logger = require('../logger')
var app = require('express')()
var db = {}

app.route('/notas/:id?/')
  .all(function (req, res, next) {
    console.log(req.method, req.path, req.body)
    res.set('Content-Type', 'application/json')
    next()
  })

  .post(function(req, res) {
    // logger.info('POST', req.body)
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


  .get(function (req, res) {
    var id = req.params.id
    var nota = db[id]

    res.json({
      notas: nota
    })

  })

module.exports = app