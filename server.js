require('dotenv').config()
const axios = require('axios')
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')
const path = require('path')

const userRouter = require('./routes/account')
const bizRouter = require('./routes/biz')
const User = require('./models/user')

const app = express()
morgan.token('body', req =>  {
	const logBody = req.body
	if (logBody.password) {
		logBody.password = '*'.repeat(logBody.password.length)
	}
	return JSON.stringify(logBody, null, 4)
})

app.use(cors({credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('client/build'))		// Serve static React build for 3001 or production url
app.use(morgan('\n:method | path: :url | status: :status | :res[content-length] - :response-time ms \nbody: :body\n'))

// configure authentication with session and passport
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false})) 
app.use(passport.initialize())
app.use(passport.session())

const mongoAtlasUrl = process.env.MONGO_ATLAS_URI
mongoose.connect(mongoAtlasUrl, {
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false}
)
	.then(() => {
		console.log('Connected to MongoDB Atlas')
	})
	.catch(err => {
		console.log('Error connecting to MongoDB Atlas: ', err.message)
	})

passport.use(User.createStrategy())
passport.serializeUser(function(user, done) {
	done(null, user.id)
})
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user)
	})
})

// routes
// app.use("/register", registerRouter);
app.use('/account', userRouter)
app.use('/biz', bizRouter)

// account sign ins
let authenticated = false
let emailError = ''
let authError = ''
let userInfo = {}

app.get('/logout', (req, res) =>{
	req.logOut()
	if (req.user) {
		authenticated = true
		res.json({isAuthenticated: true})
	} else {
		authenticated = false
		res.json({isAuthenticated: false})
	}
})

app.get('/login-fail', (req, res) => {
	console.log('/login-fail')
	authError = 'Invalid email or password'
	res.json({isAuthenticated: false})
})

app.get('/check-auth', (req, res) => {
	emailError = ''
	authError = ''
	if (authenticated) {
		console.log('Authenticated')
		console.log(req.user)
		res.json({isAuthenticated: true})
	} else {
		console.log('Not Authenticated')
		res.json({isAuthenticated: false})
	}
})

app.get('/check-error', (req, res) => {
	res.json({emailErrorMsg: emailError, errorMsg: authError})
})

app.get('/user-info', (req, res) => {
	res.json(userInfo)
})

app.post('/register', (req, res, next) => {

	const newUser = new User ({
		username: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	})

	User.register(newUser, req.body.password, function(err, user) {
		if (err){
			console.log(err)
			emailError = 'Email already in use, try again.'
			return res.json({isRegistered: false, error: err.name})	
		} 
		
		else {
			emailError = ''
			return res.json({isRegistered: true})
		}
	})

})

app.post('/login', passport.authenticate('local', {failureRedirect: '/login-fail'}), (req, res) => {
	if (req.user) {
		authError = ''
		authenticated = true
		res.json({isAuthenticated: true})
		userInfo.email = req.user.username
		userInfo.firstName = req.user.firstName
		userInfo.lastName = req.user.lastName
		userInfo.bookmarks = req.user.bookmarks
		console.log(userInfo)
	} else {
		authError = 'Invalid email or password'
		authenticated = false
		res.json({isAuthenticated: false})
	}

})

app.post('/save', (req, res) => {
	let savedBiz = req.body.targetBusiness

	if (req.body.save){
		User.findOneAndUpdate({username: userInfo.email}, {$push: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				console.log(err)
			} else {

				console.log('Added a new bookmark to current user!')
				userInfo.bookmarks = result.bookmarks
				console.log(userInfo.bookmarks)
				// userInfo.bookmarks = req.user.bookmarks;
			}
		})
	} else {
		User.findOneAndUpdate({username: userInfo.email}, {$pull: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				console.log(err)
			} else {

				console.log('Deleted a new bookmark from current user!')
				userInfo.bookmarks = result.bookmarks
				console.log(userInfo.bookmarks)
				// userInfo.bookmarks = req.user.bookmarks;
			}
		})
	}
	

})

app.post('/search', (req, res, next) => {
	const searchBody = req.body
	let bizData = { businesses: [] }

	// make request to YELP
	axios.get('https://api.yelp.com/v3/businesses/search', {
		headers: {
			Authorization: `Bearer ${process.env.YELP_API_KEY}`
		},
		params: {
			term: searchBody.userQueryTerm,
			location: searchBody.userQueryLocation,
			limit: 12
		}
	})
		.then(response =>  {	
			const yelpData = response.data
			yelpData.businesses.forEach((business, index) => {
				// let displayAddress = business.location.display_address.join(", ");
				let availability = ''
				if (business.is_closed) {
					availability = 'Closed'
				} else {
					availability = 'Open now'
				}

				bizData.businesses.push({
					indexID: index + 1,
					yelpID: business.id,
					error: false,
					name: business.name,
					imageUrl: business.image_url,
					yelpRating: business.rating,
					yelpReviewCount: business.review_count,
					price: business.price,
					address: business.location.display_address,
					phone: business.phone,
					displayPhone: business.display_phone,
					isOpen: availability,
					yelpUrl: business.url,
					latitude: business.coordinates.latitude,
					longitude: business.coordinates.longitude
				})

			})
			
			return bizData
		})
		.then(async (filledBizData) => { 
			await Promise.all(filledBizData.businesses.map( async (biz) => {
				
				// query Google Places API (search for place_id first and then get Details data)
				const phoneInput = '%2B' + biz.phone.slice(1)
				await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_API_KEY}&input=${phoneInput}&inputtype=phonenumber`)
					.then(response => {
						
						if (response.data.status === 'OK' && response.data.candidates.length >= 0) {
							return response.data.candidates[0].place_id
						} 
						else {
							console.log('\nGOOGLE: Failed to find business using phone number\n', response.data, '\n')
							console.log('Attempting to look for GOOGLE place_id again with business name')
						
							return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_API_KEY}&input=${biz.name}&inputtype=textquery`)
								.then(response => {
									if (response.data.status === 'OK' && response.data.candidates.length >= 0) {
										return response.data.candidates[0].place_id
									} else {
										console.log('\nGOOGLE: Failed to find business using biz name\n', response.data, '\n')
									}
								})
								.catch(err => {
									console.log('GOOGLE Place Search ERROR:\n', err, '\n')
									next(err)
								})
						}
					})
					.then(async (googlePlaceId) => {
						await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
							params: {
								key: process.env.GOOGLE_API_KEY,
								place_id: googlePlaceId,
								fields: 'rating,user_ratings_total,url,formatted_phone_number'
							}
						})
							.then(detailsResponse => {
								biz.googleRating = Math.round( detailsResponse.data.result.rating * 10 ) / 10
								biz.googleReviewCount = detailsResponse.data.result.user_ratings_total
								biz.googleUrl = detailsResponse.data.result.url
		
								// set phone number of business if Yelp couldn't find a phone number for it
								if (biz.displayPhone === undefined || biz.displayPhone.length === 0 ) {
									biz.displayPhone = detailsResponse.data.result.formatted_phone_number
								}
							})
							.catch(err => {
								console.log('GOOGLE Place Details ERROR:\n', err, '\n')
								next(err)
							})

					})
					.catch(err => {
						console.log('GOOGLE Place Search/Detials ERROR:\n', err, '\n')
						next(err)
					})
			
				
				
				// query Facebook Grpahs API (search for id first then get Information data)
				const fbAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
				let queryName = biz.name
				if (biz.name.indexOf(' ') !== -1) {
					queryName = biz.name.substr(0, biz.name.indexOf(' '))
				}
	
				await axios.get('https://graph.facebook.com/search', {
					params: {
						type: 'place',
						center: `${biz.latitude},${biz.longitude}`,
						q: queryName,
						limit: 2,
						access_token: fbAccessToken
					}
				})
					.then(response => {
						return response.data.data[0].id
					})
					.then(async (fbPlaceId) => {
						await axios.get(`https://graph.facebook.com/v7.0/${fbPlaceId}`, {
							params: {
								fields: 'overall_star_rating,rating_count,link',
								access_token: fbAccessToken
							}
						})
							.then(infoResponse => {
								biz.fbRating = infoResponse.data.overall_star_rating
								biz.fbReviewCount = infoResponse.data.rating_count
								biz.fbUrl = infoResponse.data.link
							})
							.catch(err => {
								biz.error = err.response.status
								console.log('GOOGLE Places Search ERROR:\n', err, '\n')
								console.log('FACEBOOK Places Information ERROR:\n', 'status - ' + err.response.status, '\n',
									'status text- ' + err.response.statusText, '\n')
								next(err)
							})
					})
					.catch(err => {
						biz.error = err.response.status
						console.log('FACEBOOK Places Search ERROR:\n', 'status - ' + err.response.status, '\n',
							'status text- ' + err.response.statusText, '\n')
						next(err)
					})
			}))

			bizData = filledBizData
			console.log('\nFinal bizData sent back (sample 1 business)', bizData.businesses[0])
			res.json(bizData)
		})
		.catch((err) => {
			console.log('YELP Fusion Business Search ERROR\n', err, '\n')
			next(err)
		})

})

// handle any client-side routing that is not going to those specified above (non-"API" GET calls)
app.get('*', (req, res) =>{
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// custom error handler
const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === 'ValidationError') {
		return res.status(400).send({error: err.message})
	}
  
	// pass to default Express error handler
	next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`)
})
