const router = require('express').Router()
const logger = require('../utils/logger')
let User = require('../models/user.model')

router.route('/').post((req, res) => {
	User.findById(req.user.id, function(err, currUser){
		if (err) {
			logger.error(`Could not get current user: ${err}`)
		} 
		
		else {
			res.json(currUser)
		}
	})
})