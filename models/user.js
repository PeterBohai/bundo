const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')

const Schema = mongoose.Schema

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 3
	},
	passwordHash: {
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

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User