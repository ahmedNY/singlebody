/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */

var _ = require('lodash');

module.exports = {
  autoCreatedBy: false,

  description: [
    'Defines a particular `action` that a `Role` can perform on a `Model`.',
    'A `User` can perform an `action` on a `Model` by having a `Role` which',
    'grants the necessary `Permission`.'
  ].join(' '),

  attributes: {

    /**
     * The Model that this Permission applies to.
     */
    model: {
      model: 'Model',
      required: true
    },

    action: {
      type: 'string',
      index: true,
      notNull: true,
      /**
       * TODO remove enum and support permissions based on all controller
       * actions, including custom ones
       */
      enum: [
        'create',
        'read',
        'update',
        'delete'
      ]
    },

    relation: {
      type: 'string',
      enum: [
        'role',
        'owner',
        'user',
        'group',
      ],
      defaultsTo: 'role',
      index: true
    },

    /**
     * The Role to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    role: {
      model: 'Role',
      // Validate manually
      //required: true
    },

    /**
     * The User to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    user: {
      model: 'Auth'
      // Validate manually
    },

    /**
     * A list of criteria.  If any of the criteria match the request, the action is allowed.
     * If no criteria are specified, it is ignored altogether.
     */
    criteria: {
      collection: 'Criteria',
      via: 'permission'
    }
  },

  usersPermissions: function(authId, cb) {
    Auth.findOne({id: authId}).populate("roles")
    .exec(function(err, auth){
      if (err) return cb(err);
      if(!auth) return cb(new Error("no auth with id " + authId))
      var result = {};
      result.id = auth.id;
      result.email = auth.email;
      result.group = auth.group;
      result.name = auth.name;
      var roles = auth.roles.map(function(role){return role.name});
      result.roles = roles;
      var rolesIds = auth.roles.map(function(role){return role.id});
      Permission.find(
        { where: { or: [ {role: rolesIds}, {user: auth.id} ]},
          sort: "model" })
      .populate("model").exec(function(error, perms){
        if (err) return cb(err);
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
        return cb(null, result);
      })
    })
  },

  afterValidate: [
    function validateOwnerCreateTautology (permission, next) {
      if (permission.relation == 'owner' && permission.action == 'create') {
        next(new Error('Creating a Permission with relation=owner and action=create is tautological'));
      }

      if (permission.action === 'delete' &&
              _.filter(permission.criteria, function (criteria) { return !_.isEmpty(criteria.blacklist); }).length) {
        next(new Error('Creating a Permission with an attribute blacklist is not allowed when action=delete'));
      }

      if (permission.relation == 'user' && permission.user === "") {
        next(new Error('A Permission with relation user MUST have the user attribute set'));
      }

      if (permission.relation == 'role' && permission.role === "") {
        next(new Error('A Permission with relation role MUST have the role attribute set'));
      }

      next();
    }
  ]
};
