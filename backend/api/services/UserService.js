module.exports = {
  getUser: function(req) {
    return Jwt.findOne({token: req.headers.access_token}).populate("owner")
      .then(function(jwt) {
        return Auth.findOne({id: jwt.owner.auth});
    }).then(function(auth){
      return auth;
    });
  }
}
