const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// set up dotenv, express app, etc.
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// configure authentication with session and passport
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false})); 
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
const url = process.env.MONGO_ATLAS_URI;
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once("open", function() {
	console.log("MongoDB connection established successfully");
});

const User = require("./models/user.model");

passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// OAuth strategies
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/google/bundo"
},
function(accessToken, refreshToken, profile, cb) {
	User.findOrCreate({googleID: profile.id}, function (err, user) {
		return cb(err, user);
	});
}
));

// routes
const userRouter = require("./routes/account");
const bizRouter = require("./routes/biz");
const registerRouter = require("./routes/register");
app.use("/account", userRouter);
// app.use("/register", registerRouter);
app.use("/biz", bizRouter);

const path = require("path");

// app.get("/", function(req, res){
// 	if (req.user) {
// 		console.log("Logged in Homepage!");
// 		res.sendFile(path.resolve("../client/public/testHome.html"));
// 	} else {
// 		console.log("Not logged in version of the homepage");
// 		res.sendFile(path.resolve("../client/public/testHome.html"));
// 	}
// });

// account sign ins
var authenticated = false;

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/bundo", 
	passport.authenticate("google", {failureRedirect: "/login"}),
	function(req, res) {
		res.redirect("/");
	});

app.post("/register", function(req, res) {

	User.register({username: req.body.email}, req.body.password, function(err, user) {
		if (err){
			console.log(err);
			res.redirect("/register");	
		} else {
			const firstN = req.body.firstName;
			const lastN = req.body.lastName;
			// add first and last name
			User.updateOne({username: req.body.email}, {firstName: firstN, lastName: lastN}, {upsert: true}, function(error, result){
				if (error){
					console.log(`Error updating user info when registering: ${error}`);
				} else {
					console.log("Successfully added in first and last name of user.");
				}
			});
			passport.authenticate("local", {failureRedirect: "/register"});
		}
	});

});

app.post("/login", passport.authenticate("local", {failureRedirect: "/check-auth"}), function(req, res) {
	if (req.user) {
		console.log("here");
		authenticated = true;
		res.json({isAuthenticated: true});
	} else {
		authenticated = false;
		res.json({isAuthenticated: false});
	}

});

app.get("/logout", function(req, res){
	req.logOut();
	if (req.user) {
		authenticated = true;
		res.json({isAuthenticated: true});
	} else {
		authenticated = false;
		res.json({isAuthenticated: false});
	}
});

app.get("/check-auth", function(req, res){
	if (authenticated) {
		console.log("Authenticated");
		res.json({isAuthenticated: true});
	} else {
		console.log("Not Authenticated");
		res.json({isAuthenticated: false});
	}
});

// start server
app.listen(port, function (){
	console.log(`Server started on port ${port}`);
});
