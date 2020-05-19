const router = require('express').Router()
const passport = require('passport')
const logger = require('../utils/logger')
let User = require('../models/user.model')

router.route('/').post((req, res) => {
	User.register({email: req.body.email}, req.body.password, function(err, user) {
		if (err){
			logger.error(err)
			res.redirect('/register')	
		} else {
			passport.authenticate('local', {failureRedirect: '/register'})(req, res, function(){
				logger.info('Successful local registration')
			})
		}
	})
})
