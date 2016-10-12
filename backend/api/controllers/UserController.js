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
    var groupId = req.query.group;

    Auth.find({or: [ {group: null}, {group: groupId} ]}).then(function(users) {
      return res.json(users.map(function(user) {
        return {
          id: user.id,
          name: user.name || user.email,
        }
      }))
    })
  }
});
