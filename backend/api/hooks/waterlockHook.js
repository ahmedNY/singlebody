module.exports = function myBasicHook(sails) {
   return {
		initialize: function(cb) {
			var waterlock = global.waterlock;
			waterlock.cycle.loginSuccess = function(req, res, user) {
				waterlock.logger.debug('user login success');
				if (!user) {
				  waterlock.logger.debug('loginSuccess requires a valid user object');
				  return res.serverError();
				}

				var address = this._addressFromRequest(req);

				var attempt = {
				  user: user.id,
				  successful: true
				};

				_.merge(attempt, address);

				waterlock.Attempt.create(attempt).exec(function(err) {
				  if (err) {
				    waterlock.logger.debug(err);
				  }
				});

				// store user in && authenticate the session
				req.session.user = user;
				req.session.authenticated = true;


				var params = waterlock._utils.allParams(req);
				if(params.type === "local") {
					var contentType = req.headers['content-type'];

					if(contentType === "application/json") {
						// REST CLIENT return JWT

						//Returns the token immediately
						var jwtData = waterlock._utils.createJwt(req, res, user);

						Jwt.create({token: jwtData.token, uses: 0, owner: user.id}).exec(function(err){
						  if(err){
						    return res.serverError('JSON web token could not be created');
						  }

						  var result = {};

						  result[waterlock.config.jsonWebTokens.tokenProperty] = jwtData.token;
						  result[waterlock.config.jsonWebTokens.expiresProperty] = jwtData.expires;

						  if (waterlock.config.jsonWebTokens.includeUserInJwtResponse) {
						    result['user'] = user;
						  }

						  return res.json(result);
						});
						
					} else {
						// redirect to home
						if(params.redirectUrl)
							return res.redirect("/" + params.redirectUrl);
						else
							return res.redirect('/')
					}
				}

				if(params.type === "facebook") {
					return res.redirect('/auth/login-success')
				}
			}
		   // Do some stuff here to initialize hook
		   // And then call `cb` to continue
		   return cb();

		}
   };
}
