/**
 * CaseController
 *
 * @description :: Server-side logic for managing cases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){
		return res.ok("api/open, api/restricted, api/jwt ")
	},

	restricted: function(req, res) {
		return res.ok("if you can see this you are authenticated :) ")
	},

	open: function(req, res){
		return res.ok("This action is open!")
	},

	jwt: function(req, res){
		Jwt.findOne({token: req.headers.access_token})
			.then(jwt => {
				Auth.findOne({user: jwt.owner}).then(auth => {
					sails.log.verbose(auth);
				})
		})

		return res.ok(req.headers.access_token)
	},
};
