const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const request = require("request");
const axios = require("axios");

// set up dotenv, express app, etc.
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({credentials: true, origin: "https://bundo-reviews.herokuapp.com/"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// configure authentication with session and passport
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false})); 
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
const url = process.env.MONGO_ATLAS_URI;
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
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

// account sign ins
let authenticated = false;
let emailError = "";
let authError = "";
let userInfo = {};

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
		userInfo.email = req.user.username;
		userInfo.firstName = req.user.firstName;
		userInfo.lastName = req.user.lastName;
		userInfo.bookmarks = req.user.bookmarks;
		console.log(userInfo);
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
		console.log(req.user);
		res.json({isAuthenticated: true});
	} else {
		console.log("Not Authenticated");
		res.json({isAuthenticated: false});
	}
});

app.get("/check-error", function(req, res){
	res.json({emailErrorMsg: emailError, errorMsg: authError});
});

app.get("/user-info", function(req, res){
	res.json(userInfo);
});

app.post("/save", function(req, res){
	let savedBiz = req.body.targetBusiness;

	if (req.body.save){
		User.findOneAndUpdate({username: userInfo.email}, {$push: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				console.log(err);
			} else {

				console.log("Added a new bookmark to current user!");
				userInfo.bookmarks = result.bookmarks;
				console.log(userInfo.bookmarks);
				// userInfo.bookmarks = req.user.bookmarks;
			}
		});
	} else {
		User.findOneAndUpdate({username: userInfo.email}, {$pull: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				console.log(err);
			} else {

				console.log("Deleted a new bookmark from current user!");
				userInfo.bookmarks = result.bookmarks;
				console.log(userInfo.bookmarks);
				// userInfo.bookmarks = req.user.bookmarks;
			}
		});
	}
	

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

	// make request to YELP
	request(yelpOptions, async function(err, response, body) {
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
				yelpID: business.id,
				error: false,
				name: business.name,
				imageUrl: business.image_url,
				rating: business.rating,
				reviewCount: business.review_count,
				price: business.price,
				address: business.location.display_address,
				phone: business.phone,
				displayPhone: business.display_phone,
				isOpen: availability,
				yelpUrl: business.url,
				latitude: business.coordinates.latitude,
				longitude: business.coordinates.longitude
			});

		});

		// query Google and Facebook
		for (const business of bizData.businesses) {
			let businessPhone = business.phone.toString();
			let placeId = "";

			// request for Google place_id of each business
			let findResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_API_KEY}&input=${"%2B" + businessPhone.slice(1)}&inputtype=phonenumber`)
				.then(function(response){
					placeId = response.data.candidates[0].place_id;
				});
		
			const googleDetailsOptions = {
				params: {
					key: process.env.GOOGLE_API_KEY,
					place_id: placeId,
					fields: "rating,user_ratings_total,url"
				}
			};
			let detailResponse = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", googleDetailsOptions)
				.then(function(bizDetailResponse){
					business.googleRatings = Math.round( bizDetailResponse.data.result.rating * 10 ) / 10;
					business.googleReviewCount = bizDetailResponse.data.result.user_ratings_total;
					business.googleUrl = bizDetailResponse.data.result.url;
					
				});
			
			// request for Facebook place id of each business
			let fbPlaceId = "";
			let fbAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
			let queryName = business.name
			if (business.name.indexOf(" ") !== -1) {
				queryName = business.name.substr(0, business.name.indexOf(" "))
			}

			const fbSearchParams = {
				params: {
					type: "place",
					center: `${business.latitude},${business.longitude}`,
					q: queryName,
					limit: 2,
					access_token: fbAccessToken
				}
			};	
			let fbSearchResponse = await axios.get("https://graph.facebook.com/search", fbSearchParams)
				.then(function(response){
					console.log(response.data);
					fbPlaceId = response.data.data[0].id;
				})
				.catch(function(error) {
					business.error = error.response.status;
					console.log("Error Status Code: " + error.response.status);
				});
			
			if (!business.error) {
				const fbDetailsOptions = {
					params: {
						fields: "overall_star_rating,rating_count,link",
						access_token: fbAccessToken
					}
				};
				let fbDetailResponse = await axios.get(`https://graph.facebook.com/v4.0/${fbPlaceId}`, fbDetailsOptions)
					.then(function(fbBizDetailResponse){
						business.fbRatings = fbBizDetailResponse.data.overall_star_rating;
						business.fbReviewCount = fbBizDetailResponse.data.rating_count;
						business.fbUrl = fbBizDetailResponse.data.link;
					})
					.catch(function(error) {
						business.error = error.response.status;
					});
			}

		}

		// console.log(bizData);
		res.json(bizData);
	});

});

if (process.env.NODE_ENV === "production"){
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}


// start server
app.listen(port, function (){
	console.log(`Server started on port ${port}`);
});
