const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const request = require("request");

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

const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// routes
const userRouter = require("./routes/account");
const bizRouter = require("./routes/biz");
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
var emailError = "";
var authError = "";

app.post("/register", function(req, res, next) {

	const newUser = new User ({
		username: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	});

	User.register(newUser, req.body.password, function(err, user) {
		if (err){
			console.log(err);
			emailError = "Email already in use, try again.";
			return res.json({isRegistered: false, error: err.name});	
		} 
		
		else {
			emailError = "";
			return res.json({isRegistered: true});
		}
	});

});

app.post("/login", passport.authenticate("local", {failureRedirect: "/login-fail"}), function(req, res) {
	if (req.user) {
		authError = "";
		authenticated = true;
		res.json({isAuthenticated: true});
	} else {
		authError = "Invalid email or password";
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

app.get("/login-fail", function(req, res){
	console.log("/login-fail");
	authError = "Invalid email or password";
	res.json({isAuthenticated: false});
});

app.get("/check-auth", function(req, res){
	emailError = "";
	authError = "";
	if (authenticated) {
		console.log("Authenticated");
		res.json({isAuthenticated: true});
	} else {
		console.log("Not Authenticated");
		res.json({isAuthenticated: false});
	}
});

app.get("/check-error", function(req, res){
	res.json({emailErrorMsg: emailError, errorMsg: authError});
});

app.post("/search", function(req, res){
	let userTerm = req.body.userQueryTerm;
	let userLoc = req.body.userQueryLocation;

	let bizData = {
		businesses: []
	};
	
	const yelpBaseUrl = "https://api.yelp.com/v3/businesses/search";
	const yelpOptions = {
		url: yelpBaseUrl,
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.YELP_API_KEY}`
		},
		qs: {
			term: userTerm,
			location: userLoc
		}
	};

	request(yelpOptions, function(err, response, body) {
		let yelpData = JSON.parse(body);

		yelpData.businesses.forEach(function(business, index) {
			
			// let displayAddress = business.location.display_address.join(", ");
			let availability = "";
			if (business.is_closed) {
				availability = "Closed";
			} else {
				availability = "Open now";
			}
			bizData.businesses.push({
				indexID: index + 1,
				name: business.name,
				imageUrl: business.image_url,
				rating: business.rating,
				reviewCount: business.review_count,
				price: business.price,
				address: business.location.display_address,
				phone: business.display_phone,
				isOpen: availability,
				yelpUrl: business.url
			});
		});

		// request google api and add weighted ratings and total up review count

		res.json(bizData);
	});

});

// start server
app.listen(port, function (){
	console.log(`Server started on port ${port}`);
});
