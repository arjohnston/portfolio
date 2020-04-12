/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Import the model being tested
const User = require('../api/models/User')

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect
const {
  OK,
  UNAUTHORIZED,
  BAD_REQUEST,
  CONFLICT
} = require('../utils/statusCodes')

// Setup Chai
chai.should()
chai.use(chaiHttp)

let serverInstance = null
let app = null

function initializeServer () {
  serverInstance = new server.Server()
  serverInstance.start()
  app = serverInstance.getServerInstance()
}

function terminateServer (done) {
  serverInstance.stop(done)
}

// Parent block for the User tests
describe('Users', () => {
  // Clear the database before the test beings
  before(done => {
    initializeServer()

    User.deleteMany({}, err => {
      if (err) {
        // Ignore the error
      }
      done()
    })
  })
  after(done => {
    terminateServer(done)
  })

  // Set a variable for the token that will be created during the login process
  // Used to access other APIs
  let token = ''

  // Register a user
  describe('/POST /api/auth/register', () => {
    it('Should not register a user without username or password', done => {
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

    it('Should successfully register a user with username and password', done => {
      const user = {
        username: 'abc',
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

    it('Should not allow a second registration with the same username as a user in the database', done => {
      const user = {
        username: 'abc',
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

  // Login with the username and password created above
  describe('/POST /api/auth/login', () => {
    it('Should return statusCode 400 if an username and/or password is not provided', done => {
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

    it('Should return statusCode 401 if an username/pass combo does not match a record in the DB', done => {
      const user = {
        username: 'notabc',
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

    it('Should return statusCode 401 if the username exists but password is incorrect', done => {
      const user = {
        username: 'abc',
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

    it('Should return statusCode 200 and a JWT token if the username/pass is correct', done => {
      const user = {
        username: 'abc',
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

  // Verify the validity of the token
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

  describe('/POST /api/auth/updatePassword', () => {
    it('Should return statusCode 400 if token is not provided', done => {
      const user = {
        password: 'StrongPassword$1'
      }
      chai
        .request(app)
        .post('/api/auth/updatePassword')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 400 if password is not provided', done => {
      const user = {
        token: token
      }
      chai
        .request(app)
        .post('/api/auth/updatePassword')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 if successfully updated', done => {
      const user = {
        token: token,
        password: 'StrongPassword$1'
      }
      chai
        .request(app)
        .post('/api/auth/updatePassword')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
