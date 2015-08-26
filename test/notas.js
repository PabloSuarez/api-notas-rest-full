var request = require('supertest-as-promised')
var api = require('../server.js')
var host = process.env.API_TEST_HOST || api

request = request(host)

describe('Coleccion de Notas [/notas]', function() {

  describe('POST', function() {
    it('deberia crear una nota', function(done) {
      var data = {
        "nota": {
          "title": "Mejorando.la #node-pro",
          "description": "Introduccion a clase",
          "type": "js",
          "body": "soy el cuerpo de json"
        }
      }

      request
        .post('/notas')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .end(function(err, res) {
          var nota

          var body = res.body
          console.log('body', body)

          // Nota existe
          expect(body).to.have.property('nota')
          nota = body.nota

          // Propiedades
          expect(nota).to.have.property('title', 'Mejorando.la #node-pro')
          expect(nota).to.have.property('description', 'Introduccion a clase')
          expect(nota).to.have.property('type', 'js')
          expect(nota).to.have.property('body', 'soy el cuerpo de json')
          expect(nota).to.have.property('id')

          done(err)
        })
    })
  })


  describe('GET ', function () {
    it('deberia obtener una nota existente', function (done) {
      var data = {
        "nota": {
          "title": "Mejorando.la #node-pro",
          "description": "Introduccion a clase",
          "type": "js",
          "body": "soy el cuerpo de json"
        }
      }
      var id = 0;

      // crear nota nueva
      request
        .post('/notas/')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .then(function (res) {
          id = res.body.nota.id
          return request
            .get('/notas/'+id)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        }, done)

        .then(function (res){
          var nota = res.body.notas

          // Propiedades
          expect(nota).to.have.property('title', 'Mejorando.la #node-pro')
          expect(nota).to.have.property('description', 'Introduccion a clase')
          expect(nota).to.have.property('type', 'js')
          expect(nota).to.have.property('body', 'soy el cuerpo de json')
          expect(nota).to.have.property('id', id)
        }, done())

    })
  })

})