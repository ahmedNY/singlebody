
module.exports = require('waterlock').waterlocked({
  pluralize: true,

  find: function(req, res) {
    Case.find().populate("donations")
    .then(function(_cases) {
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
      return res.json(_cases);
    });

	},

	findOne: function(req, res) {
		Case.findOne({id: req.params.id})
    .then(function(_case) {
      Donation.find({case: req.params.id})
      .then(function(_donations){
        _case.donorsCount = _donations.length
        var sum = 0
        for(var i = 0; i < _donations.length; i++) {
          sum += _donations[i].amount
        }
        _case.moneyRaised = sum;
        return res.ok(_case);
      })
		});
	},

	create: function(req, res){
		Case.create(req.body).then(function(_case){
			return res.ok(_case);
		})
	},

	update: function(req, res){
		Case.update({id: req.params.id}, req.body).then(function(_cases){
			return res.ok(_cases[0]);
		})
	},

	destroy: function(req, res){
		Case.destroy({id: req.params.id}).then(function(_case){
			return res.ok({id: req.params.caseId});
		})
	},

});
