/**
 * RolePolicy
 * @depends PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * Verify that User is satisfactorily related to the Object's owner.
 * By this point, we know we have some permissions related to the action and object
 * If they are 'owner' permissions, verify that the objects that are being accessed are owned by the current user
 */
var _  = require('lodash')

module.exports = function(req, res, next) {
  var permissions = req.permissions;
  var relations = _.groupBy(permissions, 'relation');
  var action = PermissionService.getMethod(req.method);

  // continue if there exist role Permissions which grant the asserted privilege
  if (!_.isEmpty(relations.role)) {
    return next();
  }
  if (req.options.unknownModel) {
    return next();
  }

  PermissionService.findTargetObjects(req)
    .then(function(objects) {
        // PermissionService.isAllowedToPerformAction checks if the user has 'user' based permissions (vs role or owner based permissions)
      return PermissionService.isAllowedToPerformAction(objects, req.user, action, ModelService.getTargetModelName(req), req.body)
        .then(function(hasUserPermissions) {
          if (hasUserPermissions) {
            return next();
          }

          if(!_.isEmpty(relations.owner)){
            if (PermissionService.hasForeignObjects(objects, req.user)) {
              return res.send(403, {
                error: 'Cannot perform action [' + action + '] on foreign object'
              });
            }
            next();
          }

          if(!_.isEmpty(relations.group)){
            if (PermissionService.hasAlienObjects(objects, req.user)) {
              return res.send(403, {
                error: 'Cannot perform action [' + action + '] on alien object'
              });
            }
            next();
          }

        });

    })
    .catch(next);
};
