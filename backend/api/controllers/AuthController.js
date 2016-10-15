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
    var result = {};
    Jwt.findOne({token: req.headers.access_token}).populate("owner")
      .then(function(jwt) {
        // result.jwt = jwt;
        return Auth.findOne({id: jwt.owner.auth}).populate("roles");
    }).then(function(auth){
      result.id = auth.id;
      result.email = auth.email;
      result.group = auth.group;
      var roles = auth.roles.map(function(role){return role.name});
      result.roles = roles;
      var rolesIds = auth.roles.map(function(role){return role.id});
      return Permission.find({or:[{role: rolesIds}, {user: auth.id}]}).populate("model")
    }).then(function(perms){
      // result.perms = perms
      var permissions = perms.map(function(perm){
        return {
          model: perm.model.name,
          action: perm.action,
          relation: perm.relation
        }
      });

      result.permissions = []

      var perm = {model: null};
      for(var i = 0; i < permissions.length; i++){
        var currentPerm = permissions[i];

        if(perm.model !== currentPerm.model){
          // adding perm to result
          if(perm.model !== null) {
            result.permissions.push(perm)
          }
          // new perm
          perm = { model: currentPerm.model }
        }

        // add actions array
        if(perm[currentPerm.relation] === undefined){
          perm[currentPerm.relation] = []
        }

        perm[currentPerm.relation].push(currentPerm.action)

        // adding last permission
        if(i === permissions.length-1){
          result.permissions.push(perm)
        }
      }
      // result.permissions = permissions;
      var auth = result.auth;
      res.ok(result)
    })
  }

});
