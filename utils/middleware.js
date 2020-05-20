const logger = require('logger')

const errorHandler = (err, req, res, next) => {
	logger.error(err.message)

	if (err.name === 'ValidationError') {
		return res.status(400).send({error: err.message})
	}
  
	// pass to default Express error handler
	next(err)
}

module.exports = {
	errorHandler
}