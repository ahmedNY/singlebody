module.exports = function(req, res, next) {

	res.locals.authenticated = req.session.authenticated
	// res.locals.user = req.session.user
    return next();
};
