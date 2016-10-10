/**
 * Create admin user.
 * @param adminRole - the admin role which grants all permissions
 */
var _ = require("lodash");

exports.create = function (roles, userModel) {
  if (_.isEmpty(sails.config.permissions.adminPassword)) {
    throw new Error('sails.config.permissions.adminPassword is not set');
  }
  if (_.isEmpty(sails.config.permissions.adminEmail)) {
    throw new Error('sails.config.permissions.adminEmail is not set');
  }

  return sails.models.auth.findOne({ email: sails.config.permissions.adminEmail })
    .then(function (user) {
      if (user) return user;

      sails.log.info('sails-permissions: admin user does not exist; creating...');
      return sails.models.auth.create({
        password: sails.config.permissions.adminPassword,
        email: sails.config.permissions.adminEmail,
        roles: [ _.find(roles, { name: 'admin' }).id ],
        createdBy: 1,
        owner: 1,
        model: userModel.id
      }).then(function(auth){
        sails.models.user.create({
          auth: auth.id
        }).then(function(_user){
          sails.models.auth.update({email: sails.config.permissions.adminEmail}, {user: _user.id})
          .then(function(auth){
            sails.log.verbose("AUTH UPDATED ::::")
          })
        })
      });
  });
};
