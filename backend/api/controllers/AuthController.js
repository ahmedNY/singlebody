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
  /* e.g.
    action: function(req, res){
    }
  */
  permissions: function(req, res){
    var result = {};
    Jwt.findOne({token: req.headers.access_token}).populate("owner")
      .then(jwt => {
        result.jwt = jwt;
        return Auth.findOne({id: jwt.owner.auth}).populate("roles");
    }).then(function(auth){
      result.auth = auth;
      var rolesIds = auth.roles.map(role => role.id);
      return Permission.find({or:[{role: rolesIds}, {user: auth.id}]}).populate("model")
    }).then(function(perms){
      result.permissions = perms;
      delete result.jwt.owner;
      res.ok(result)
    })
  }

});
