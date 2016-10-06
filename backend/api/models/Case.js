/**
 * Case.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: 'string',
    summary: 'string',
    story: 'string',
    city: 'string',
    section: 'string',
    moneyRaised: 'integer',
    moneyRequired: 'integer',
    daysRemaining: 'integer',
    donorsCount: 'integer',
    category: 'string',
    groupName: 'string',
    image: 'string',
    owner: "integer",
    createdBy: "integer",
    donations: {
      collection: "Donation"
    }
  }
};
