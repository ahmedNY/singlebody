var _ = require('lodash');


// TODO let users override this in the actual model definition

/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin, config) {
  return Promise.all([
    grantAdminPermissions(roles, models, admin, config),
    grantRegisteredPermissions(roles, models, admin, config),
    grantGroupAdminPermissions(roles, models, admin, config),
  ])
  .then(function (permissions) {
    sails.log.verbose('created', permissions.length, 'permissions');
    return permissions;
  });
};



function grantAdminPermissions (roles, models, admin, config) {
  var adminRole = _.find(roles, { name: 'admin' });

  var permissions = [
    // Group
    {
      model: _.find(models, { name: 'Group' }).id,
      action: 'read',
      role: adminRole.id
    },
    {
      model: _.find(models, { name: 'Group' }).id,
      action: 'create',
      role: adminRole.id
    },
    {
      model: _.find(models, { name: 'Group' }).id,
      action: 'update',
      role: adminRole.id
    },
    {
      model: _.find(models, { name: 'Group' }).id,
      action: 'delete',
      role: adminRole.id
    },
  ];

  return Promise.all(
    permissions.map(function(permission) {
      return sails.models.permission.findOrCreate(permission, permission);
    })
  );
}

function grantRegisteredPermissions (roles, models, admin, config) {
  var registeredRole = _.find(roles, { name: 'registered' });
  var permissions = [
    // Donation model
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'create',
      role: registeredRole.id,
    },
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'update',
      role: registeredRole.id,
      relation: 'owner'
    },
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'delete',
      role: registeredRole.id,
      relation: 'owner'
    },
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'read',
      role: registeredRole.id,
      relation: 'role'
    }
  ];

  return Promise.all(
    permissions.map(function(permission) {
      return sails.models.permission.findOrCreate(permission, permission);
    })
  );
}

function grantGroupAdminPermissions (roles, models, admin, config) {
  var groupAdminRole = _.find(roles, { name: 'groupAdmin' });
  var permissions = [
    // Group model
    {
      model: _.find(models, { name: 'Group' }).id,
      action: 'update',
      role: groupAdminRole.id,
      relation: 'group'
    },
    // Case model
    {
      model: _.find(models, { name: 'Case' }).id,
      action: 'create',
      role: groupAdminRole.id,
    },
    {
      model: _.find(models, { name: 'Case' }).id,
      action: 'update',
      role: groupAdminRole.id,
      relation: 'group'
    },
    {
      model: _.find(models, { name: 'Case' }).id,
      action: 'delete',
      role: groupAdminRole.id,
      relation: 'group'
    },
    // Donation model
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'read',
      role: groupAdminRole.id,
      relation: 'owner'
    },
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'create',
      role: groupAdminRole.id,
    },
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'update',
      role: groupAdminRole.id,
      relation: 'owner'
    },
    {
      model: _.find(models, { name: 'Donation' }).id,
      action: 'delete',
      role: groupAdminRole.id,
      relation: 'owner'
    },
  ];

  return Promise.all(
    permissions.map(function(permission) {
      return sails.models.permission.findOrCreate(permission, permission);
    })
  );
}
