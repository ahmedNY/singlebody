var request = require('supertest');
var bcrypt = require('bcrypt');

describe('AuthController', function() {

  describe('#login()', function() {
    it('should return json web token', function (done) {
      request(sails.hooks.http.app)
        .post('/auths/login')
        .send({ email: 'admin@singlebody.sd',
                password: 'admin1234', type: 'local' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          if(res.body.user.auth.email !== 'admin@singlebody.sd')
            return done(new Error("unexpected email"));

          if( ! bcrypt.compareSync("admin1234", res.body.user.auth.password))
            return done(new Error("unexpected password"));

          done();
        });
    });
  });

  describe('#register()', function() {
    it('should return json web token', function (done) {
      request(sails.hooks.http.app)
        .post('/auths/register')
        .send({ email: 'admin2@singlebody.sd',
                password: 'admin1234', type: 'local' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          if(res.body.user.auth.email !== 'admin2@singlebody.sd')
            return done(new Error("unexpected email"));

          if( ! bcrypt.compareSync("admin1234", res.body.user.auth.password))
            return done(new Error("unexpected password"));

          done();
        });
    });
  });

});
