/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res) {
		Group.findOne({id: req.params.id}).populate("admin").then(function(group) {

			return res.json(group);
		})
	},

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
