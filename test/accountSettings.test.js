const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust this path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe('Account Settings', () => {
  let authToken; // To store the token for authenticated requests
  const userId = '{userId}'; // Replace with the actual user ID

  before((done) => {
    // Log in to get an auth token
    chai.request(server)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'OldPassword123' })
      .end((err, res) => {
        authToken = res.body.token; // Save the token
        done();
      });
  });

  it('should allow a user to change their password', (done) => {
    chai.request(server)
      .put(`/api/users/${userId}/password`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ oldPassword: 'OldPassword123', newPassword: 'NewPassword123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        // Perform a logout if applicable

        // Try logging in with the new password
        chai.request(server)
          .post('/api/users/login')
          .send({ email: 'testuser@example.com', password: 'NewPassword123' })
          .end((err, loginRes) => {
            expect(loginRes).to.have.status(200);
            expect(loginRes.body).to.have.property('token');
            done();
          });
      });
  });

  it('should allow a user to update their email', (done) => {
    const newEmail = 'updatedEmail@example.com';
    
    // Update the user's email
    chai.request(server)
      .put(`/api/users/${userId}/email`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ email: newEmail })
      .end((err, res) => {
        expect(res).to.have.status(200);

        // Fetch the user's profile to verify the email update
        chai.request(server)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .end((err, profileRes) => {
            expect(profileRes).to.have.status(200);
            expect(profileRes.body).to.be.a('object');
            expect(profileRes.body.email).to.equal(newEmail);
            done();
          });
      });
  });

  it('should invalidate old passwords after a password change', (done) => {
    const oldPassword = 'OldPassword123';
    const newPassword = 'NewPassword123';

    // Change the user's password
    chai.request(server)
      .put(`/api/users/${userId}/password`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ oldPassword, newPassword })
      .end((err, res) => {
        expect(res).to.have.status(200);

        // Attempt logging in with the old password
        chai.request(server)
          .post('/api/users/login')
          .send({ email: 'testuser@example.com', password: oldPassword })
          .end((err, loginRes) => {
            expect(loginRes).to.have.status(401); // Unauthorized or another appropriate status code
            done();
          });
      });
  });

  it('should prevent unauthenticated users from changing account settings', (done) => {
    // Attempt to change password without auth token
    chai.request(server)
      .put(`/api/users/${userId}/password`)
      .send({ oldPassword: 'AnyPassword', newPassword: 'AnotherPassword' })
      .end((err, res) => {
        expect(res).to.have.status(401); // Unauthorized
        done();
      });
  });
});
