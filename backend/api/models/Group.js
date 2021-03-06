/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedBy: false,
  attributes: {
    name: {
      type: "STRING",
      unique: true,
    },
    about: "STRING",
    admins: {
      collection: 'Auth',
      via: "group"
    },
    imageUrl: 'STRING',
    imageFd: 'STRING',
  }
};
