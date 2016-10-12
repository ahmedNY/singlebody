/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res) {
		Group.findOne({id: req.params.id})
		.populate("admins")
		.then(function(group) {
			return res.json(group);
		})
	},

	create: function(req, res) {
		// checking admins
		if(!req.body.admins) {
			return res.badRequest("admins array is missing from request body")
		}

		var group, role = null;
		// check if any of the admins does belong to other groups
		Auth.find({id: req.body.admins}).then(function(users){
			for (var i = 0; i < users.length; i++) {
				var user = users[i];
				if(user.group > 0) {
					var userName = user.name || user.email;
					return res.badRequest("user [" + userName + "] is already belong to group [" + user.group + "]" )
				}
			}

			Group.create({name: req.body.name, about: req.body.about})
			.then(function(_group) {
				group = _group;
				Role.findOne({name: "groupAdmin"})
				.then(function(_role) {
					role = _role;
					var actinos=[]
					for (var i = 0; i < req.body.admins.length; i++) {
						var adminId = req.body.admins[i]
						role.users.add(adminId);
						actinos.push(Auth.update({id: adminId}, {group: group.id}));
					}
					actinos.push(role.save());

					Promise.all(actinos)
					.then(function() {
						return res.ok(group);
					})
				})
			}).catch(function(e) {
				return res.badRequest(e.message);
			})
		})
			.catch(function(error) {
				return res.badRequest(error);
			});
	},

	update: function(req, res) {
		// check if admins has changed
		if(req.body.admins) {
			Group.findOne({id: req.params.id})
			.populate("admins")
			.then(function(group) {
				// get the group admin role
				Role.findOne({name: "groupAdmin"})
				.then(function(role) {
					var currentAdmins  = group.admins.map(function(a) {return a.id});
					var updatedAdmins = req.body.admins;
					// get new and removed admins by compareing currentAdmins with admins of request
					// getting removed admins
					sails.log.verbose("----/\------------------/\------")
					sails.log.verbose(JSON.stringify(currentAdmins))
					sails.log.verbose(JSON.stringify(updatedAdmins))
					sails.log.verbose("--------------\/\/---------------")
					for (var i = 0; i < currentAdmins.length; i++) {
						var currentAdminId = currentAdmins[i];
						// if admin removed from group
						if(updatedAdmins.indexOf(currentAdminId) < 0) {
							role.users.remove(currentAdminId);
							sails.log.verbose("removing ", currentAdminId)
						}
					}
					// getting the newly added admins
					for (var i = 0; i < updatedAdmins.length; i++) {
						var updatedAdminId = updatedAdmins[i];
						// if admin added to group
						if(currentAdmins.indexOf(updatedAdminId) < 0){
							role.users.add(updatedAdminId);
							sails.log.verbose("adding ", updatedAdminId)
						}
					}

					sails.log.verbose("saving ...")
					//Saving updated role
					role.save().then(function() {
						// update the group,
						Group.update({id: req.params.id}, req.body)
						.then(function(group) {
							sails.log.verbose("saved :)")
							return res.ok(group);
						})
						.catch(function(error) {
							return(res.badRequest(error.message))
						})
					})

				})
			})
		}

		else {
			// update the group,
			Group.update({id: req.params.id}, req.body)
			.then(function(group) {
				return res.ok(group);
			})
			.catch(function(error) {
				return(res.badRequest(error.message))
			})
		} //else


	},

//**********************************************************
//**********************************************************
//**********************************************************

	// update: function(req, res) {
	// 	// get the list of new admins and compare it to current admins
	// 	// give newly admins group id and give them group permissions
	// 	// set group id to null for removed admins and remove groupaAmin role
	//
	// 	// check for admins
	// 	// checking admins
	// 	if(req.body.admins) {
	// 		// get group current admins
	// 		Group.findOne({id: req.params.id})
	// 		.populate("admins")
	// 		.then(function(group) {
	// 			var currentAdmins  = group.admins.map(function(a) {return a.id});
	// 			var updatedAdmins = req.body.admins;
	// 			// get new and removed admins by compareing currentAdmins with admins of request
	// 			// getting removed admins
	// 			var removedAdmins = [];
	// 			for (var i = 0; i < currentAdmins.length; i++) {
	// 				var currentAdminId = currentAdmins[i];
	// 				// if admin removed from group
	// 				if(updatedAdmins.indexOf(currentAdminId) < 0) {
	// 						removedAdmins.push(currentAdminId)
	// 				}
	// 			}
	// 			// getting the newly added admins
	// 			var newAdmins = [];
	// 			for (var i = 0; i < updatedAdmins.length; i++) {
	// 				var updatedAdminId = updatedAdmins[i];
	// 				// if admin added to group
	// 				if(currentAdmins.indexOf(updatedAdminId) < 0){
	// 					newAdmins.push(updatedAdminId);
	// 				}
	// 			}
	// 			Role.findOne({name: "groupAdmin"})
	// 			.then(function(role) {
	// 				// remove role from removed admins
	// 				for (var i = 0; i < removedAdmins.length; i++) {
	// 					role.users.remove(removedAdmins[i]);
	// 				}
	// 				// adding roles to newly added admins
	// 				for (var i = 0; i < newAdmins.length; i++) {
	// 					role.users.add(newAdmins[i]);
	// 				}
	// 				role.save().then(function() {
	// 					// update group
	// 					Group.update({id: req.params.id}, req.body)
	// 					.then(function(group) {
	// 						return res.ok(group);
	// 					})
	// 					.catch(function(error) {
	// 						return(res.badRequest(error.message))
	// 					})
	// 					return res.json({group: group, status:{new: newAdmins, removed: removedAdmins}});
	// 				})
	// 			})
	// 		})
	// 	}
	// },

	uploadImage: function (req, res) {
  var uploadDir = require('path').resolve(sails.config.appPath, 'assets/images');
  req.file('image').upload({
    // don't allow the total upload size to exceed ~10MB
    maxBytes: 10000000,
    //Uploading to a custom folder
    dirname: uploadDir,
  },function whenDone(err, uploadedFiles) {
    if (err) {
      return res.negotiate(err);
    }

    // If no files were uploaded, respond with an error.
    if (uploadedFiles.length === 0){
      return res.badRequest('No file was uploaded');
    }

    Group.findOne({id: req.params.id})
    .then(function(group){
      if(!group) {
        return res.notFound("group not found");
      }

      group.imageUrl = require('util').format('/groups/image/%s', req.params.id);
      group.imageFd = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');

      group.save()
        .then(function(){
          return res.ok();
        }).catch(function(error){
          return res.negotiate(err);
        });
      })
    });
  },

  image: function (req, res){

	  req.validate({
	    id: 'integer'
	  });

	  Group.findOne({id:req.params.id}).exec(function (err, group){
	    if (err) return res.negotiate(err);
	    if (!group) return res.notFound("group not found");

	    // User has no image uploaded.
	    // (should have never have hit this endpoint and used the default image)
	    if (!group.imageFd) {
	      return res.notFound("no imageFd with this group!");
	    }

	    var SkipperDisk = require('skipper-disk');
	    var fileAdapter = SkipperDisk(/* optional opts */);

	    // set the filename to the same file as the file uploaded
	    res.set("Content-disposition", "attachment; filename='" + group.imageFd + "'");
	    var uploadDir = require('path').resolve(sails.config.appPath, 'assets/images');
	    // Stream the file down
	    fileAdapter.read(uploadDir + "/" + group.imageFd)
	    .on('error', function (err){
	      return res.serverError(err);
	    })
	    .pipe(res);
	  });
	},

};
