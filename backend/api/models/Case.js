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
  findWithDonatinos: function(options, cb) {
    console.log(options);
    var filter = {};
    var groupFilter = {};
    if(options.keyWords) {
      var arrayKeyWords = options.keyWords.split(',');
      const properties = ["story", "title", "summary", "city", "section", "category"];
      // filter.where = {summary : {contains: "pounds"}};
      filter.where = {or:[]};
      groupFilter.where = {or:[]};
      for (var j = 0; j < arrayKeyWords.length; j++) {
        for (var i = 0; i < properties.length; i++) {
          filter.where.or.push({[properties[i]]: {contains: arrayKeyWords[j]}});
        }
        groupFilter.where.or.push({groupName: {contains: arrayKeyWords[j]}})
      }
    }

    // get the cases count: used in pagination
    Case.count(filter).exec(function(err, caseCount) {
      // then get the case
      Case.find(filter)
      .paginate({page: options.page, limit: options.limit})
      .populate("donations")
      .populate("group", groupFilter)
      .exec(function(err, _cases) {
          if(err) return cb(err)
          for (var i = 0; i < _cases.length; i++) {
              _case = _cases[i];
              _case.donorsCount = _case.donations.length
              var moneyRaised = 0;
              var moneyPromised = 0;
              for(var j = 0; j < _case.donations.length; j++) {
                if(_case.donations[j].isPromise)
                  moneyPromised += _case.donations[j].amount
                else
                  moneyRaised += _case.donations[j].amount
              }
              _case.moneyRaised = moneyRaised;
              _case.moneyPromised = moneyPromised;
              _case.donations = undefined;
          }
          return cb(null, {cases:_cases, count: caseCount});
      });
    })
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
        var moneyRaised = 0
        var moneyPromised = 0;
        for(var i = 0; i < _donations.length; i++) {
          if(_donations[i].isPromise)
            moneyPromised += _donations[i].amount
          else
            moneyRaised += _donations[i].amount
        }
        _case.moneyRaised = moneyRaised;
        _case.moneyPromised = moneyPromised;

        return cb(err, _case);
      })
    });
  },

};
