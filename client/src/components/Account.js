import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'
import '../stylesheets/Account.css'
import BizCard from './BizCard'
import temp_pfp from '../images/bundo-profile.jpg'

const Account = () => {
	const [userInfo, setUserInfo] = useState({
		firstName: '',
		lastName: '',
		bookmarks: JSON.parse(window.localStorage.getItem('currentBundoUser')).bookmarks
	})
	const [results, setResults] = useState([])
	const location = useLocation()
	const userid = queryString.parse(location.search).userid

	const userDetailsHook = () => {
		axios.post('/api/user/details', {
			userid : userid
		})
			.then(response => {
				setUserInfo(response.data)
				Promise.all(userInfo.bookmarks.map((biz, index) => {
					return axios.post('/api/search/details', {
						index,
						yelpID: biz.yelpID,
						googleID: biz.googleID,
						facebookID: biz.facebookID
					})
						.then(bizData => bizData.data)
				}))
					.then (bizDataResults => setResults(bizDataResults))
			})
			.catch(err => console.log(err))
	}
	useEffect(userDetailsHook, [])
	
	// make sure Yelp internal server error (from loading too soon after bookmarking) will not crash page
	results.forEach(biz => {
		if (biz.yelpError) {
			window.location.reload()
		}
	})

	const resultCards = results.map(biz => {
		return <BizCard key={biz.yelpID} biz={biz} authenticated={true} bookmarked={true}/>
	})

	return (
		<div className="Account">
			
			<div className="header">
				<div className="navbar navbar-expand-md justify-content-center">
					<Link className="navbar-brand" to="/">Bundo</Link>
				</div>
			</div>

			<div className="main">
				<div className="basic-profile-info jumbotron">
					<div className="container">
						<div className="profile-pic-name-container">
							<img className="profile-pic" src={temp_pfp} width="124px" alt="profile" />
							<h1 className="profile-name">{userInfo.firstName} {userInfo.lastName}</h1>
						</div>
					</div>
				</div>

				<div className="profile-content container">
					<p className="bookmarks-title">Bookmarks</p>
					
					<div className="card-results">
						<div className="row">
							{resultCards}
						</div>
					</div>
				</div>
			</div>
				
		</div>
	)
}

export default Account