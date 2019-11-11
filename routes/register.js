const router = require("express").Router();
const passport = require("passport");
let User = require("../models/user.model");

router.route("/").post(function(req, res){
	User.register({email: req.body.email}, req.body.password, function(err, user) {
		if (err){
			console.log(err);
			res.redirect("/register");	
		} else {
			passport.authenticate("local", {failureRedirect: "/register"})(req, res, function(){
				console.log("Successful local registration");
				// res.redirect("/");
			});
		}
	});
});
