/**
 * Criteria.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedBy: false,

    description: 'Specifies more granular limits on a permission',

    attributes: {
      where: 'json',
      blacklist: 'array',
      permission: {
          model: 'Permission'
      }
    }

};
