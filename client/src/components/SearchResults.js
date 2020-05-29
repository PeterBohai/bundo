import React, { useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import queryString from 'query-string'
import { trackPromise } from 'react-promise-tracker'
import BizCard from './BizCard'
import LoadingIndicator from './LoadingIndicator'
import authService from '../services/authentication'
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
			<div className="header">
				<div className="navbar navbar-expand-md fixed-top justify-content-center">
					<Link className="navbar-brand" to="/">Bundo</Link>
				</div>
			</div>

			<div className="mid-section">
				
				<div className="jumbotron text-center page-title-content">
					<div className="container page-title-content-container">
						<h2 className="term-title">
							{params.find_desc} 
							<p className="location-title">{params.find_loc}</p>
						</h2>
					</div>
					<hr className="bizResults-hr"></hr>
					<LoadingIndicator />
				</div>

				<div className="fluid-container card-results">
					<div className="row">
						{resultCards}
					</div>
				</div>
				
			</div>

		</div>
	)
}

export default SearchResults