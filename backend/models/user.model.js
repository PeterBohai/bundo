const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	location: String,
	email: String,
	password: String,
	googleID: String,
	facebookID: String,
	bookmarks: Array
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/"
},
function(accessToken, refreshToken, profile, cb) {
	User.findOrCreate({googleId: profile.id}, function (err, user) {
		return cb(err, user);
	});
}
));
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: "http://localhost:3000/"
},
function (accessToken, refreshToken, profile, cb) {
	User.findOrCreate({facebookId: profile.id}, function (err, user) {
		return cb(err, user);
	});
}
));

module.exports = User;