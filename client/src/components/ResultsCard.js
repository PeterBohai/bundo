import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import "../stylesheets/ResultsCard.css";
import axios from "axios";
import yelp_0 from "../images/yelp_stars/regular/regular_0.png";
import yelp_1 from "../images/yelp_stars/regular/regular_1.png";
import yelp_15 from "../images/yelp_stars/regular/regular_1_half.png";
import yelp_2 from "../images/yelp_stars/regular/regular_2.png";
import yelp_25 from "../images/yelp_stars/regular/regular_2.png";
import yelp_3 from "../images/yelp_stars/regular/regular_3.png";
import yelp_35 from "../images/yelp_stars/regular/regular_3_half.png";
import yelp_4 from "../images/yelp_stars/regular/regular_4.png";
import yelp_45 from "../images/yelp_stars/regular/regular_4_half.png";
import yelp_5 from "../images/yelp_stars/regular/regular_5.png";
import googleAttr from "../images/google/powered_by_google_on_white.png";
import facebookLogo from "../images/facebook/facebook_logo.png";

let root_url = "https://bundo-reviews.herokuapp.com";
// let test_url = "http://localhost:3001";

function ResultsCard(props) {
	
	function saveClickHandler(e) {
		e.preventDefault();
		if (props.authenticated) {
			console.log("save button was clicked");
			console.log("Yelp ID is:" + props.biz.yelpID);
			
			axios.post(root_url + "/save", {
				targetBusiness: props.biz,
				save: true
			})
				.then(response => {
					console.log("SAVED");
				});
		} else {
			console.log("Need to be signed in to bookmark");
			alert("Sign in to bookmark");
		}
		
	}

	function unsaveClickHandler(e) {
		e.preventDefault();
		console.log("unsave button was clicked");
		console.log("Yelp ID is:" + props.biz.yelpID);
		
		axios.post(root_url +"save", {
			targetBusiness: props.biz,
			save: false
		})
			.then(response => {
				console.log("UNSAVED");
			});
	}

	// different yelp ratings image 
	let ratingImage = null;
	switch (props.biz.rating) {
	case 0:
		ratingImage = <img src={yelp_0} alt="" />;
		break;
	case 1:
		ratingImage = <img src={yelp_1} alt="" />;
		break;
	case 1.5:
		ratingImage = <img src={yelp_15} alt="" />;
		break;
	case 2:
		ratingImage = <img src={yelp_2} alt="" />;
		break;
	case 2.5:
		ratingImage = <img src={yelp_25} alt="" />;
		break;
	case 3:
		ratingImage = <img src={yelp_3} alt="" />;
		break;
	case 3.5:
		ratingImage = <img src={yelp_35} alt="" />;
		break;
	case 4:
		ratingImage = <img src={yelp_4} alt="" />;
		break;
	case 4.5:
		ratingImage = <img src={yelp_45} alt="" />;
		break;
	case 5:
		ratingImage = <img src={yelp_5} alt="" />;
		break;
	default:
		ratingImage = <img src={yelp_0} alt="" />;
		
	}

	// different colored open/close status display
	const address = props.biz.address.map((line, i) => <p key={i}>{line}</p>);
	let hours = null;
	if (props.biz.isOpen === "Open now") {
		hours = <p className="biz-hours"><strong>Hours: </strong><span className="open">{props.biz.isOpen}</span></p>;
	} else {
		hours = <p className="biz-hours closed"><strong>Hours: </strong><span className="closed">{props.biz.isOpen}</span></p>;
	}
	
	let saveUnsaveBtn = null;
	if (!props.isBookmark) {
		saveUnsaveBtn = 
		<div className="bookmark-section text-center">
			<button className="btn btn-outline-danger save-button" onClick={saveClickHandler}>Save</button>
		</div>;
	} else {
		saveUnsaveBtn = 
		<div className="bookmark-section-un text-center">
			<button className="btn btn-outline-secondary save-button" onClick={unsaveClickHandler}>Unsave</button>
		</div>;
	}


	// different google ratings
	let googleRatingImage = [];
	for (let i = 0; i < 5; i++) {
		if (i + 1 <= Math.floor(props.biz.googleRatings)) {
			googleRatingImage.push(<FontAwesomeIcon icon={faStar} key={"google" + props.biz.yelpID + i}/>);
		} else {
			if (i + 1 > Math.ceil(props.biz.googleRatings)){
				googleRatingImage.push(<FontAwesomeIcon icon={faStarReg} key={"google" + props.biz.yelpID + i}/>);
			} else if (props.biz.googleRatings - Math.floor(props.biz.googleRatings) >= 0.8) {
				googleRatingImage.push(<FontAwesomeIcon icon={faStar} key={"google" + props.biz.yelpID + i}/>);
			} else if(props.biz.googleRatings - Math.floor(props.biz.googleRatings) >= 0.3) {
				googleRatingImage.push(<FontAwesomeIcon icon={faStarHalfAlt} key={"google" + props.biz.yelpID + i}/>);
			} else {
				googleRatingImage.push(<FontAwesomeIcon icon={faStarReg} key={"google" + props.biz.yelpID + i}/>);
			}

		}
	}

	let facebookSection = null;
	if (!props.biz.error) {
		facebookSection = 
		<div className="jumbotron facebook-data">
			<div className="facebook-logo-container">
				<img src={facebookLogo} alt="" className="facebook-logo" width="80px"/>
			</div>

			<div className="facebook-review-section">
				<div className="facebook-rating">
					{props.biz.fbRatings}
				</div>
				
				<p className="facebook-review-count">{props.biz.fbReviewCount} opinions</p>
			</div>

			<div className="biz-url">
				<a target="_blank" rel="noopener noreferrer" href={props.biz.fbUrl} className="external-anchor">View on Facebook</a>
			</div>
		
		</div>;
	}
	console.log(props);
	return (
		<div className="col-lg-4 col-md-6 mb-4" >				
			<div className="card shadow-sm h-100 ">
				<img src={props.biz.imageUrl} alt="" className="card-img-top"  />
				<div className="card-body">
					<h5 className="card-title">
						{props.biz.indexID + ". "} <Link className="biz-link" to="#">{props.biz.name}</Link>
					</h5>

					{saveUnsaveBtn}

					<div className="card-text">

						{/* YELP section */}
						<div className="jumbotron yelp-data">
							<div className="yelp-logo-container">
								<img src="https://s3-media2.fl.yelpcdn.com/assets/srv0/styleguide/1ea40efd80f5/assets/img/brand_guidelines/yelp_fullcolor.png" alt=""  width="25%" className="yelp-logo"/>
							</div>
							

							<div className="yelp-review-section">
								<div className="yelp-rating">
									{ratingImage}
								</div>
								
								<p className="yelp-review-count">{props.biz.reviewCount} reviews</p>
							</div>

							<div className="price-category">
								<p>{props.biz.price} {"\u00A0"} • {"\u00A0"} Category</p>
							</div>

							<div className="biz-info-section">
								<div className="jumbotron biz-address">
									{address}
								</div>
								
								<p className="biz-phone"><strong>Phone: </strong>{props.biz.displayPhone}</p>
								{hours}

							</div>

							<div className="biz-url">
								<a target="_blank" rel="noopener noreferrer" href={props.biz.yelpUrl} className="external-anchor">View on Yelp</a>
							</div>
							
						</div>
					
						{/* GOOGLE Reviews section */}
						<div className="jumbotron google-data">
							<div className="google-logo-container">
								<img src={googleAttr} alt="" className="google-logo"/>
							</div>

							<div className="google-review-section">
								<div className="google-rating">
									<p className="google-rating-num">{props.biz.googleRatings}</p>
									{googleRatingImage}
								</div>
								
								<p className="google-review-count">{props.biz.googleReviewCount} reviews</p>
							</div>

							<div className="biz-url">
								<a target="_blank" rel="noopener noreferrer" href={props.biz.googleUrl} className="external-anchor">View on Google</a>
							</div>
							
						</div>

						{/* FACEBOOK Places section */}
						{facebookSection}

					</div>
				</div>
			</div>
		</div>
	);
}

export default ResultsCard;