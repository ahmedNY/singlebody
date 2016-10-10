var permissionPolicies = [
  // 'passport',
  'sessionAuth',
  'ModelPolicy',
  'OwnerPolicy',
  'PermissionPolicy',
  'RolePolicy'
];

var path = require("path");
var _ = require("lodash");
// var Marlinspike = require("marlinspike");

var sails;
module.exports  = function permissions(_sails){
    sails = _sails;
    return {
      defaults: defaults,
      configure: configure,
      initialize: initialize,
  }
}

function defaults() {

}

function configure() {
  if (!_.isObject(sails.config.permissions)) sails.config.permissions = { }

  /**
   * Local cache of Model name -> id mappings to avoid excessive database lookups.
   */
  sails.config.blueprints.populate = false
}

function initialize(next) {
  var config = sails.config.permissions

  installModelOwnership()
  sails.after(config.afterEvent, function(){
    if (!validateDependencies()) {
      sails.log.error('Cannot find sails-auth hook. Did you "npm install sails-auth --save"?')
      sails.log.error('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions')
      return sails.lower()
    }

    if (!validatePolicyConfig()) {
      sails.log.warn('One or more required policies are missing.')
      sails.log.warn('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions')
    }

  })

  sails.after('hook:orm:loaded', function(){
    sails.models.model.count()
      .then(function(count) {
        if (count === _.keys(sails.models).length) return next()

        return initializeFixtures()
          .then(function() {
            next()
          })
      })
      .catch(function(error){
        sails.log.error(error)
        next(error)
      })
  })
}

function validatePolicyConfig() {
  var policies = sails.config.policies
  return _.all([
    _.isArray(policies['*']),
    _.intersection(permissionPolicies, policies['*']).length === permissionPolicies.length,
    policies.AuthController && _.contains(policies.AuthController['*'], 'passport')
  ])
}

function installModelOwnership() {
  var models = sails.models
  if (sails.config.models.autoCreatedBy === false) return

  _.each(models, function(model) {
    if (model.autoCreatedBy === false) return

    _.defaults(model.attributes, {
      createdBy: {
        model: 'User',
        index: true
      },
      owner: {
        model: 'User',
        index: true
      }
    })
  })
}

function initializeFixtures() {
  var fixturesPath = path.resolve(__dirname, '../../../config/fixtures/')
  var models, roles;
  return require(path.resolve(fixturesPath, 'model')).createModels()
    .then(function(_model) {
      models = _model;
      sails.hooks.permissions._modelCache = _.indexBy(models, 'identity')

      return require(path.resolve(fixturesPath, 'role')).create()
    })
    .then(function(_roles) {
      roles = _roles
      var userModel = _.find(models, { name: 'User' })
      return require(path.resolve(fixturesPath, 'user')).create(roles, userModel)
    })
    .then(function() {
      return sails.models.auth.findOne({ email: sails.config.permissions.adminEmail })
    })
    .then(function(user) {
      sails.log('sails-permissions: created admin user:', user)
      user.createdBy = user.id;
      user.owner = user.id;
      user.roles.add(_.find(roles, { name: 'admin' }).id);
      delete user.password
      return user.save()
    })
    .then(function(admin) {
      return require(path.resolve(fixturesPath, 'permission')).create(roles, models, admin, sails.config.permissions);
    })
    .then(function(){
      sails.log.debug(" Adding sample cases")
      return require(path.resolve(fixturesPath, 'case')).create()
    })
    .catch(function(error) {
      sails.log.error(error)
    })
}

function validateDependencies() {
  return !!sails.hooks.auth;
}
