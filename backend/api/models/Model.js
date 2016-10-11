/**
 * Model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: true,
  autoCreatedBy: false,

  attributes: {
    name: {
      type: 'string',
      notNull: true,
      unique: true
    },
    identity: {
      type: 'string',
      notNull: true
    },
    // attributes: {
    //   type: 'json'
    // },
    permissions: {
      collection: 'Permission',
      via: 'model'
    }
  }

};
