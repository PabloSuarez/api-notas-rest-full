var logger = require('../logger'),
    app = require('express')(),
    Nota = require('./model')

app.route('/notas/:id?/')
  .all(function (req, res, next) {
    res.set('Content-Type', 'application/json')
    next()
  })

  .post(function(req, res) {
    var notaNueva = req.body.nota
    notaNueva.id = Date.now()

    Nota.create(notaNueva, function (err, data) {
      if(!err){
        res.set('Content-Type','application/json')
        res.status(201)
        res.json({
          nota: notaNueva
        })
        return
      }
      res.status(500)
      res.json({message: 'no results'})

    })
  })

  .get(function (req, res) {
    var id = req.params.id

    if(!id) {
      Nota.find({}, function (err, data) {
        if(!err){
          return res
            .status(200)
            .json({
              notas: data
            })
        }
        return res
          .status(400)
          .json({message: 'no results'})
      })

    }else{

      Nota.findOne({id: id}, function (err, data) {
        if(!err && data){
          return res
            .status(200)
            .json({
              notas: data
            })
        }
        res.status(400)
        res.json({message: 'no results'})
      })
    }
  })


  .put(function (req, res) {
    var id = req.params.id
    var notaNueva = req.body.nota

    if(!id || !notaNueva){
      return res
        .status(404)
        .json({message: 'required id as parameter and note in body'})
    }

    notaNueva.id = id

    Nota.update({'id':id}, notaNueva, function(err, data) {
      if(!err){
        return res
          .status(200)
          .json({
            notas: notaNueva
          })
      }
      res.status(304)
      res.json({message: 'not update'})
    })
  })

  .delete(function (req, res) {
    var id = req.params.id

    if(!id){
      return res
        .status(404)
        .json({message: 'required id as parameter'})
    }

    Nota.findOne({'id':id}, function (err, data) {
      if(err){
        return res
          .status(500)
          .json({message: 'not fund'})
      }

      if(!data){
        return res
          .status(404)
          .json({message: 'no results'})
      }

      Nota.remove({'id':id}, function (err, data) {
        if(!err){
          return res
            .status(204)
            .send({message: 'deleted'})
        }
      })

    })
  })

module.exports = app
