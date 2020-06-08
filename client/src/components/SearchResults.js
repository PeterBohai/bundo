import React, { useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import queryString from 'query-string'
import { trackPromise } from 'react-promise-tracker'
import authService from '../services/authentication'
import BizCard from './BizCard'
import Footer from './Footer'
import NavBar from './NavBar'
import LoadingIndicator from './LoadingIndicator'
import '../stylesheets/SearchResults.css'

const SearchResults = () => {
	const [results, setResults] = useState([])
	const [authenticated, setAuthenticated] = useState(null)
	const [user, setUser] = useState({
		bookmarks: []
	})
	const location = useLocation()
	const params = queryString.parse(location.search)
	
	const hook = () => {
		trackPromise(
			axios.post('/api/search', {
				searchDesc: params.find_desc,
				searchLoc: params.find_loc
			})
				.then(async (response) => {
					const isValid = await authService.authenticated()
					setAuthenticated(isValid)
					if (isValid) {
						setUser(JSON.parse(window.localStorage.getItem('currentBundoUser')))
					}
					setResults(response.data.businesses)
				})
				.catch(err => {
					console.log(err)
				})
		)
		authService.authenticated().then(isValid => {
			setAuthenticated(isValid)
			if (isValid) {
				setUser(JSON.parse(window.localStorage.getItem('currentBundoUser')))
			}
			
		})
	}
	useEffect(hook, [])

	const resultCards = results.map(biz => {
		const saved = authenticated && user.bookmarks.some(entry => entry.yelpID === biz.yelpID)

		return <BizCard key={biz.yelpID} biz={biz} authenticated={authenticated} bookmarked={saved}/>
	})

	return (
		<div className="search-results">
			<NavBar fixedTop={true} authenticated={authenticated} user={user}/>

			<div className="search-results-main">
				<div className="results-subtitle text-center">
					<div className="term-subtitle">
						{params.find_desc} 
						<p className="location-subtitle">{params.find_loc}</p>
					</div>
					<hr className="subtitle-hr"></hr>
					<LoadingIndicator />
				</div>

				<div className="card-results fluid-container">
					<div className="row">
						{resultCards}
					</div>
				</div>
			</div>

			<Footer />

		</div>
	)
}

export default SearchResults