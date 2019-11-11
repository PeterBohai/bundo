const router = require("express").Router();
let User = require("../models/user");

router.route("/").get(function(req, res){
	if (req.isAuthenticated()) {
		User.findById(req.user.id, function(err, currUser){
			if (err) {
				console.log(`Error getting current user: ${err}`);
			} 
			
			else {
				res.json(currUser);
			}
		});
	} else {
		console.log("Error: not logged in!");
	}
	
});

module.exports = router;