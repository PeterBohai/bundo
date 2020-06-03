/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'
import '../stylesheets/BizCard.css'
import yelp_0 from '../images/yelp_stars/regular/regular_0.png'
import yelp_1 from '../images/yelp_stars/regular/regular_1.png'
import yelp_15 from '../images/yelp_stars/regular/regular_1_half.png'
import yelp_2 from '../images/yelp_stars/regular/regular_2.png'
import yelp_25 from '../images/yelp_stars/regular/regular_2.png'
import yelp_3 from '../images/yelp_stars/regular/regular_3.png'
import yelp_35 from '../images/yelp_stars/regular/regular_3_half.png'
import yelp_4 from '../images/yelp_stars/regular/regular_4.png'
import yelp_45 from '../images/yelp_stars/regular/regular_4_half.png'
import yelp_5 from '../images/yelp_stars/regular/regular_5.png'
import googleAttr from '../images/google/powered_by_google_on_white.png'
import facebookLogo from '../images/facebook/facebook_logo.png'
import yelpLogo from '../images/yelp_logo.png'

const BizCard = ({ biz, authenticated, bookmarked }) => {
	const location = useLocation()
	const [isSaved, setIsSaved] = useState(bookmarked)
	
	const saveUnsaveHandler = (event) => {
		event.preventDefault()
		if (authenticated) {
			const currUser = JSON.parse(window.localStorage.getItem('currentBundoUser'))
			
			if (!isSaved){
				currUser.bookmarks.push({
					yelpID: biz.yelpID,
					googleID: biz.googleID,
					facebookID: biz.facebookID
				})
			} else {
				currUser.bookmarks = currUser.bookmarks.filter( entry => entry.yelpID !== biz.yelpID)	
			}
			
			// Update user bookmarks on client side
			window.localStorage.setItem('currentBundoUser', JSON.stringify(currUser))
			// Update user bookmarks in the database
			axios.post('/api/user/bookmark', {
				userid: currUser.id,
				updatedBookmarks: currUser.bookmarks,
			})
				.then(response => {
					console.log(`Updated bookmarks in database successfully: ${response.data.newBookmarks}`)
					setIsSaved(!isSaved)
					if (location.pathname.includes('/user/details')){
						window.location.reload()
					}
				})
				.catch(err => {
					console.log(`Error updating bookmark to database: ${err.response.data.error}`)
				})
		} else {
			alert('Log in to bookmark')
		}	
	}

	// different yelp ratings image 
	let ratingImage = null
	switch (biz.yelpRating) {
	case 0:
		ratingImage = <img src={yelp_0} alt="Yelp 0 stars" />
		break
	case 1:
		ratingImage = <img src={yelp_1} alt="Yelp 1 stars" />
		break
	case 1.5:
		ratingImage = <img src={yelp_15} alt="Yelp 1 and a half stars" />
		break
	case 2:
		ratingImage = <img src={yelp_2} alt="Yelp 2 stars" />
		break
	case 2.5:
		ratingImage = <img src={yelp_25} alt="Yelp 2 and a half  stars" />
		break
	case 3:
		ratingImage = <img src={yelp_3} alt="Yelp 3 stars" />
		break
	case 3.5:
		ratingImage = <img src={yelp_35} alt="Yelp 3 and a half  stars" />
		break
	case 4:
		ratingImage = <img src={yelp_4} alt="Yelp 4 stars" />
		break
	case 4.5:
		ratingImage = <img src={yelp_45} alt="Yelp 4 and a half  stars" />
		break
	case 5:
		ratingImage = <img src={yelp_5} alt="Yelp 5 stars" />
		break
	default:
		ratingImage = <img src={yelp_0} alt="Yelp 0 stars" />
	}

	const address = biz.address.map((line, i) => <p key={i} className="address-line">{line}</p>)

	const saveUnsaveButton = 
		<button 
			className={`btn btn-outline-${isSaved ? 'secondary' : 'danger'} save-button`}
			onClick={saveUnsaveHandler}
		>
			{isSaved ? 'Unsave' : 'Save'}
		</button>
	

	// different google ratings
	let googleRatingImage = []
	for (let i = 0; i < 5; i++) {
		if (i + 1 <= Math.floor(biz.googleRating)) {
			googleRatingImage.push(<FontAwesomeIcon icon={faStar} key={'google' + biz.yelpID + i}/>)
		} else {
			if (i + 1 > Math.ceil(biz.googleRating)){
				googleRatingImage.push(<FontAwesomeIcon icon={faStarReg} key={'google' + biz.yelpID + i}/>)
			} else if (biz.googleRating - Math.floor(biz.googleRating) >= 0.8) {
				googleRatingImage.push(<FontAwesomeIcon icon={faStar} key={'google' + biz.yelpID + i}/>)
			} else if(biz.googleRating - Math.floor(biz.googleRating) >= 0.3) {
				googleRatingImage.push(<FontAwesomeIcon icon={faStarHalfAlt} key={'google' + biz.yelpID + i}/>)
			} else {
				googleRatingImage.push(<FontAwesomeIcon icon={faStarReg} key={'google' + biz.yelpID + i}/>)
			}

		}
	}


	const newYelp = 
		<div className="review-subsection">
			<div className="middle">
				<img className="yelp-logo" src={yelpLogo} alt=""  width="55px"/>
				<div className="review-site-bizinfo">
					<div className="review-site-url">
						<a className="external-anchor" target="_blank" rel="noopener noreferrer" href={biz.yelpUrl}>View source</a>
					</div>
					<div className="yelp-rating">
						<div className="yelp-rating-num">
							{isNaN(biz.yelpRating) ? biz.yelpRating :(Math.round(biz.yelpRating * 100) / 100).toFixed(1)}
						</div>
						<div className="yelp-rating-img">
							{ratingImage}
						</div>
					</div>
					<p className="yelp-review-count">{biz.yelpReviewCount} reviews</p>
				</div>
			</div>

			
		</div>
	
	const newGoogle = 
		<div className="review-subsection">
			<div className="middle">
				<img className="google-logo" src={googleAttr} alt="" />
				<div className="review-site-bizinfo">
					<div className="review-site-url">
						<a className="external-anchor" target="_blank" rel="noopener noreferrer" href={biz.googleUrl} >View source</a>
					</div>
					<div className="google-rating">
						<p className="google-rating-num">
							{isNaN(biz.googleRating) ? biz.googleRating : (Math.round(biz.googleRating * 100) / 100).toFixed(1)}
						</p>
						{googleRatingImage}
					</div>
					<p className="google-review-count">{biz.googleReviewCount} reviews</p>
				</div>
			</div>
		</div>

	const newFacebook = 
		<div className="review-subsection">
			<div className="middle">
				<img className="facebook-logo" src={facebookLogo} alt=""  width="65px"/>
				<div className="review-site-bizinfo">
					<div className="review-site-url">
						<a className="external-anchor" target="_blank" rel="noopener noreferrer" href={biz.fbUrl}>View source</a>
					</div>
					<p className="test-facebook-rating">
						{isNaN(biz.fbRating) ? biz.fbRating : (Math.round(biz.fbRating * 100) / 100).toFixed(1)}
					</p>
					<p className="facebook-review-count">{biz.fbReviewCount} opinions</p>
				</div>
			</div>
		</div>

	
	return (
		<div className="col-12 bizcard" >				
			<div className="card mb-4 container-fluid bizcard-card">
				<div className="row">
					<div className="col-md-3 bizcard-img-col">
						<div className="outer">
							<div className="middle">
								<img src={biz.imageUrl} className="card-img" alt={biz.name}/>
							</div>
						</div>
					</div>
					<div className="col-md-9 bizcard-col-wrapper">
						<div className="card-body bizcard-body">
							<h5 className="card-title bizcard-title">{biz.indexID + '. ' +biz.name}</h5>
							
							<div className="bizcard-info-section">
								<div className="outer">
									<div className="middle">
										<div className="biz-address">
											{address}
										</div>
										<p className="biz-basic-info">
											<strong>Price: </strong>{biz.price}
										</p>
										<p className="biz-basic-info">
											<strong>Phone: </strong>{biz.displayPhone}
										</p>
										<p className="biz-basic-info">
											<strong>Hours: </strong><span className={biz.isOpen === 'Open now' ? 'open' : 'closed'}>{biz.isOpen}</span>
										</p>
										<div className="card-save-button">
											{saveUnsaveButton}
										</div>
										
									</div>
								</div>
							</div>

							<div className="bizcard-review-section">
								{newYelp}
								<hr className="review-subsection-hr"></hr>
								{newGoogle}
								<hr className="review-subsection-hr"></hr>
								{newFacebook}
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

export default BizCard