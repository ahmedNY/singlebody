/**
 * TODO - this is setting createdBy, not owner.
 * The comment below, and the name of this file/function is confusing to me
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {

  if (!req.user || !req.user.id) {
    sails.log.warn('User not found in request');

    Jwt.findOne({token: req.headers.access_token})
    .then(jwt => {
      Auth.findOne({user: jwt.owner}).then(user => {
        req.user = user;
        sails.log.warn('user:' + user);

        if ('POST' == req.method) {
          req.body.createdBy = req.user.id;
          req.body.owner = req.user.id;
        }

        next();
      })
    }).catch( () => {
        return res.send(500, new Error('req.user is not set'));
    } )
  }

};
