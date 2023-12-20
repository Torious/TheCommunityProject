const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust this path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe('Registration', () => {
  // Test Case: Valid Registration
  it('should register a new user with valid data', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'StrongPassword123'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.not.have.property('password');
        done();
      });
  });

  // Test Case: Duplicate Email or Username
  it('should not register a user with a duplicate email or username', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        email: 'duplicate@example.com',
        username: 'duplicateUser',
        password: 'Password123'
      })
      .end(() => {
        chai.request(server)
          .post('/api/users/register')
          .send({
            email: 'duplicate@example.com',
            username: 'duplicateUser',
            password: 'Password123'
          })
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('message').that.includes('already in use');
            done();
          });
      });
  });

  // Test Case: Invalid Data
  it('should reject registration with invalid data', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        email: 'invalidemail', // Invalid email format
        username: 'user',
        password: '123' // Weak password
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message').that.includes('Invalid');
        done();
      });
  });

  // Test Case: Server Response for Successful Registration
  it('should respond appropriately for successful registration', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'StrongPassword123'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.not.have.property('password');
        done();
      });
  });

  // Test Case: Server Response for Error (e.g., duplicate email)
  it('should respond appropriately for errors like duplicate email', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        email: 'existinguser@example.com',
        username: 'newuser123',
        password: 'StrongPassword123'
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message').that.includes('already in use');
        done();
      });
  });

  // ... (additional tests for other scenarios)
});
