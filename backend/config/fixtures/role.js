/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    sails.models.role.findOrCreate({ name: 'admin' }, { id: 1, name: 'admin', }),
    sails.models.role.findOrCreate({ name: 'groupAdmin' }, { id: 2, name: 'groupAdmin' }),
    sails.models.role.findOrCreate({ name: 'registered' }, { id: 3, name: 'registered' }),
    sails.models.role.findOrCreate({ name: 'public' }, { id: 4, name: 'public' }),
  ]);
};
