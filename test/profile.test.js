const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust this path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe('Profile', () => {
  let authToken; // To store the token for authenticated requests
  const userId = '{userId}'; // Replace with the actual user ID

  before((done) => {
    // Log in to get an auth token
    chai.request(server)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'UserPassword123' })
      .end((err, res) => {
        authToken = res.body.token; // Save the token
        done();
      });
  });

  it('should update user profile information', (done) => {
    chai.request(server)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'updatedUsername',
        email: 'updatedEmail@example.com',
        profilePicture: 'newProfilePicUrl.jpg'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.username).to.equal('updatedUsername');
        expect(res.body.email).to.equal('updatedEmail@example.com');
        done();
      });
  });

  it('should persist updated profile information', (done) => {
    // First, update the user profile
    chai.request(server)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'persistedUsername',
        email: 'persistedEmail@example.com',
        profilePicture: 'persistedProfilePic.jpg'
      })
      .end(() => {
        // Then, fetch the user profile to check if updates persisted
        chai.request(server)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.username).to.equal('persistedUsername');
            expect(res.body.email).to.equal('persistedEmail@example.com');
            done();
          });
      });
  });

  it('should prevent unauthorized profile updates', (done) => {
    // Attempt to update user profile without auth token
    chai.request(server)
      .put(`/api/users/${userId}`)
      .send({
        username: 'newUsername',
        email: 'newEmail@example.com',
        profilePicture: 'newProfilePic.jpg'
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should prevent updating another user\'s profile', (done) => {
    // Attempt to update another user's profile using valid auth token
    chai.request(server)
      .put(`/api/users/{anotherUserId}`) // Replace with a different user's ID
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'newUsername',
        email: 'newEmail@example.com',
        profilePicture: 'newProfilePic.jpg'
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
});
