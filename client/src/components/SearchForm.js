import React, { useState }from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import '../stylesheets/Home.css'

const SearchForm = () => {
	const [findDesc, setFindDesc] = useState('')
	const [findLoc, setFindLoc] = useState('')
	const history = useHistory()
	const location = useLocation()

	const handleSubmit = (event) => {
		event.preventDefault()
		const searchResultsLocation = {
			pathname: '/query/search',
			search: `?find_desc=${encodeURIComponent(findDesc)}&find_loc=${encodeURIComponent(findLoc)}`
		}
		history.push(searchResultsLocation)
	}

	return (
		<div className="home-page text-right">
			<form className="home-page-form" onSubmit={handleSubmit}>
				<div className="form-row align-items-center">
					<div className="col-md-6">
						<label htmlFor="inputFind" className="sr-only">Find</label>
						<input 
							type="text" 
							id="inputFind" 
							className="form-control search-form" 
							placeholder="Find (Try &quot;Gyukaku&quot;)" required 
							value={findDesc} 
							onChange={({ target }) => setFindDesc(target.value)} 
						/>
					</div>

					<div className="col-md-6">
						<label htmlFor="inputLocation" className="sr-only">Near</label>
						<input 
							type="text" 
							id="inputLocation" 
							className="form-control search-form" 
							placeholder="Near (Try &quot;Vancouver&quot;)" required 
							value={findLoc} 
							onChange={({ target }) => setFindLoc(target.value)} 
						/>
					</div>

					<button
						type="submit"
						className="search-button btn btn-dark" 
					>
							Search
					</button>
				</div>
			</form>
		</div>
	)
}

export default SearchForm