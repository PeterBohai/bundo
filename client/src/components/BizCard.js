/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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

const BizCard = ({ biz, authenticated, bookmarked }) => {
	const [isSaved, setIsSaved] = useState(bookmarked)
	
	const saveUnsaveHandler = (event) => {
		event.preventDefault()
		if (authenticated) {
			const currUser = JSON.parse(window.localStorage.getItem('currentBundoUser'))
			
			if (!isSaved){
				currUser.bookmarks.push(biz.yelpID)
			} else {
				currUser.bookmarks = currUser.bookmarks.filter( id => id !== biz.yelpID)
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
		ratingImage = <img src={yelp_0} alt="" />
		break
	case 1:
		ratingImage = <img src={yelp_1} alt="" />
		break
	case 1.5:
		ratingImage = <img src={yelp_15} alt="" />
		break
	case 2:
		ratingImage = <img src={yelp_2} alt="" />
		break
	case 2.5:
		ratingImage = <img src={yelp_25} alt="" />
		break
	case 3:
		ratingImage = <img src={yelp_3} alt="" />
		break
	case 3.5:
		ratingImage = <img src={yelp_35} alt="" />
		break
	case 4:
		ratingImage = <img src={yelp_4} alt="" />
		break
	case 4.5:
		ratingImage = <img src={yelp_45} alt="" />
		break
	case 5:
		ratingImage = <img src={yelp_5} alt="" />
		break
	default:
		ratingImage = <img src={yelp_0} alt="" />
	}

	const address = biz.address.map((line, i) => <p key={i}>{line}</p>)

	const saveUnsaveButton = 
		<div className="bookmark-section text-center">
			<button 
				className={`btn btn-outline-${isSaved ? 'secondary' : 'danger'} save-button`}
				onClick={saveUnsaveHandler}
			>
				{isSaved ? 'Unsave' : 'Save'}
			</button>
		</div>

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

	const googleSection = 
		<div className="jumbotron google-data">
			<div className="google-logo-container">
				<img src={googleAttr} alt="" className="google-logo"/>
			</div>

			<div className="google-review-section">
				<div className="google-rating">
					<p className="google-rating-num">{biz.googleRating}</p>
					{googleRatingImage}
				</div>
				
				<p className="google-review-count">{biz.googleReviewCount} reviews</p>
			</div>

			<div className="biz-url">
				<a target="_blank" rel="noopener noreferrer" href={biz.googleUrl} className="external-anchor">View on Google</a>
			</div>
		</div>

	const facebookSection = 
		<div className="jumbotron facebook-data">
			<div className="facebook-logo-container">
				<img src={facebookLogo} alt="" className="facebook-logo" width="80px"/>
			</div>

			<div className="facebook-review-section">
				<div className="facebook-rating">
					{biz.fbRating}
				</div>
				
				<p className="facebook-review-count">{biz.fbReviewCount} opinions</p>
			</div>

			<div className="biz-url">
				<a target="_blank" rel="noopener noreferrer" href={biz.fbUrl} className="external-anchor">View on Facebook</a>
			</div>
		</div>
	
	return (
		<div className="col-lg-4 col-md-6 mb-4" >				
			<div className="card shadow-sm h-100 ">
				<img src={biz.imageUrl} alt="" className="card-img-top"  />
				<div className="card-body">
					<h5 className="card-title">
						{biz.indexID + '. '} <Link className="biz-link" to="#">{biz.name}</Link>
					</h5>

					{saveUnsaveButton}

					<div className="card-text">
						<div className="jumbotron yelp-data">
							<div className="yelp-logo-container">
								<img src="https://s3-media2.fl.yelpcdn.com/assets/srv0/styleguide/1ea40efd80f5/assets/img/brand_guidelines/yelp_fullcolor.png" alt=""  width="25%" className="yelp-logo"/>
							</div>
							<div className="yelp-review-section">
								<div className="yelp-rating">
									{ratingImage}
								</div>
								
								<p className="yelp-review-count">{biz.yelpReviewCount} reviews</p>
							</div>
							<div className="price-category">
								<p>{biz.price} {'\u00A0'} • {'\u00A0'} Category</p>
							</div>
							<div className="biz-info-section">
								<div className="jumbotron biz-address">
									{address}
								</div>
								<p className="biz-phone">
									<strong>Phone: </strong>{biz.displayPhone}
								</p>
								<p className={`biz-hours ${biz.isOpen === 'Open now' ? '' : 'closed'}`}>
									<strong>Hours: </strong><span className={biz.isOpen === 'Open now' ? 'open' : 'closed'}>{biz.isOpen}</span>
								</p>
							</div>

							<div className="biz-url">
								<a target="_blank" rel="noopener noreferrer" href={biz.yelpUrl} className="external-anchor">View on Yelp</a>
							</div>
							
						</div>

						{googleSection}

						{biz.error ? null : facebookSection}
					</div>
				</div>
			</div>
		</div>
	)
}

export default BizCard