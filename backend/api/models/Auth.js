/**
 * Auth
 *
 * @module      :: Model
 * @description :: Holds all authentication methods for a User
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {
  autoCreatedBy: false,

  attributes: require('waterlock').models.auth.attributes({

    firstName: 'string',
    lastName: 'string',
    fullName: 'string',

    group: {
      model: "Group"
    },

    createdBy: {
      model: "Auth"
    },

    roles: {
      collection: 'Role',
      via: 'users',
      dominant: true
    },

    permissions: {
      collection: "Permission",
      via: "user"
    },

    donations: {
      collection: "Donation",
      via: "owner"
    },

    facebookId: {
      type: 'string',
      unique: true
    },

  }),

  beforeUpdate: require('waterlock').models.auth.beforeUpdate,

  beforeCreate: require('waterlock').models.auth.beforeCreate,


  afterCreate: [
    function setOwner (auth, next) {
      sails.log.verbose('User.afterCreate.setOwner', auth);
      Auth.update({ id: auth.id }, { owner: auth.id })
        .then(function (auth) {
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        });
    },
    function attachDefaultRole (auth, next) {
      sails.log('User.afterCreate.attachDefaultRole', auth);
      Auth.findOne(auth.id)
        .populate('roles')
        .then(function (_auth) {
          auth = _auth;

          // to prevent changing password
          delete auth.password;


          return Role.findOne({ name: 'registered' });
        })
        .then(function (role) {
          auth.roles.add(role.id);
          return auth.save();
        })
        .then(function (updatedUser) {
          sails.log.silly('role "registered" attached to auth--->', auth);
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        })
    }
  ]
};
