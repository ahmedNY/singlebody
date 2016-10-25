describe('PermissionModel', function() {

  describe('#usersPermissions()', function() {
    it('check usersPermissions function', function (done) {
      Permission.usersPermissions(1, function(err, permissions) {
        if(err) return done(err)
        var obj = {
		  "id": 1, "email": "admin@singlebody.sd",
		  "group": 1, "roles": [ "admin", "groupAdmin", "registered"],
		  "permissions": [
		    {
		      "model": "Case",
		      "role": [ "create" ],
		      "group": [ "update", "delete" ]
		    },
		    {
		      "model": "Donation",
		      "owner": [ "delete", "delete", "update", "read", "update" ],
		      "role": [ "read", "create", "create" ]
		    },
		    {
		      "model": "Group",
		      "role": [ "read", "create", "update", "delete" ],
		      "group": ["update"]
		    }
		  ]
		}
        if(JSON.stringify(permissions) !== JSON.stringify(obj))
        	return done(new Error("permissions not as expected"))
        done()
      })
    });
  });

});
