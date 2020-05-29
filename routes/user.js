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

userDetailsRouter.post('/bookmark', (req, res) => {
	const userID = req.body.userid
	const updatedBookmarks = req.body.updatedBookmarks
	
	User.findByIdAndUpdate(userID, {bookmarks: updatedBookmarks}, { new: true })
		.then(updatedUser => {
			if (updatedUser === null) {
				logger.error(`Could not update bookmarks for user details with ID: ${userID}`)
				return res.status(401).json({error: `Could not find user with ID: ${userID}`})
			}
			logger.info('Successfully fetched user details')
			res.json({newBookmarks: updatedUser.bookmarks})
			
		})
})

module.exports = userDetailsRouter
