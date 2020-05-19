const morgan = require('morgan')
const chalk = require('chalk')

const inProduction = process.env.NODE_ENV === 'production'
const timestampLog = () => {
	const date = new Date()
	return chalk.dim(`[${date.getTime()}]`)
}

const info = (...params) => {
	// Heroku provides timestamps for logs already
	if (inProduction) {
		console.log(chalk.green('INFO'), ...params)
	} else {
		console.log(timestampLog(), chalk.green('INFO'), ...params)
	}	
}

const debug = (...params) => {
	if (inProduction) {
		console.debug(chalk.yellow('DEBUG'), ...params)
	} else {
		console.debug(timestampLog(), chalk.yellow('DEBUG'), ...params)
	}
}

const error = (...params) => {
	if (inProduction) {
		console.error(chalk.red('ERROR'), ...params)
	} else {
		console.error(timestampLog(), chalk.red('ERROR'), ...params)
	}
}

morgan.token('milliDate', () =>  {
	return timestampLog()
})
morgan.token('body', req =>  {
	const logBody = req.body
	if (logBody.password) {
		logBody.password = '*'.repeat(logBody.password.length)
	}
	return JSON.stringify(logBody, null, 4)
})

// output format for morgan (HTTP request logger middleware)
const httpLogFormat = (tokens, req, res) => {
	const reqBodyToken = Object.keys(req.body).length === 0 ? '' : `\nReq Body: ${tokens.body(req)}`
	return [
		tokens.milliDate(), chalk.blueBright('HTTP'),
		chalk.magenta(tokens.method(req, res)),
		tokens.url(req, res),
		chalk.cyan(`status[${chalk.white(tokens.status(req, res))}]`),
		tokens['response-time'](req, res), 'ms',
		reqBodyToken
	].join(' ')
}

module.exports = {
	info, debug, error, httpLogFormat
}