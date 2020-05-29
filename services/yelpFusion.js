const axios = require('axios')
const config = require('../utils/config')
const logger = require('../utils/logger')

const baseUrl = 'https://api.yelp.com/v3'
const headers = {
	Authorization: `Bearer ${config.YELP_API_KEY}`
}

const businessSearch = (term, location, next) => {
	const options = {
		headers,
		params: {
			term,
			location,
			limit: 3
		}
	}
	const req = axios.get(`${baseUrl}/businesses/search`, options)
		.catch(err => {
			logger.error('YELP Fusion Business Search', err)
			next(err)
		})

	return req.then(response => response.data)
}

const businessDetailsFromId = (yelpID) => {
	const options = {
		headers
	}
	const req = axios.get(`${baseUrl}/businesses/${yelpID}`, options)
		.catch(err => {
			logger.error('YELP Fusion Business Details', err)
			throw new Error('YELP Fusion Business Details', err)
		})

	return req.then(response => response.data)
}

module.exports = {
	businessSearch,
	businessDetailsFromId
}