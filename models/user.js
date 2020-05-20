const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')

const Schema = mongoose.Schema

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		minlength: 3
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	location: String,
	bookmarks: [Object]		// change to string (Yelp ID)
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)

module.exports = User