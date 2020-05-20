const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/register', async (req, res) => {
	const body = req.body
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const newUser = new User ({
		username: body.email,
		passwordHash : passwordHash,
		firstName: body.firstName,
		lastName: body.lastName
	})

	const savedUser = await newUser.save()
	res.json(savedUser)
})

module.exports = usersRouter