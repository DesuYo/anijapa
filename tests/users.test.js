const request = require('supertest')
const app = require('../dist').default

describe('POST /api/users/signup', () => {
  it('test invalid request body', done => {
    request(app)
      .post('/api/users/signup')
      .send({
        username: 'Senpai*sd2/',
        email: 'notEmail',
        password: 'doesNotContainNumber'
      })
      .expect(400)
      .end(done)
  })

  /*it('test valid request body', done => {
    request(app)
      .post('/api/users/signup')
      .send({
        username: 'senpai_desu',
        email: 'olehdesu@gmail.com',
        password: 'qwerTY12345'
      })
      .expect(201)
      .end(done)
  })*/
})