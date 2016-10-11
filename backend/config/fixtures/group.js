/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    sails.models.group.findOrCreate({ id: '1' }, {
      id: 1,
      name: "كالجسد الواحد",
      owner: 1,
    }),
  ]);
};
