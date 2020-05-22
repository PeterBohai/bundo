import React, { useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import queryString from 'query-string'
import { trackPromise } from 'react-promise-tracker'
import ResultsCard from './ResultsCard'
import LoadingIndicator from './LoadingIndicator'
import '../stylesheets/SearchResults.css'

const SearchResults = () => {
	const [results, setResults] = useState([])
	const location = useLocation()
	const params = queryString.parse(location.search)
	
	const hook = () => {
		trackPromise(
			axios.post('/api/search', {
				searchDesc: params.find_desc,
				searchLoc: params.find_loc
			})
				.then(response => {
					setResults(response.data.businesses)
				})
				.catch(err => {
					console.log(err)
				})
		) 
	}
	useEffect(hook, [])

	const resultCards = results.map(biz => 
		<ResultsCard key={biz.yelpID} biz={biz} authenticated={false} inAccountPage={false}/>
	)

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