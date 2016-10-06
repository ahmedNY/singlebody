
module.exports = require('waterlock').waterlocked({
  pluralize: true,

  find: function(req, res) {
    Case.find().populate('donations').then(function(cases) {
			return res.ok(cases);
		});
	},

	findOne: function(req, res) {
		Case.findOne({id: req.params.id}).populate('donations').then(function(_case) {
			return res.ok(_case);
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
