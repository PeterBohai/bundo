const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

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
		return res.status(401).json({
			error: 'Invalid username or password'
		})
	}

	const userInfo = {
		username: user.username,
		id: user._id
	}
	const token = jwt.sign(userInfo, config.SECRET)
	res.status(200).json({
		token, 
		username: user.username, 
		firstName: user.fristName,
		lastName: user.lastName
	})
})

module.exports = authRouter