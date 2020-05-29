const axios = require('axios')
const config = require('../utils/config')
const logger = require('../utils/logger')

const baseUrl = 'https://maps.googleapis.com/maps/api/place'

const placeSearch = (input, inputType) => {
	const validInput = inputType === 'phonenumber' ? 
		'%2B' + input.slice(1) 
		: input

	const req = axios.get(
		`${baseUrl}/findplacefromtext/json?key=${config.GOOGLE_API_KEY}&input=${validInput}&inputtype=${inputType}`
	)
		.catch(err => {
			logger.error('GOOGLE Place Search', err)
			throw new Error('GOOGLE Place Search', err)
		})

	return req.then(response => response.data)
}

const placeDetail = (placeId) => {
	const options = {
		params: {
			key: config.GOOGLE_API_KEY,
			place_id: placeId,
			fields: 'rating,user_ratings_total,url,formatted_phone_number'
		}
	}
	const req = axios.get(`${baseUrl}/details/json`, options)
		.catch(err => {
			logger.error('GOOGLE Place Details', err)
			throw new Error('GOOGLE Place Search', err)
		})

	return req.then(response => response.data)
}

module.exports = {
	placeSearch,
	placeDetail
}