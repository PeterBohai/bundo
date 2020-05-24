const userDetailsRouter = require('express').Router()
const logger = require('../utils/logger')
const User = require('../models/user')

userDetailsRouter.post('/details', (req, res) => {
	const userID = req.body.userid
	
	User.findById(userID)
		.then(user => {
			if (user === null) {
				logger.error(`Could not fetch user details with ID: ${userID}`)
				return res.status(401).json({error: `Could not find user with ID: ${userID}`})
			}
			logger.info('Successfully fetched user details')
			res.json(user)
			
		})

})

module.exports = userDetailsRouter
