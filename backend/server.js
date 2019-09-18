const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");


// set up dotenv, express app, etc.
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

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

let User = require("../models/user.model");

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
app.use("/account", userRouter);
const bizRouter = require("./routes/biz");
app.use("/biz", bizRouter);

// account sign ins
app.post("/register", function(req, res) {
	User.register({username: req.body.username}, req.body.password, function(err, user) {
		if (err){
			console.log(err);
			res.redirect("/register");	
		} else {
			
			passport.authenticate("local", {failureRedirect: "/register"})(req, res, function(){
				console.log("Successful local registration");
				res.redirect("/");
			});
		}
	});
	
});

app.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), function(req, res){
	res.redirect("/");
});

// start server
app.listen(port, function (){
	console.log(`Server started on port ${port}`);
});
