const logger = require('./logger')

const errorHandler = (err, req, res, next) => {
	logger.error(err.message)

	if (err.name === 'ValidationError') {
		return res.status(400).json({error: err.message})
	} else if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({error: 'Invalid token'})
	}
  
	// pass to default Express error handler for all other errors
	next(err)
}

module.exports = {
	errorHandler
}