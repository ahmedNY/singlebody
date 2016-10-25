/*
  This file is useful when you want to execute some code before and after running
  your tests(e.g. lifting and lowering your sails application). Since your models
  are converted to waterline collections on lift, it is necessary to lift your
  sailsApp before trying to test them (This applies similarly to controllers and
  other parts of your app, so be sure to call this file first).
 */

var sails = require('sails');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(60000);

  sails.lift({
    // configuration for testing purposes
    log: {
       level: 'error'
     },
     models: {
       connection: 'test',
       migrate: 'drop'
     }
  }, function(err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
