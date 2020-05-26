const searchRouter = require('express').Router()
const axios = require('axios')
const config = require('../utils/config')
const logger = require('../utils/logger')

searchRouter.post('/', (req, res, next) => {
	const searchBody = req.body
	let bizData = { businesses: [] }

	// make request to YELP
	axios.get('https://api.yelp.com/v3/businesses/search', {
		headers: {
			Authorization: `Bearer ${config.YELP_API_KEY}`
		},
		params: {
			term: searchBody.searchDesc,
			location: searchBody.searchLoc,
			limit: 6
		}
	})
		.then(response =>  {	
			const yelpData = response.data
			yelpData.businesses.forEach((business, index) => {
				// let displayAddress = business.location.display_address.join(", ");
				let availability = ''
				if (business.is_closed) {
					availability = 'Closed'
				} else {
					availability = 'Open now'
				}

				bizData.businesses.push({
					indexID: index + 1,
					yelpID: business.id,
					error: false,
					name: business.name,
					imageUrl: business.image_url,
					yelpRating: business.rating,
					yelpReviewCount: business.review_count,
					price: business.price,
					address: business.location.display_address,
					phone: business.phone,
					displayPhone: business.display_phone,
					isOpen: availability,
					yelpUrl: business.url,
					latitude: business.coordinates.latitude,
					longitude: business.coordinates.longitude
				})

			})
			
			return bizData
		})
		.then(async (filledBizData) => { 
			await Promise.all(filledBizData.businesses.map( async (biz) => {
				
				// query Google Places API (search for place_id first and then get Details data)
				const phoneInput = '%2B' + biz.phone.slice(1)
				await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${config.GOOGLE_API_KEY}&input=${phoneInput}&inputtype=phonenumber`)
					.then(response => {
						
						if (response.data.status === 'OK' && response.data.candidates.length >= 0) {
							return response.data.candidates[0].place_id
						} 
						else {
							logger.error('GOOGLE Failed to find business using phone number\n', response.data)
							logger.info('GOOGLE Attempting to look for place_id again with business name')
						
							return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${config.GOOGLE_API_KEY}&input=${biz.name}&inputtype=textquery`)
								.then(response => {
									if (response.data.status === 'OK' && response.data.candidates.length >= 0) {
										return response.data.candidates[0].place_id
									} else {
										logger.error('GOOGLE Failed to find business using biz name\n', response.data)
									}
								})
								.catch(err => {
									logger.error('GOOGLE Place Search: ', err)
									next(err)
								})
						}
					})
					.then(async (googlePlaceId) => {
						await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
							params: {
								key: config.GOOGLE_API_KEY,
								place_id: googlePlaceId,
								fields: 'rating,user_ratings_total,url,formatted_phone_number'
							}
						})
							.then(detailsResponse => {
								biz.googleRating = Math.round( detailsResponse.data.result.rating * 10 ) / 10
								biz.googleReviewCount = detailsResponse.data.result.user_ratings_total
								biz.googleUrl = detailsResponse.data.result.url
		
								// set phone number of business if Yelp couldn't find a phone number for it
								if (biz.displayPhone === undefined || biz.displayPhone.length === 0 ) {
									biz.displayPhone = detailsResponse.data.result.formatted_phone_number
								}
							})
							.catch(err => {
								logger.error('GOOGLE Place Details: ', err)
								next(err)
							})

					})
					.catch(err => {
						logger.error('GOOGLE Place Search/Detials: ', err)
						next(err)
					})
				
				
				// query Facebook Grpahs API (search for id first then get Information data)
				const fbAccessToken = `${config.FACEBOOK_APP_ID}|${config.FACEBOOK_APP_SECRET}`
				let queryName = biz.name
				// if (biz.name.indexOf(' ') !== -1) {
				// 	queryName = biz.name.substr(0, biz.name.indexOf(' '))
				// }

				await axios.get('https://graph.facebook.com/search', {
					params: {
						type: 'place',
						center: `${biz.latitude},${biz.longitude}`,
						q: queryName,
						limit: 2,
						access_token: fbAccessToken
					}
				})
					.then(response => {
						logger.debug(response.data.data)
						return response.data.data[0].id
					})
					.then(async (fbPlaceId) => {
						await axios.get(`https://graph.facebook.com/v7.0/${fbPlaceId}`, {
							params: {
								fields: 'overall_star_rating,rating_count,link',
								access_token: fbAccessToken
							}
						})
							.then(infoResponse => {
								biz.fbRating = infoResponse.data.overall_star_rating
								biz.fbReviewCount = infoResponse.data.rating_count
								biz.fbUrl = infoResponse.data.link
								logger.debug(biz)
							})
							.catch(err => {
								biz.error = err.response.status
								logger.error('FACEBOOK Places Information:\n', `status - ${err.response.status}\n`,
									`msg - ${err.response.statusText}`)
								next(err)
							})
					})
					.catch(err => {
						biz.error = err.response.status
						if (err.response.status === 403) {
							logger.error('FACEBOOK Places Search: check API query limit')
						} else {
							logger.error('FACEBOOK Places Search:\n', `status - ${err.response.status}\n`,
								`msg - ${err.response.statusText}`)
						}
						
					})
			}))

			bizData = filledBizData
			logger.debug('Final bizData sent back (sample 1 business)', bizData.businesses[0])
			res.json(bizData)
		})
		.catch((err) => {
			logger.error('YELP Fusion Business Search: ', err)
			next(err)
		})

})

module.exports = searchRouter