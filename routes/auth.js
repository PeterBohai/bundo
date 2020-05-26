const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
const logger = require('../utils/logger')

authRouter.post('/register', async (req, res, next) => {
	const body = req.body
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const newUser = new User ({
		username: body.email,
		passwordHash : passwordHash,
		firstName: body.firstName,
		lastName: body.lastName
	})

	const savedUser = await newUser.save().catch(err => {next(err)})
	logger.info('Successfully registered with the email:', savedUser.username)
	res.json(savedUser)
})

authRouter.post('/login', async (req, res) => {
	const body = req.body
	
	// returns null if query is not found (even if email is empty or undefined)
	const user = await User.findOne({username: body.email})

	const correctPassword = user === null 
		? false
		: await bcrypt.compare(body.password, user.passwordHash)

	if (!(user && correctPassword)) {
		logger.error('Invalid username or password entered')
		
		return res.status(401).json({
			error: 'Invalid username or password'
		})
	}

	const userInfo = {
		username: user.username,
		id: user._id
	}
	const token = jwt.sign(userInfo, config.SECRET)
	
	logger.info('Successfully logged in with the email:', user.username)
	logger.info('Sending authentication token and user info to client')
	res.status(200).json({
		token, 
		username: user.username, 
		firstName: user.firstName,
		lastName: user.lastName,
		bookmarks: user.bookmarks,
		id: user._id.toString()
	})
})

authRouter.post('/verify', async (req, res, next) => {

	const decoded = jwt.verify(req.body.token, config.SECRET)

	const user = await User.findById(decoded.id).catch(err => {
		logger.error('findByID error occured while verifying token')
		next(err)
	})
	
	if (user === null){
		logger.error('Incorrect id credential in authentication token')
		return res.status(400).json({valid: false})
	}

	logger.info('User token and id verified successfully')
	res.status(200).json({valid: true})
})

module.exports = authRouter