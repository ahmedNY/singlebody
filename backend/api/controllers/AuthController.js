/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').waterlocked({

  permissions: function(req, res){
    Jwt.findOne({token: req.headers.access_token}).populate("owner")
      .then(function(jwt) {
        return Permission.usersPermissions(jwt.owner.id, function(err, permissions) {
          if(err) return res.badRequest(err);
          return res.ok(permissions);
        })
    })
  }

});
