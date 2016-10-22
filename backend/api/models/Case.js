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
    // moneyRaised: 'integer',
    moneyRequired: 'integer',
    daysRemaining: 'integer',
    // donorsCount: 'integer',
    category: 'string',
    // groupName: 'string',
    imageUrl: 'string',
    imageFd: 'string',
    owner: "integer",
    createdBy: "integer",
    group: {
      model: "group"
    },
    donations: {
      collection: "Donation"
    },
  },


  // Custom methods
  findWithDonatinos: function(cb) {
    Case.find()
    .populate("donations")
    .populate("group")
    .exec(function(err, _cases) {
        if(err) return cb(err)
        for (var i = 0; i < _cases.length; i++) {
            _case = _cases[i];
            _case.donorsCount = _case.donations.length
            var sum = 0
            for(var j = 0; j < _case.donations.length; j++) {
              sum += _case.donations[j].amount
            }
            _case.moneyRaised = sum;
            _case.donations = undefined;
        }
        return cb(null, _cases);
    });
  },

  findOneWithDonatinos: function(caseId, cb) {
    Case.findOne({id: caseId})
    .populate("group")
    .then(function(_case) {
      if(!_case) return cb("case not found");

      Donation.find({case: caseId})
      .exec(function(err, _donations) {
        if(err) return cb(err)

        _case.donorsCount = _donations.length
        var sum = 0
        for(var i = 0; i < _donations.length; i++) {
          sum += _donations[i].amount
        }
        _case.moneyRaised = sum;
        return cb(err, _case);
      })
    });
  },

};
