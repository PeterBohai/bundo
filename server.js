const cors = require('cors')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')
const path = require('path')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const searchRouter = require('./routes/search')
const userRouter = require('./routes/account')
const bizRouter = require('./routes/biz')
const User = require('./models/user')

const app = express()

app.use(cors({credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('client/build'))		// Serve static React build for 3001 or production url
app.use(morgan(logger.httpLogFormat))		// HTTP request logger

// configure authentication with session and passport
app.use(session({secret: config.SECRET, resave: false, saveUninitialized: false})) 
app.use(passport.initialize())
app.use(passport.session())

// authentication flags
let authenticated = false
let emailError = ''
let authError = ''
let userInfo = {}

mongoose.connect(config.MONGO_ATLAS_URI, {
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false}
)
	.then(() => {
		logger.info('Connected to MongoDB Atlas')
	})
	.catch(err => {
		logger.error('Error connecting to MongoDB Atlas: ', err.message)
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
app.use('/search', searchRouter)
app.use('/account', userRouter)
app.use('/biz', bizRouter)

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
	authError = 'Invalid email or password'
	res.json({isAuthenticated: false})
})

app.get('/check-auth', (req, res) => {
	emailError = ''
	authError = ''
	if (authenticated) {
		logger.info('Authenticated [/check-auth]')
		logger.info(req.user)
		res.json({isAuthenticated: true})
	} else {
		logger.info('Not Authenticated [/check-auth]')
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
			logger.error(err)
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
		
		userInfo.email = req.user.username
		userInfo.firstName = req.user.firstName
		userInfo.lastName = req.user.lastName
		userInfo.bookmarks = req.user.bookmarks
		logger.debug('Basic current user info [/login]', userInfo)
		
		res.json({isAuthenticated: true})
	} else {
		authError = 'Invalid email or password'
		authenticated = false
		res.json({isAuthenticated: false})
	}

})

app.post('/save', (req, res, next) => {
	let savedBiz = req.body.targetBusiness

	if (req.body.save){
		User.findOneAndUpdate({username: userInfo.email}, {$push: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				next(err)
			} else {
				logger.info('Added a new bookmark to current user! [/save]')
				userInfo.bookmarks = result.bookmarks
				logger.debug(userInfo.bookmarks)
				// userInfo.bookmarks = req.user.bookmarks;
			}
		})
	} else {
		User.findOneAndUpdate({username: userInfo.email}, {$pull: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				next(err)
			} else {
				logger.info('Deleted a new bookmark from current user! [/save]')
				userInfo.bookmarks = result.bookmarks
				logger.debug(userInfo.bookmarks)
			}
		})
	}
	

})

// reroute any client-side paths (not handled by server)
app.get('*', (req, res) =>{
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// custom error handler
app.use(middleware.errorHandler)

const port = config.PORT || 3001
app.listen(port, () => {
	logger.info(`Server started on PORT ${port}`)
})
