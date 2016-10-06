/**
 * DonationController
 *
 * @description :: Server-side logic for managing donations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res){
		Jwt.findOne({token: req.headers.access_token}).populate("owner")
      .then(function(jwt) {
        // result.jwt = jwt;
        return Auth.findOne({id: jwt.owner.auth}).populate("donations");
    }).then(function(auth){
			donationCases = auth.donations.map(function(d){
				return d.case
			})
			Case.find({id:donationCases}).populate("donations", {owner: auth.id})
			.then(function(_cases){
				return res.ok(_cases)
			})

		});
	},

	findOne: function(req, res) {
		Donation.findOne({id: req.params.id}).then(function(_dontaion) {
			return res.ok(_dontaion);
		});
	},

	create: function(req, res){
    if(!req.body.case) {
      return res.badRequest("valid case is required on request body")
    }
    Case.findOne(req.body.case).populate('donations')
    .then(function(_case){
      sails.log.error(JSON.stringify(_case));
      if(!_case) {
        return res.notFound("No case with id of " + req.body.case)
      }
      Donation.create(req.body).then(function(_donation){
        _case.donations.add(_donation.id)
        _case.save().then(function(){
          return res.ok(_donation)
        });
      })
    }).catch(function(error){
      sails.log.error(error)
    })
	},

	update: function(req, res){
		if(req.body.case) {
      return res.badRequest("currently you cannot update donation case")
    }
		Donation.update({id: req.params.id}, req.body).then(function(_donation){
			return res.ok(_donation[0]);
		})
	},
	// destroy: function(req, res){
	// 	return res.ok("Not yet implemented!")
	// },
};
