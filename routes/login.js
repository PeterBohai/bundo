const router = require('express').Router()
let User = require('../models/user.model')

router.route('/').post((req, res) => {
	User.findById(req.user.id, function(err, currUser){
		if (err) {
			console.log(`Error getting current user: ${err}`)
		} 
		
		else {
			res.json(currUser)
		}
	})
})