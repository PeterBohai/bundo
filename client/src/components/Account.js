import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'
import '../stylesheets/Account.css'
import Footer from './Footer'
import BizCard from './BizCard'
import temp_pfp from '../images/bundo-profile.jpg'

const Account = () => {
	const [userInfo, setUserInfo] = useState({
		firstName: '',
		lastName: '',
		bookmarks: []
	})
	const location = useLocation()
	const userid = queryString.parse(location.search).userid

	const hook = () => {
		axios.post('/api/user/details', {
			userid : userid
		})
			.then(response => {
				setUserInfo(response.data)
			})
			.catch(err => {
				console.log(err)
			})
	}
	useEffect(hook, [])

	const bookmarkCards = userInfo.bookmarks.length > 0 ? 
		userInfo.bookmarks.map((bizID) => <li key={bizID}>{bizID}</li>)
		: null

	let footer = 
	<div className="footer-section-empty">
		<Footer />
	</div>

	if (userInfo.bookmarks !== undefined && userInfo.bookmarks.length > 0){
		footer = <div className="footer-section">
			<Footer />
		</div>
	}

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
						</div>
					</div>
					<ul>
						{bookmarkCards}
					</ul>
				</div>
			</div>
			{footer}	
		</div>
	)
}

export default Account