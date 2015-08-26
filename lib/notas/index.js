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

    if (!nota) {
      res.status(400)
      res.json({message: 'no results'})
      return
    }

    res.json({
      notas: nota
    })

  })

  .put(function (req, res) {
    var id = req.params.id
    var nota = db[id]

    if(!id || !nota){
      res.status(404)
      res.json({message: 'no results'})
      return
    }

    var notaNueva = req.body.nota
    if(req.body.nota.id != id){
      res.status(400)
      res.json({message: 'not valid Id sended'})
      return
    }

    db[id] = notaNueva
    res.status(200)
    res.json({
      notas: notaNueva
    })
  })

  .delete(function (req, res) {
    var id = req.params.id

    var nota = db[id]
    if(!nota){
      res.status(400)
      res.json({message: 'not valid Id sended'})
      return
    }

    delete db[id]

    res.status(204)
    res.json({message: 'deleted'})
    return

  })

module.exports = app
