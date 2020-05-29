const axios = require('axios')
const config = require('../utils/config')
const logger = require('../utils/logger')

const baseUrl = 'https://graph.facebook.com'
const appAccessToken = `${config.FACEBOOK_APP_ID}|${config.FACEBOOK_APP_SECRET}`

const pagesSearch = (name, lat, long) => {
	const options = {
		params: {
			type: 'place',
			center: `${lat},${long}`,
			q: name,
			limit: 2,
			access_token: appAccessToken
		}
	}
	const req = axios.get(`${baseUrl}/search`, options)
		.catch(err => {
			const errStatus = err.response.status
			const errMessage = err.response.statusText
			
			logger.error('FACEBOOK Pages Search:', `status ${errStatus} -`,
				errMessage)
			if (errStatus === 403) {
				logger.error('FACEBOOK Pages Search: Check API query limit')
			} 
			throw new Error(`Error ${errStatus} ${errMessage}`)
		})

	return req.then(response => response.data)
}

const placeInfo = (placeId) => {
	const options = {
		params: {
			fields: 'overall_star_rating,rating_count,link',
			access_token: appAccessToken
		}
	}
	const req = axios.get(`${baseUrl}/v7.0/${placeId}`, options)
		.catch(err => {
			const errStatus = err.response.status
			const errMessage = err.response.statusText
			
			logger.error('FACEBOOK Place Info:', `status ${errStatus} -`,
				errMessage)
			if (errStatus === 403) {
				logger.error('FACEBOOK Place Info: Check API query limit')
			} 
			throw new Error(`Error ${errStatus} ${errMessage}`)
		})

	return req.then(response => response.data)
}

module.exports = {
	pagesSearch,
	placeInfo
}