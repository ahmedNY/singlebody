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
    var filter;

    // filter by groupid
    var groupId = req.query.group;
    if(groupId) {
      filter = {
        or: [
          { group: groupId },
          { group: null },
        ]
      }
    }

    Auth.find(filter).then(function(users) {
      return res.json(users.map(function(user) {
        return {
          id: user.id,
          name: user.name || user.email,
        }
      }))
    })
  }
});
