/* global describe it before */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const User = require('../api/models/User')

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect
const { OK, UNAUTHORIZED, BAD_REQUEST, CONFLICT } = require('../util/statusCodes')

chai.should()
chai.use(chaiHttp)

// Our parent block
describe('Users', () => {
  before(done => {
    // Before each test we empty the database
    User.deleteMany({}, err => {
      if (err) {
        //
      }
      done()
    })
  })

  let token = ''

  describe('/POST checkIfUserExists with no users added yet', () => {
    it('Should not return statusCode 200 when an email is not provided', done => {
      const user = {}
      chai
        .request(app)
        .post('/api/auth/checkIfUserExists')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(400)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when a user does not exist', done => {
      const user = {
        username: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/auth/checkIfUserExists')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST /api/auth/register', () => {
    it('Should not register a user without email or password', done => {
      const user = {}

      chai
        .request(app)
        .post('/api/auth/register')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should successfully register a user with email and password', done => {
      const user = {
        username: 'a@b.c',
        password: 'StrongPassword$1'
      }

      chai
        .request(app)
        .post('/api/auth/register')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should not allow a second registration with the same email as a user in the database', done => {
      const user = {
        username: 'a@b.c',
        password: 'StrongPassword$1'
      }

      chai
        .request(app)
        .post('/api/auth/register')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(CONFLICT)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST checkIfUserExists with a user added', () => {
    it('Should return statusCode 409 when a user already exists', done => {
      const user = {
        username: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/auth/checkIfUserExists')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(409)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST /api/auth/login', () => {
    it('Should return statusCode 400 if an email and/or password is not provided', done => {
      const user = {}
      chai
        .request(app)
        .post('/api/auth/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an email/pass combo does not match a record in the DB', done => {
      const user = {
        username: 'nota@b.c',
        password: 'notpass'
      }
      chai
        .request(app)
        .post('/api/auth/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if the email exists but password is incorrect', done => {
      const user = {
        username: 'a@b.c',
        password: 'notpass'
      }
      chai
        .request(app)
        .post('/api/auth/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a JWT token if the email/pass is correct', done => {
      const user = {
        username: 'a@b.c',
        password: 'StrongPassword$1'
      }
      chai
        .request(app)
        .post('/api/auth/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('object')
          res.body.should.have.property('token')
          token = res.body.token

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST /api/auth/verify', () => {
    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/auth/verify')
        .send({})
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 when an invalid token is passed in', done => {
      chai
        .request(app)
        .post('/api/auth/verify')
        .send({ token: 'Invalid Token' })
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when a valid token is passed in', done => {
      chai
        .request(app)
        .post('/api/auth/verify')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('object')
          res.body.should.have.property('username')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
