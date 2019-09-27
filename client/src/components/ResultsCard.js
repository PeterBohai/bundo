import React, { Component } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route} from "react-router-dom";
import "../stylesheets/ResultsCard.css";
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



function ResultsCard(props) {
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

	const address = props.biz.address.map((line) => <p key={props.biz.indexID}>{line}</p>);
	let hours = null;
	if (props.biz.isOpen === "Open now") {
		hours = <p className="biz-hours"><strong>Hours: </strong><span className="open">{props.biz.isOpen}</span></p>;
	} else {
		hours = <p className="biz-hours closed"><strong>Hours: </strong><span className="closed">{props.biz.isOpen}</span></p>;
	}
	
	return (
		<div className="col-lg-4 col-md-6 mb-4">				
			<div className="card shadow-sm h-100">
				<img src={props.biz.imageUrl} alt="" className="card-img-top"  />
				<div className="card-body">
					<h5 className="card-title">
						{props.biz.indexID + ". "} <Link className="biz-link" to="#">{props.biz.name}</Link></h5>
					<div className="card-text">

						{/* YELP section */}
						<div className="jumbotron yelp-data">
							
							<div className="yelp-review-section">
								<div className="yelp-rating">
									{ratingImage}
								</div>
								
								<p className="yelp-review-count">{props.biz.reviewCount} reviews</p>
							</div>

							<img src="https://s3-media2.fl.yelpcdn.com/assets/srv0/styleguide/1ea40efd80f5/assets/img/brand_guidelines/yelp_fullcolor.png" alt=""  width="22%" className="yelp-logo"/>

							<div className="price-category">
								<p>{props.biz.price} {'\u00A0'} • {'\u00A0'} Category</p>
							</div>

							<div className="biz-info-section">
								<div className="jumbotron biz-address">
									{address}
								</div>
								
								<p className="biz-phone"><strong>Phone: </strong>{props.biz.phone}</p>
								{hours}

							</div>

							<div className="biz-url">
								<a target="_blank" rel="noopener noreferrer" href={props.biz.yelpUrl} className="external-anchor">Go to Yelp</a>
							</div>
							
						</div>
					
						{/* GOOGLE Reviews section */}


						{/* TRIPADVISOR section */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ResultsCard;