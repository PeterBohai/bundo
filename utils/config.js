require('dotenv').config()

const PORT = process.env.PORT
const NODE_ENV =  process.env.NODE_ENV
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI
const SECRET = process.env.SECRET

const YELP_API_KEY = process.env.YELP_API_KEY
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

module.exports = {
	PORT,
	NODE_ENV,
	MONGO_ATLAS_URI,
	SECRET,
	YELP_API_KEY,
	GOOGLE_API_KEY,
	FACEBOOK_APP_ID,
	FACEBOOK_APP_SECRET
}
