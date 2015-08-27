var request = require('supertest-as-promised'),
    api = require('../server.js'),
    async = require('async'),
    host = process.env.API_TEST_HOST || api,
    logger = require('../lib/logger'),
    mongoose = require('mongoose')

request = request(host)


function createNote(data, callback) {
  // crear nota nueva
  request
    .post('/notas/')
    .set('Accept', 'application/json')
    .send(data)
    .expect(201)
    .end(callback)
}

function getNote(res, callback) {
  id = res.body.nota.id

  request
    .get('/notas/' + id)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .end(callback)
}

function assertions(res, data, callback) {
  var nota = res.body.notas || res.body.nota

  expect(nota).to.have.property('title', data.nota.title)
  expect(nota).to.have.property('description', data.nota.description)
  expect(nota).to.have.property('type', data.nota.type)
  expect(nota).to.have.property('body', data.nota.body)
  expect(nota).to.have.property('id', data.nota.id)
  callback(null, nota)
}

function deleteNote(res, callback) {
  var id = res.body.nota.id

  request
    .delete('/notas/' + id)
    .expect(204)
    .end(callback)
}

describe('Coleccion de Notas [/notas]', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/anotamela-test', done)
  })

  after(function(done) {
    mongoose.disconnect(done)
    mongoose.models = {}
  })

  describe('POST creo una nota', function() {
    it('deberia crear una nota', function(done) {
      var data = {
        "nota": {
          "title": "Creo MI NOTA #node #node-pro",
          "description": "Introduccion a clase",
          "type": "js",
          "body": "soy el cuerpo de json"
        }
      }

      async.waterfall([
        function (callback) {
          createNote(data, callback)
        },
        function (res, callback) {
          assertions(res, data, callback)
        }
      ],done)
    })
  })

  describe('PUT Modificar una nota', function () {
    it('deberia obtener una nota y modificarla', function (done) {
      var data = {
        "nota": {
          "title": "MI NOTA #node #node-pro",
          "description": "Introduccion a clase",
          "type": "js",
          "body": "soy el cuerpo de json"
        }
      }

      var newData = {
        "nota": {
          "title": "MI NOTA 'Actualizada'",
          "description": "Utilizando PUT",
          "type": "js",
          "body": "soy el cuerpo de json"
        }
      }
      var id

      async.waterfall([
        function (callback) {
          createNote(data, callback)
        },
        function (res, callback) {
          getNote(res, callback)
        },
        function (res, callback){
          assertions(res, data, callback)
        },
        function (res, callback) {
          // Ya cree la nota, ahora la actualizo
          newData.nota.id = res.id
          request
            .put('/notas/' + res.id)
            .set('Accept', 'application/json')
            .send(newData)
            .expect(200)
            .end(callback)
        },
        function (res, callback) {
          assertions(res, newData, callback)
        }
      ], done)
    })
  })

  describe('DELETE de una nota', function () {
    it('Deberia eliminar una nota', function (done) {
      var data = {
        "nota": {
          "title": "MI NOTA #node #node-pro",
          "description": "Introduccion a clase",
          "type": "js",
          "body": "soy el cuerpo de json"
        }
      }

      var id

      async.waterfall([
        // create a note
        function (callback) {
          createNote(data, callback)
        },
        // delete this note
        function (res, callback) {
          deleteNote(res, callback)
          id = res.body.nota.id
        },
        // check that not exist after
        function (res, callback) {
          request
            .get('/notas/' + id)
            .expect(400)
            .end(callback)
        }
      ], done)
    })
  })

  describe('GET obtengo una NOTA', function () {
    var data = {
      "nota": {
        "title": "MI NOTA #node #node-pro",
        "description": "Introduccion a clase",
        "type": "js",
        "body": "soy el cuerpo de json"
      }
    }

    it('deberia obtener una nota existente', function (done) {
      var id

      async.waterfall([
        function (callback) {
          createNote(data, callback)
        },
        function (res, callback) {
          getNote(res, callback)
        },
        function (res, callback){
          assertions(res, data, callback)
        }
      ], done)
    })

    it('deberia obtener todas las notas', function (done) {

      async.waterfall([
        function (callback) {
          createNote(data, callback)
          createNote(data, callback)
        }
      ], done())

      request
        .get('/notas/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then(function (res) {
          var body = res.body
          expect(body).to.have.property('notas')

          var bodyLength = Object.keys(body.notas).length
          expect(bodyLength).above(0)
        })
    })
  })

})
