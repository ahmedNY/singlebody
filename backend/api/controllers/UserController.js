/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').actions.user({

    find: function(req, res) {
      Group.find().then(function(groups) {
        if(groups.length > 0) {
          var groupsAdmins = groups.map(function(g) {
            return g.admin;
          })
          return Auth.find({  id: { '!' : groupsAdmins } });
        }
        return Auth.find();
      })
      .then(function(users) {
        var result = [];
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          var name = "";

          if(user.name) {
            name = user.name
          }else if (user.email) {
            name = user.email
          }

          result.push(
            {
              id: user.id,
              name: name,
            });
        }
        return res.json(result)
      })
    }

});
