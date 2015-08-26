var request = require('supertest-as-promised'),
    api = require('../server.js'),
    async = require('async'),
    host = process.env.API_TEST_HOST || api

request = request(host)


function createNotes(data, callback) {
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
}

describe('Coleccion de Notas [/notas]', function() {

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
          createNotes(data, callback)
        },
        function (res, callback) {
          assertions(res, data, callback)
          done()
        }
      ],done)
    })
  })


  describe('GET obtengo una NOTA', function () {
    it('deberia obtener una nota existente', function (done) {
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
        function (callback) {
          createNotes(data, callback)
        },
        function (res, callback) {
          getNote(res, callback)
        },
        function (res, callback){
          assertions(res, data, callback)
          done()
        }
      ], done)
    })
  })

})