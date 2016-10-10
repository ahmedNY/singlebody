
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

    Case.findOne({id: req.params.id})
    .then(function(_case){
      if(!_case) {
        return res.notFound("case not found");
      }

      _case.imageUrl = require('util').format('/cases/image/%s', req.params.id);
      _case.imageFd = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');

      _case.save()
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

  Case.findOne({id:req.params.id}).exec(function (err, _case){
    if (err) return res.negotiate(err);
    if (!_case) return res.notFound("case not found");

    // User has no image uploaded.
    // (should have never have hit this endpoint and used the default image)
    if (!_case.imageFd) {
      return res.notFound("no imageFd with this case!");
    }

    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);

    // set the filename to the same file as the file uploaded
    res.set("Content-disposition", "attachment; filename='" + _case.imageFd + "'");
    var uploadDir = require('path').resolve(sails.config.appPath, 'assets/images');
    // Stream the file down
    fileAdapter.read(uploadDir + "/" + _case.imageFd)
    .on('error', function (err){
      return res.serverError(err);
    })
    .pipe(res);
  });
}


});
