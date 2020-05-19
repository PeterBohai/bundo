const router = require('express').Router()
const logger = require('../utils/logger')
let User = require('../models/user')

router.route('/').get((req, res) => {
	if (req.isAuthenticated()) {
		User.findById(req.user.id, function(err, currUser){
			if (err) {
				logger.error(`Error getting current user: ${err}`)
			} 
			else {
				res.json(currUser)
			}
		})
	} else {
		logger.error('Not logged in. Log in to access account information')
	}
	
})

module.exports = router